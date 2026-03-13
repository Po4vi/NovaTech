"""IMAP email ingestion service for automated scam scanning."""

from __future__ import annotations

import imaplib
import logging
import os
import re
from dataclasses import dataclass
from email import message_from_bytes, policy
from email.header import decode_header, make_header
from email.message import Message
from html import unescape
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


def _get_bool_env(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _get_int_env(name: str, default: int) -> int:
    value = os.getenv(name)
    if value is None:
        return default
    try:
        return int(value)
    except ValueError:
        logger.warning("Invalid integer for %s=%r. Falling back to %d", name, value, default)
        return default


def _mask_email(email_value: str) -> str:
    if not email_value or "@" not in email_value:
        return ""
    local, domain = email_value.split("@", 1)
    if len(local) <= 2:
        masked_local = "*" * len(local)
    else:
        masked_local = local[:2] + "*" * (len(local) - 2)
    return f"{masked_local}@{domain}"


@dataclass
class EmailIntegrationConfig:
    imap_host: str
    imap_port: int
    username: str
    password: str
    mailbox: str
    default_limit: int
    default_unread_only: bool
    poll_seconds: int
    poll_mark_as_seen: bool

    @classmethod
    def from_env(cls) -> "EmailIntegrationConfig":
        return cls(
            imap_host=os.getenv("EMAIL_IMAP_HOST", "").strip(),
            imap_port=_get_int_env("EMAIL_IMAP_PORT", 993),
            username=os.getenv("EMAIL_IMAP_USERNAME", "").strip(),
            password=os.getenv("EMAIL_IMAP_PASSWORD", "").strip(),
            mailbox=os.getenv("EMAIL_IMAP_MAILBOX", "INBOX").strip() or "INBOX",
            default_limit=max(1, _get_int_env("EMAIL_SCAN_DEFAULT_LIMIT", 10)),
            default_unread_only=_get_bool_env("EMAIL_SCAN_DEFAULT_UNREAD_ONLY", True),
            poll_seconds=max(0, _get_int_env("EMAIL_SCAN_POLL_SECONDS", 0)),
            poll_mark_as_seen=_get_bool_env("EMAIL_SCAN_POLL_MARK_AS_SEEN", True),
        )


class EmailIngestionService:
    """Pulls inbound emails from an IMAP inbox for scam analysis."""

    def __init__(self, config: Optional[EmailIntegrationConfig] = None):
        self.config = config or EmailIntegrationConfig.from_env()

    def refresh_from_env(self) -> None:
        self.config = EmailIntegrationConfig.from_env()

    def is_configured(self) -> bool:
        return bool(self.config.imap_host and self.config.username and self.config.password)

    def get_status(self) -> Dict[str, Any]:
        return {
            "configured": self.is_configured(),
            "imap_host": self.config.imap_host,
            "imap_port": self.config.imap_port,
            "mailbox": self.config.mailbox,
            "username_masked": _mask_email(self.config.username),
            "default_limit": self.config.default_limit,
            "default_unread_only": self.config.default_unread_only,
            "poll_seconds": self.config.poll_seconds,
            "poll_mark_as_seen": self.config.poll_mark_as_seen,
        }

    def fetch_messages(
        self,
        limit: Optional[int] = None,
        unread_only: Optional[bool] = None,
        mark_as_seen: bool = False,
    ) -> List[Dict[str, Any]]:
        """Fetch latest messages from IMAP inbox.

        Returns newest-first message entries with subject, sender, date, and body text.
        """
        if not self.is_configured():
            raise RuntimeError("Email IMAP integration is not configured.")

        effective_limit = max(1, limit if limit is not None else self.config.default_limit)
        effective_unread_only = (
            unread_only if unread_only is not None else self.config.default_unread_only
        )

        search_criteria = "UNSEEN" if effective_unread_only else "ALL"
        messages: List[Dict[str, Any]] = []

        try:
            with imaplib.IMAP4_SSL(self.config.imap_host, self.config.imap_port) as mailbox:
                mailbox.login(self.config.username, self.config.password)
                status, _ = mailbox.select(self.config.mailbox)
                if status != "OK":
                    raise RuntimeError("Failed to open configured IMAP mailbox.")

                status, data = mailbox.search(None, search_criteria)
                if status != "OK" or not data:
                    return messages

                ids = data[0].split()
                if not ids:
                    return messages

                selected_ids = list(reversed(ids[-effective_limit:]))

                for msg_id in selected_ids:
                    status, payload = mailbox.fetch(msg_id, "(BODY.PEEK[])")
                    if status != "OK" or not payload:
                        continue

                    raw_bytes = self._extract_raw_bytes(payload)
                    if not raw_bytes:
                        continue

                    parsed = message_from_bytes(raw_bytes, policy=policy.default)
                    parsed_message = self._normalize_message(msg_id.decode("utf-8", errors="ignore"), parsed)
                    messages.append(parsed_message)

                    if mark_as_seen:
                        mailbox.store(msg_id, "+FLAGS", "\\Seen")

        except imaplib.IMAP4.error as exc:
            raise RuntimeError("IMAP authentication/connection failed. Verify IMAP credentials.") from exc
        except OSError as exc:
            raise RuntimeError("Unable to reach IMAP server. Check host, port, and network.") from exc

        return messages

    def _normalize_message(self, uid: str, msg: Message) -> Dict[str, Any]:
        subject = self._decode_header_value(msg.get("subject", ""))
        sender = self._decode_header_value(msg.get("from", ""))
        date = self._decode_header_value(msg.get("date", ""))
        message_id = self._decode_header_value(msg.get("message-id", ""))
        body = self._extract_text_body(msg).strip()

        return {
            "uid": uid,
            "message_id": message_id,
            "subject": subject,
            "from": sender,
            "date": date,
            "body": body,
        }

    @staticmethod
    def _extract_raw_bytes(payload: List[Any]) -> bytes:
        for chunk in payload:
            if isinstance(chunk, tuple) and len(chunk) >= 2 and isinstance(chunk[1], (bytes, bytearray)):
                return bytes(chunk[1])
        return b""

    @staticmethod
    def _decode_header_value(value: str) -> str:
        if not value:
            return ""
        try:
            return str(make_header(decode_header(value)))
        except (ValueError, TypeError):
            return value

    def _extract_text_body(self, msg: Message) -> str:
        if msg.is_multipart():
            plain_parts: List[str] = []
            html_parts: List[str] = []

            for part in msg.walk():
                disposition = (part.get_content_disposition() or "").lower()
                if disposition == "attachment":
                    continue

                part_type = part.get_content_type()
                text = self._decode_part_payload(part)
                if not text:
                    continue

                if part_type == "text/plain":
                    plain_parts.append(text)
                elif part_type == "text/html":
                    html_parts.append(text)

            if plain_parts:
                return "\n".join(plain_parts)
            if html_parts:
                return self._strip_html("\n".join(html_parts))
            return ""

        payload = self._decode_part_payload(msg)
        if msg.get_content_type() == "text/html":
            return self._strip_html(payload)
        return payload

    @staticmethod
    def _decode_part_payload(part: Message) -> str:
        try:
            payload = part.get_payload(decode=True)
            if payload is None:
                raw_payload = part.get_payload()
                return raw_payload if isinstance(raw_payload, str) else ""

            charset = part.get_content_charset() or "utf-8"
            return payload.decode(charset, errors="replace")
        except (LookupError, UnicodeDecodeError, AttributeError):
            return ""

    @staticmethod
    def _strip_html(html_content: str) -> str:
        content = re.sub(r"(?is)<(script|style).*?>.*?(</\1>)", " ", html_content)
        content = re.sub(r"(?s)<[^>]+>", " ", content)
        content = unescape(content)
        return re.sub(r"\s+", " ", content).strip()
