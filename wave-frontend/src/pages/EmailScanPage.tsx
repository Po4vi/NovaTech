import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileDown,
  FileJson,
  Filter,
  Inbox,
  MailSearch,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldX,
} from "lucide-react";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import {
  fetchEmailIntegrationStatus,
  scanEmailInbox,
  type EmailIntegrationStatus,
  type EmailScanItem,
  type EmailScanResponse,
} from "@/services/api";

const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.035)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 20,
  padding: "24px 28px",
};

const innerCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 14,
  padding: "16px 16px",
};

const levelPalette: Record<string, { main: string; bg: string; border: string }> = {
  SAFE: {
    main: "#22c55e",
    bg: "rgba(34,197,94,0.09)",
    border: "rgba(34,197,94,0.26)",
  },
  SUSPICIOUS: {
    main: "#f59e0b",
    bg: "rgba(245,158,11,0.09)",
    border: "rgba(245,158,11,0.26)",
  },
  SCAM: {
    main: "#ef4444",
    bg: "rgba(239,68,68,0.09)",
    border: "rgba(239,68,68,0.26)",
  },
};

type RiskFilter = "ALL" | "SAFE" | "SUSPICIOUS" | "SCAM" | "ERROR";
type SortMode = "risk_desc" | "risk_asc" | "newest";

function riskIcon(level: string) {
  if (level === "SAFE") return <Shield size={14} color="#22c55e" />;
  if (level === "SUSPICIOUS") return <ShieldAlert size={14} color="#f59e0b" />;
  return <ShieldX size={14} color="#ef4444" />;
}

function csvEscape(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

function toDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function EmailScanPage() {
  const navigate = useNavigate();

  const [status, setStatus] = useState<EmailIntegrationStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [scanLimit, setScanLimit] = useState(10);
  const [unreadOnly, setUnreadOnly] = useState(true);
  const [markAsSeen, setMarkAsSeen] = useState(false);

  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const [scanRuns, setScanRuns] = useState<EmailScanResponse[]>([]);
  const [activeRunIndex, setActiveRunIndex] = useState(0);

  const [riskFilter, setRiskFilter] = useState<RiskFilter>("ALL");
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("risk_desc");

  const refreshStatus = useCallback(async () => {
    setStatusLoading(true);
    setStatusError(null);

    try {
      const response = await fetchEmailIntegrationStatus();
      setStatus(response);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch integration status.";
      setStatusError(message);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const handleScan = useCallback(async () => {
    if (!status?.configured) {
      setScanError("Email integration is not configured in backend env vars.");
      return;
    }

    setScanLoading(true);
    setScanError(null);

    try {
      const result = await scanEmailInbox({
        limit: scanLimit,
        unread_only: unreadOnly,
        mark_as_seen: markAsSeen,
      });

      setScanRuns((prev) => {
        const next = [result, ...prev];
        return next.slice(0, 12);
      });
      setActiveRunIndex(0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Inbox scan failed.";
      setScanError(message);
    } finally {
      setScanLoading(false);
      refreshStatus();
    }
  }, [markAsSeen, refreshStatus, scanLimit, status?.configured, unreadOnly]);

  const activeRun = scanRuns[activeRunIndex] ?? null;

  const filteredRows = useMemo(() => {
    if (!activeRun) return [] as EmailScanItem[];

    const lowerQuery = query.trim().toLowerCase();

    let rows = activeRun.results.filter((item) => {
      if (riskFilter === "ERROR") {
        return Boolean(item.error);
      }

      if (riskFilter !== "ALL") {
        if (item.error) return false;
        return item.analysis?.risk_level === riskFilter;
      }

      return true;
    });

    if (lowerQuery) {
      rows = rows.filter((item) => {
        const subject = item.email.subject.toLowerCase();
        const sender = item.email.from.toLowerCase();
        const firstReason = item.analysis?.reasons?.[0]?.toLowerCase() ?? "";
        return subject.includes(lowerQuery) || sender.includes(lowerQuery) || firstReason.includes(lowerQuery);
      });
    }

    if (sortMode === "risk_desc") {
      rows = [...rows].sort((a, b) => (b.analysis?.risk_score ?? -1) - (a.analysis?.risk_score ?? -1));
    } else if (sortMode === "risk_asc") {
      rows = [...rows].sort((a, b) => (a.analysis?.risk_score ?? 999) - (b.analysis?.risk_score ?? 999));
    } else {
      rows = [...rows].sort((a, b) => {
        const aDate = new Date(a.email.date).getTime();
        const bDate = new Date(b.email.date).getTime();
        return (Number.isNaN(bDate) ? 0 : bDate) - (Number.isNaN(aDate) ? 0 : aDate);
      });
    }

    return rows;
  }, [activeRun, query, riskFilter, sortMode]);

  const summary = useMemo(() => {
    const list = activeRun?.results ?? [];
    return {
      total: list.length,
      safe: list.filter((i) => i.analysis?.risk_level === "SAFE").length,
      suspicious: list.filter((i) => i.analysis?.risk_level === "SUSPICIOUS").length,
      scam: list.filter((i) => i.analysis?.risk_level === "SCAM").length,
      errors: list.filter((i) => i.error).length,
    };
  }, [activeRun]);

  const exportFilteredCsv = useCallback(() => {
    if (!activeRun) return;

    const header = [
      "subject",
      "from",
      "date",
      "risk_level",
      "risk_score",
      "reason_1",
      "status",
    ];

    const lines = filteredRows.map((item) => {
      const row = [
        item.email.subject || "(no subject)",
        item.email.from || "(unknown sender)",
        item.email.date || "",
        item.analysis?.risk_level ?? "N/A",
        String(item.analysis?.risk_score ?? ""),
        item.analysis?.reasons?.[0] ?? "",
        item.error ? "analysis_failed" : "ok",
      ];
      return row.map((entry) => csvEscape(entry)).join(",");
    });

    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    toDownload(blob, `email-scan-filtered-${stamp}.csv`);
  }, [activeRun, filteredRows]);

  const exportActiveJson = useCallback(() => {
    if (!activeRun) return;
    const payload = JSON.stringify(activeRun, null, 2);
    const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    toDownload(blob, `email-scan-full-${stamp}.json`);
  }, [activeRun]);

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#050508" }}>
      <BackgroundBeamsWithCollision>
        <div
          style={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            padding: "28px 16px 72px",
            overflowY: "auto",
          }}
        >
          <div style={{ width: "100%", maxWidth: 1040, display: "flex", flexDirection: "column", gap: 16 }}>
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}
            >
              <motion.button
                onClick={() => navigate("/project")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#c4d9e6",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                whileHover={{ y: -1, background: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft size={14} />
                Back To Interceptor
              </motion.button>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <MailSearch size={18} color="#22d3ee" />
                <h1
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                    color: "#e8f8ff",
                  }}
                >
                  Email Scan Control Room
                </h1>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              style={{
                ...glassCard,
                background:
                  "radial-gradient(circle at 10% 0%, rgba(14,165,233,0.18), transparent 45%), radial-gradient(circle at 95% 100%, rgba(239,68,68,0.14), transparent 48%), rgba(8,11,18,0.88)",
                border: "1px solid rgba(34,211,238,0.24)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <div style={{ ...innerCard, borderColor: "rgba(34,211,238,0.24)" }}>
                  <p style={{ fontSize: "0.66rem", color: "#8ba8ba", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    IMAP Status
                  </p>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: status?.configured ? "#22c55e" : "#f59e0b", marginTop: 6 }}>
                    {statusLoading ? "Checking..." : status?.configured ? "Connected" : "Not Configured"}
                  </p>
                </div>

                <div style={{ ...innerCard, borderColor: "rgba(255,255,255,0.12)" }}>
                  <p style={{ fontSize: "0.66rem", color: "#8ba8ba", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Inbox User
                  </p>
                  <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#cde8f5", marginTop: 6 }}>
                    {status?.username_masked || "-"}
                  </p>
                </div>

                <div style={{ ...innerCard, borderColor: "rgba(255,255,255,0.12)" }}>
                  <p style={{ fontSize: "0.66rem", color: "#8ba8ba", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Auto Poll
                  </p>
                  <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#cde8f5", marginTop: 6 }}>
                    {status?.poll_seconds && status.poll_seconds > 0 ? `${status.poll_seconds}s` : "Disabled"}
                  </p>
                </div>

                <div style={{ ...innerCard, borderColor: "rgba(255,255,255,0.12)" }}>
                  <p style={{ fontSize: "0.66rem", color: "#8ba8ba", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Mailbox
                  </p>
                  <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#cde8f5", marginTop: 6 }}>
                    {status?.mailbox || "INBOX"}
                  </p>
                </div>
              </div>

              <div
                style={{
                  ...innerCard,
                  borderColor: "rgba(34,211,238,0.18)",
                  background: "rgba(9,16,24,0.66)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: 10,
                }}
              >
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: "0.7rem", color: "#8ba8ba", fontWeight: 600 }}>Limit Per Scan</span>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={scanLimit}
                    onChange={(e) => {
                      const parsed = Number.parseInt(e.target.value, 10);
                      if (Number.isNaN(parsed)) {
                        setScanLimit(1);
                        return;
                      }
                      setScanLimit(Math.min(100, Math.max(1, parsed)));
                    }}
                    style={{
                      borderRadius: 10,
                      height: 38,
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#e8f8ff",
                      padding: "0 10px",
                    }}
                  />
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "#cde8f5", paddingTop: 20 }}>
                  <input
                    type="checkbox"
                    checked={unreadOnly}
                    onChange={(e) => setUnreadOnly(e.target.checked)}
                    style={{ accentColor: "#22d3ee" }}
                  />
                  Unread Only
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "#cde8f5", paddingTop: 20 }}>
                  <input
                    type="checkbox"
                    checked={markAsSeen}
                    onChange={(e) => setMarkAsSeen(e.target.checked)}
                    style={{ accentColor: "#f59e0b" }}
                  />
                  Mark As Seen
                </label>

                <div style={{ display: "flex", alignItems: "end", gap: 8 }}>
                  <motion.button
                    onClick={refreshStatus}
                    disabled={statusLoading}
                    style={{
                      height: 38,
                      padding: "0 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: "rgba(255,255,255,0.07)",
                      color: "#d3ebf7",
                      cursor: statusLoading ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 600,
                    }}
                    whileHover={statusLoading ? {} : { y: -1 }}
                    whileTap={statusLoading ? {} : { scale: 0.98 }}
                  >
                    <RefreshCw size={14} style={statusLoading ? { animation: "spin 1s linear infinite" } : {}} />
                    Refresh
                  </motion.button>

                  <motion.button
                    onClick={handleScan}
                    disabled={scanLoading || !status?.configured}
                    style={{
                      height: 38,
                      padding: "0 14px",
                      borderRadius: 10,
                      border: "none",
                      background: scanLoading || !status?.configured
                        ? "rgba(34,211,238,0.25)"
                        : "linear-gradient(135deg, #22d3ee, #67e8f9)",
                      color: "#052332",
                      fontWeight: 800,
                      cursor: scanLoading || !status?.configured ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: scanLoading || !status?.configured ? "none" : "0 10px 25px rgba(34,211,238,0.25)",
                    }}
                    whileHover={scanLoading || !status?.configured ? {} : { y: -1 }}
                    whileTap={scanLoading || !status?.configured ? {} : { scale: 0.98 }}
                  >
                    {scanLoading ? (
                      <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} />
                    ) : (
                      <Inbox size={14} />
                    )}
                    {scanLoading ? "Scanning" : "Run Inbox Scan"}
                  </motion.button>
                </div>
              </div>

              {statusError && (
                <p style={{ marginTop: 10, fontSize: "0.75rem", color: "#fda4af" }}>
                  {statusError}
                </p>
              )}
              {scanError && (
                <p style={{ marginTop: 10, fontSize: "0.75rem", color: "#fda4af" }}>
                  {scanError}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={glassCard}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Filter size={14} color="#f59e0b" />
                  <h2 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f3f3fc" }}>
                    Filter, Search, Export
                  </h2>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <motion.button
                    onClick={exportFilteredCsv}
                    disabled={!activeRun || filteredRows.length === 0}
                    style={{
                      height: 34,
                      padding: "0 10px",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.06)",
                      color: "#d6edf8",
                      cursor: !activeRun || filteredRows.length === 0 ? "not-allowed" : "pointer",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                    whileHover={!activeRun || filteredRows.length === 0 ? {} : { y: -1 }}
                    whileTap={!activeRun || filteredRows.length === 0 ? {} : { scale: 0.98 }}
                  >
                    <FileDown size={13} />
                    Export CSV
                  </motion.button>

                  <motion.button
                    onClick={exportActiveJson}
                    disabled={!activeRun}
                    style={{
                      height: 34,
                      padding: "0 10px",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.06)",
                      color: "#d6edf8",
                      cursor: !activeRun ? "not-allowed" : "pointer",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                    whileHover={!activeRun ? {} : { y: -1 }}
                    whileTap={!activeRun ? {} : { scale: 0.98 }}
                  >
                    <FileJson size={13} />
                    Export JSON
                  </motion.button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 12 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: "0.68rem", color: "#8b8b9e", fontWeight: 600 }}>Scan Session</span>
                  <select
                    value={activeRunIndex}
                    onChange={(e) => setActiveRunIndex(Number.parseInt(e.target.value, 10))}
                    style={{
                      height: 36,
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#e0e0f0",
                      padding: "0 8px",
                    }}
                  >
                    {scanRuns.length === 0 ? (
                      <option value={0}>No scans yet</option>
                    ) : (
                      scanRuns.map((run, idx) => (
                        <option key={`${run.metadata.timestamp}-${idx}`} value={idx}>
                          {new Date(run.metadata.timestamp).toLocaleString()} | {run.analyzed_count} analyzed
                        </option>
                      ))
                    )}
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: "0.68rem", color: "#8b8b9e", fontWeight: 600 }}>Risk Filter</span>
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value as RiskFilter)}
                    style={{
                      height: 36,
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#e0e0f0",
                      padding: "0 8px",
                    }}
                  >
                    <option value="ALL">All Results</option>
                    <option value="SCAM">SCAM</option>
                    <option value="SUSPICIOUS">SUSPICIOUS</option>
                    <option value="SAFE">SAFE</option>
                    <option value="ERROR">Errors</option>
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: "0.68rem", color: "#8b8b9e", fontWeight: 600 }}>Sort</span>
                  <select
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value as SortMode)}
                    style={{
                      height: 36,
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#e0e0f0",
                      padding: "0 8px",
                    }}
                  >
                    <option value="risk_desc">Risk High To Low</option>
                    <option value="risk_asc">Risk Low To High</option>
                    <option value="newest">Newest Email Date</option>
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: "0.68rem", color: "#8b8b9e", fontWeight: 600 }}>Search</span>
                  <div style={{ position: "relative" }}>
                    <Search size={13} color="#6b6b80" style={{ position: "absolute", left: 8, top: 11 }} />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Subject, sender, reason..."
                      style={{
                        height: 36,
                        width: "100%",
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.04)",
                        color: "#e0e0f0",
                        padding: "0 8px 0 30px",
                        fontSize: "0.8rem",
                      }}
                    />
                  </div>
                </label>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                <span style={{ fontSize: "0.68rem", color: "#8ba8ba", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 10px" }}>
                  Total: {summary.total}
                </span>
                <span style={{ fontSize: "0.68rem", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 999, padding: "4px 10px" }}>
                  SAFE: {summary.safe}
                </span>
                <span style={{ fontSize: "0.68rem", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 999, padding: "4px 10px" }}>
                  SUSPICIOUS: {summary.suspicious}
                </span>
                <span style={{ fontSize: "0.68rem", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 999, padding: "4px 10px" }}>
                  SCAM: {summary.scam}
                </span>
                <span style={{ fontSize: "0.68rem", color: "#fda4af", border: "1px solid rgba(244,114,182,0.3)", borderRadius: 999, padding: "4px 10px" }}>
                  ERRORS: {summary.errors}
                </span>
                <span style={{ fontSize: "0.68rem", color: "#93c5fd", border: "1px solid rgba(147,197,253,0.3)", borderRadius: 999, padding: "4px 10px" }}>
                  Showing: {filteredRows.length}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={glassCard}
            >
              <h2 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f3f3fc", marginBottom: 12 }}>
                Scan Results
              </h2>

              {filteredRows.length === 0 ? (
                <div style={{ ...innerCard, color: "#9ca3af", fontSize: "0.8rem" }}>
                  No results to show for current filter/search.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
                  {filteredRows.map((item, idx) => {
                    const level = item.analysis?.risk_level ?? "SAFE";
                    const palette = levelPalette[level] ?? levelPalette.SAFE;
                    const score = item.analysis?.risk_score ?? 0;
                    const reason = item.analysis?.reasons?.[0] || "No primary reason provided.";

                    return (
                      <motion.div
                        key={`${item.email.uid}-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        style={{
                          borderRadius: 12,
                          border: `1px solid ${item.error ? "rgba(244,114,182,0.28)" : palette.border}`,
                          background: item.error ? "rgba(244,114,182,0.08)" : palette.bg,
                          padding: "12px 12px 10px",
                        }}
                      >
                        <p style={{ fontSize: "0.77rem", fontWeight: 700, color: "#f3f3fc", marginBottom: 4, lineHeight: 1.35 }}>
                          {item.email.subject || "(No Subject)"}
                        </p>
                        <p style={{ fontSize: "0.7rem", color: "#8ba8ba", marginBottom: 4 }}>
                          {item.email.from || "Unknown sender"}
                        </p>
                        <p style={{ fontSize: "0.66rem", color: "#6b6b80", marginBottom: 8 }}>
                          {item.email.date ? new Date(item.email.date).toLocaleString() : "Unknown date"}
                        </p>

                        {item.error ? (
                          <p style={{ color: "#fda4af", fontSize: "0.74rem", fontWeight: 700 }}>
                            Could not analyze this email.
                          </p>
                        ) : (
                          <>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                              {riskIcon(level)}
                              <span style={{ color: palette.main, fontWeight: 800, fontSize: "0.7rem" }}>
                                {level}
                              </span>
                              <span style={{ color: "#c6d7e4", fontSize: "0.7rem", fontFamily: "var(--font-mono)", marginLeft: "auto" }}>
                                {score}/100
                              </span>
                            </div>
                            <p style={{ color: "#d7e8f2", fontSize: "0.72rem", lineHeight: 1.4 }}>
                              {reason}
                            </p>
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}

export default EmailScanPage;
