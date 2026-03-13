"""
FastAPI backend – Agentic AI Scam Interceptor
Endpoints:
  POST /api/analyze   – Analyze a message for scam indicators
    POST /api/integrations/email/scan   – Scan inbox emails and analyze for scams
    GET  /api/integrations/email/status – Check email integration configuration
  GET  /api/health    – Health check
  GET  /api/examples  – Sample messages for demo
  GET  /api/history   – Recent analysis results (in-memory)
"""

import logging
import asyncio
from datetime import datetime, timezone
from collections import deque
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from crew.scam_detection_crew import ScamDetectionCrew
from services.email_ingestion_service import EmailIngestionService

# ── Constants ─────────────────────────────────────────────────
VERSION = "2.0.0"

# ── Logging ────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger("scam-interceptor")

# ── App ────────────────────────────────────────────────────────
app = FastAPI(
    title="Agentic AI – Scam Interceptor",
    description="Multi-agent scam detection API by Team NovaTech",
    version=VERSION,
)

# ── CORS ───────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Crew singleton ─────────────────────────────────────────────
crew = ScamDetectionCrew()
email_service = EmailIngestionService()
email_poller_task: Optional[asyncio.Task] = None

# ── In-memory history (last 50) ────────────────────────────────
MAX_HISTORY = 50
history: deque = deque(maxlen=MAX_HISTORY)

# ── Request / Response models ──────────────────────────────────
class AnalyzeRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)


class AnalyzeResponse(BaseModel):
    risk_score: int
    risk_level: str
    reasons: List[str]
    recommendation: str
    details: Dict[str, Any]
    preprocessed: Dict[str, Any]
    metadata: Dict[str, Any]


class EmailScanRequest(BaseModel):
    limit: int = Field(default=10, ge=1, le=100)
    unread_only: bool = True
    mark_as_seen: bool = False


class EmailScanResponse(BaseModel):
    scanned_count: int
    analyzed_count: int
    results: List[Dict[str, Any]]
    metadata: Dict[str, Any]


# ── Sample messages ────────────────────────────────────────────
SAMPLE_MESSAGES: List[Dict[str, str]] = [
    {
        "label": "Bank Account Suspended Scam",
        "message": "URGENT: Your SBI account has been suspended due to incomplete KYC. Click here to verify immediately: http://sbi-verify.xyz/update. Failure to update within 24 hours will result in permanent account closure.",
    },
    {
        "label": "Lottery Prize Scam",
        "message": "Congratulations! You have won ₹25,00,000 in the Amazon Lucky Draw 2025! To claim your prize, pay the processing fee of ₹999. Click: http://bit.ly/claim-prize-now",
    },
    {
        "label": "OTP Theft Attempt",
        "message": "Dear customer, a transaction of ₹49,999 is being processed from your account. If not done by you, share your OTP with our support team immediately to block it. Call now: 9876543210",
    },
    {
        "label": "Job Scam",
        "message": "Earn ₹50,000 monthly working from home! No experience needed. Limited seats available. Register now at http://easy-jobs.online/apply and pay ₹499 registration fee.",
    },
    {
        "label": "Delivery / Package Scam",
        "message": "Your Amazon parcel is held at the warehouse. Update your delivery address to reschedule: http://192.168.1.1/track-delivery. Act now or package will be returned.",
    },
    {
        "label": "Safe Message (Genuine)",
        "message": "Hi! Just wanted to check if we're still meeting tomorrow at 3 PM for coffee. Let me know if the timing works for you. See you soon!",
    },
]


def _build_email_analysis_input(subject: str, body: str) -> str:
    clean_subject = subject.strip()
    clean_body = body.strip()

    if clean_subject and clean_body:
        return f"Subject: {clean_subject}\n\n{clean_body}"
    return clean_body or clean_subject


def _record_history(result: Dict[str, Any], message_preview: str, source: str) -> None:
    timestamp = result.get("metadata", {}).get("timestamp", datetime.now(timezone.utc).isoformat())
    history.append({
        "risk_score": result.get("risk_score", 0),
        "risk_level": result.get("risk_level", "UNKNOWN"),
        "message_preview": message_preview[:80] + ("..." if len(message_preview) > 80 else ""),
        "timestamp": timestamp,
        "source": source,
    })


async def _scan_and_analyze_email_messages(
    limit: int,
    unread_only: bool,
    mark_as_seen: bool,
    trigger: str,
) -> Dict[str, Any]:
    fetched_messages = await asyncio.to_thread(
        email_service.fetch_messages,
        limit,
        unread_only,
        mark_as_seen,
    )

    results: List[Dict[str, Any]] = []
    analyzed_count = 0

    for item in fetched_messages:
        subject = item.get("subject", "")
        body = item.get("body", "")
        sender = item.get("from", "")
        message_input = _build_email_analysis_input(subject, body)

        if not message_input.strip():
            continue

        try:
            analysis = await asyncio.to_thread(crew.analyze, message_input)
        except Exception:
            logger.exception("Failed to analyze email uid=%s", item.get("uid", ""))
            results.append({
                "email": {
                    "uid": item.get("uid", ""),
                    "message_id": item.get("message_id", ""),
                    "subject": subject,
                    "from": sender,
                    "date": item.get("date", ""),
                },
                "error": "analysis_failed",
            })
            continue

        analyzed_count += 1
        timestamp = datetime.now(timezone.utc).isoformat()

        analysis.setdefault("metadata", {})
        analysis["metadata"]["analysis_time_ms"] = analysis["metadata"].get("timing_ms", {}).get("total", 0)
        analysis["metadata"]["message_length"] = len(message_input)
        analysis["metadata"]["timestamp"] = timestamp
        analysis["metadata"]["source"] = "email_inbox"
        analysis["metadata"]["trigger"] = trigger
        analysis["metadata"]["email"] = {
            "uid": item.get("uid", ""),
            "message_id": item.get("message_id", ""),
            "subject": subject,
            "from": sender,
            "date": item.get("date", ""),
        }

        preview = subject.strip() or body.strip() or "(empty email body)"
        _record_history(analysis, preview, source="email_inbox")

        results.append({
            "email": analysis["metadata"]["email"],
            "analysis": analysis,
        })

    return {
        "scanned_count": len(fetched_messages),
        "analyzed_count": analyzed_count,
        "results": results,
        "metadata": {
            "trigger": trigger,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    }


async def _email_poller_loop() -> None:
    logger.info("Email poller loop started")

    while True:
        email_service.refresh_from_env()
        poll_seconds = email_service.config.poll_seconds

        if poll_seconds <= 0:
            await asyncio.sleep(30)
            continue

        if not email_service.is_configured():
            logger.warning("Email polling is enabled but IMAP credentials are missing.")
            await asyncio.sleep(poll_seconds)
            continue

        try:
            result = await _scan_and_analyze_email_messages(
                limit=email_service.config.default_limit,
                unread_only=email_service.config.default_unread_only,
                mark_as_seen=email_service.config.poll_mark_as_seen,
                trigger="auto_poll",
            )
            if result["analyzed_count"] > 0:
                logger.info("Auto poll analyzed %d email message(s)", result["analyzed_count"])
        except Exception:
            logger.exception("Email auto poll failed")

        await asyncio.sleep(poll_seconds)


# ── Endpoints ──────────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "service": "Agentic AI – Scam Interceptor",
        "team": "NovaTech",
        "version": VERSION,
        "endpoints": {
            "POST /api/analyze": "Analyze a message for scam indicators",
            "POST /api/integrations/email/scan": "Scan inbox emails and analyze for scams",
            "GET /api/integrations/email/status": "Check email integration status",
            "GET /api/health": "Health check",
            "GET /api/examples": "Sample scam messages for demo",
            "GET /api/history": "Recent analysis history",
            "GET /docs": "Interactive API documentation (Swagger UI)",
        },
    }


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_message(req: AnalyzeRequest):
    """Run the multi-agent scam detection pipeline."""
    message = req.message.strip()
    if not message:
        raise HTTPException(status_code=422, detail="Message cannot be empty or whitespace only.")

    logger.info("Analyzing message (%d chars)", len(message))

    try:
        # Offload synchronous crew pipeline to a thread pool to avoid blocking the event loop
        result = await asyncio.to_thread(crew.analyze, message)
    except Exception:
        logger.exception("Crew pipeline failed")
        raise HTTPException(status_code=500, detail="Analysis pipeline encountered an error. Please try again.")

    # Enrich metadata
    result.setdefault("metadata", {})
    result["metadata"]["analysis_time_ms"] = result["metadata"].get("timing_ms", {}).get("total", 0)
    result["metadata"]["message_length"] = len(message)
    result["metadata"]["timestamp"] = datetime.now(timezone.utc).isoformat()
    result["metadata"]["source"] = "manual_message"

    # Store in history
    _record_history(result, message, source="manual_message")

    logger.info(
        "Result: %s (score=%d) in %.1f ms",
        result["risk_level"],
        result["risk_score"],
        result["metadata"]["analysis_time_ms"],
    )
    return result


@app.get("/api/integrations/email/status")
async def email_integration_status():
    """Return current IMAP email integration status."""
    email_service.refresh_from_env()
    return email_service.get_status()


@app.post("/api/integrations/email/scan", response_model=EmailScanResponse)
async def scan_email_inbox(req: EmailScanRequest):
    """Fetch emails from IMAP inbox and run scam analysis for each message."""
    email_service.refresh_from_env()

    if not email_service.is_configured():
        raise HTTPException(
            status_code=400,
            detail=(
                "Email integration is not configured. Set EMAIL_IMAP_HOST, "
                "EMAIL_IMAP_USERNAME, and EMAIL_IMAP_PASSWORD."
            ),
        )

    try:
        return await _scan_and_analyze_email_messages(
            limit=req.limit,
            unread_only=req.unread_only,
            mark_as_seen=req.mark_as_seen,
            trigger="manual_api",
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception:
        logger.exception("Email scanning endpoint failed")
        raise HTTPException(status_code=500, detail="Email scanning failed. Please try again.")


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "scam-interceptor", "version": VERSION}


@app.get("/api/examples")
async def get_examples():
    return {"examples": SAMPLE_MESSAGES}


@app.get("/api/history")
async def get_history():
    """Return recent analysis summaries (newest first)."""
    return {"history": list(reversed(history)), "count": len(history)}


@app.on_event("startup")
async def startup_event():
    global email_poller_task
    email_poller_task = asyncio.create_task(_email_poller_loop())


@app.on_event("shutdown")
async def shutdown_event():
    global email_poller_task
    if email_poller_task and not email_poller_task.done():
        email_poller_task.cancel()
        try:
            await email_poller_task
        except asyncio.CancelledError:
            pass
