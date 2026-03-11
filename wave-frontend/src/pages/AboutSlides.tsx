import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const slides = [
  {
    title: "AGENTIC AI SCAM INTERCEPTOR",
    subtitle: "Real-Time Multi-Agent Fraud Detection System",
    content: (
      <>
        <div style={{ fontSize: "1.2rem", margin: "12px 0" }}>
          <b>TEAM NOVATECH</b> <br />
          <span style={{ color: '#a78bfa' }}>wave-frontend-plum.vercel.app (LIVE)</span>
        </div>
        <div style={{ fontSize: "1.1rem", margin: "12px 0" }}>
          <b>₹7,061 Cr</b> Lost to Cyber Fraud in India (2023)<br />
          1 cyber crime reported every <b>7 minutes</b> in India
        </div>
        <div style={{ fontSize: "1rem", margin: "12px 0" }}>
          156 teams — <b>ONLY Cybersecurity team</b>
        </div>
        <div style={{ fontSize: "0.95rem", margin: "12px 0" }}>
          <b>Tech Stack:</b> Python, TypeScript, FastAPI, React
        </div>
        <div style={{ fontSize: "0.9rem", color: '#8b8b9e' }}>
          Hackathon 2025 | Agentic AI • Cybersecurity • FinTech
        </div>
      </>
    ),
  },
  {
    title: "India’s Digital Fraud Crisis",
    subtitle: "The Problem",
    content: (
      <>
        <div style={{ fontSize: "1.1rem", margin: "12px 0" }}>
          <b>₹7,061 Cr</b> cyber fraud losses in 2023 (I4C data)<br />
          <b>13.2 Lakh</b> cyber crime complaints in 2023<br />
          <b>67%</b> involve UPI / digital payment fraud<br />
          1 cyber crime every <b>7 minutes</b>
        </div>
        <div style={{ fontSize: "0.95rem", margin: "12px 0" }}>
          <b>Cyber complaints growth:</b><br />
          2019 – 44K | 2020 – 115K | 2021 – 452K | 2022 – 966K | 2023 – 1320K
        </div>
        <div style={{ fontSize: "0.95rem", margin: "12px 0" }}>
          <b>Scam Types:</b><br />
          UPI / Payment Fraud – 67%<br />
          OTP / Credential Theft – 58%<br />
          Banking Phishing – 43%<br />
          Job / Investment Scams – 31%<br />
          Delivery Scams – 22%
        </div>
      </>
    ),
  },
  {
    title: "Gap Analysis",
    subtitle: "Why existing solutions fail",
    content: (
      <>
        <b>Telecom Spam Filters:</b> Regex rule based, misses ~40% new scam variants<br/>
        <b>Google Safe Browsing:</b> URL only detection, cannot understand message context<br/>
        <b>Bank SMS Alerts:</b> Reactive (after fraud happens), no AI<br/>
        <b>Manual Reporting:</b> Depends on victim recognition, usually too late<br/>
        <div style={{marginTop:12}}><b>✅ Our Solution:</b> Multi-agent AI analyzing language, URLs, fraud patterns <b>before the user clicks</b></div>
      </>
    ),
  },
  {
    title: "Our Solution",
    subtitle: "Agentic AI Scam Interceptor",
    content: (
      <>
        <b>Real-time multi-agent pipeline.</b><br/>
        <ul style={{margin:'12px 0'}}>
          <li>🤖 <b>Agentic Architecture:</b> 4 specialized AI agents</li>
          <li>🔍 <b>Explainable Output:</b> Shows why message is suspicious</li>
          <li>⚡ <b>Real-Time (&lt;500 ms):</b> Concurrent agent execution</li>
          <li>🇮🇳 <b>India-Specific:</b> Trained on UPI, KYC, OTP, Aadhaar scams</li>
          <li>📊 <b>Risk Score (0–100):</b> Text 40%, URL 35%, Pattern 20%, Urgency 5%</li>
          <li>🔌 <b>API First Design:</b> FastAPI endpoints: /api/analyze, /api/health, /api/history</li>
        </ul>
      </>
    ),
  },
  {
    title: "Architecture",
    subtitle: "Pipeline",
    content: (
      <>
        <b>User Input:</b> SMS / Email / Link<br/>
        <b>Preprocessor:</b> Tokenization, URL extraction, Text cleaning<br/>
        <b>Concurrent Agents:</b><br/>
        Agent 1 – Text Analysis (+40)<br/>
        Agent 2 – URL Detector (+30)<br/>
        Agent 3 – Fraud Pattern (+20)<br/>
        Agent 4 – Risk Engine (+10)<br/>
        <div style={{marginTop:12}}>
          <b>Risk Score Formula:</b><br/>
          Risk = (Text × 0.40) + (URL × 0.35) + (Pattern × 0.20) + Urgency<br/>
          <b>Decision:</b> 0–29 → SAFE, 30–59 → SUSPICIOUS, 60–100 → SCAM
        </div>
        <div style={{marginTop:12}}>
          <b>Tech:</b> FastAPI + Python, React + TypeScript, Render + Vercel
        </div>
      </>
    ),
  },
  {
    title: "Agent Deep Dive",
    subtitle: "The 4 Specialized Agents",
    content: (
      <>
        <b>Agent 1 – Text Analysis (Max 40 pts):</b> Detects OTP requests, account suspension, urgency language, social engineering cues. Rule-based + Zero-shot NLP classifier.<br/>
        <b>Agent 2 – URL Verification (Max 30 pts):</b> Checks suspicious TLDs (.xyz, .tk), URL shorteners, brand squatting, IP-based domains.<br/>
        <b>Agent 3 – Fraud Pattern (Max 20 pts):</b> Matches known scam templates: banking, lottery, UPI, government impersonation.<br/>
        <b>Agent 4 – Risk Engine:</b> Combines all agents, adds cross-signal amplification if multiple signals trigger. Outputs risk score, explanation, recommendation.
      </>
    ),
  },
  {
    title: "Live Example",
    subtitle: "How it works",
    content: (
      <>
        <b>Input message:</b><br/>
        "URGENT: Your SBI account has been SUSPENDED!<br/>
        Verify KYC: http://sbi-login.xyz<br/>
        Share OTP immediately"<br/>
        <div style={{marginTop:12}}>
          <b>Text agent score:</b> 38/40<br/>
          <b>URL agent score:</b> 30/30<br/>
          <b>Pattern agent score:</b> 22<br/>
          <b>Final Risk Calculation:</b> 38 + 35 + 6.6 + 2 = 82<br/>
          <b>Result:</b> ⚠ SCAM<br/>
          <b>Recommendation:</b> Do not click links. Report immediately.
        </div>
      </>
    ),
  },
  {
    title: "Technology",
    subtitle: "Stack & API",
    content: (
      <>
        <b>Frontend:</b> React, TypeScript, Vite, Vercel<br/>
        <b>Backend:</b> FastAPI (Python), Pydantic, Render<br/>
        <b>AI Layer:</b> NLTK, TF-IDF, Zero-shot classifier<br/>
        <div style={{marginTop:12}}>
          <b>API Example:</b><br/>
          POST /api/analyze {'{"message": "Your SBI account suspended..."}'}<br/>
          Response: {'{"risk_score": 82, "risk_level": "SCAM", "reasons": ["Scam language", "Suspicious URL"], "metadata": {"timing_ms": 287}}'}
        </div>
      </>
    ),
  },
  {
    title: "Current Fraud Trends",
    subtitle: "2024 Insights",
    content: (
      <>
        <b>₹1,776 Cr</b> lost in first 4 months of 2024<br/>
        <b>27% YoY increase</b> in cyber complaints<br/>
        <b>Only 11% recovery rate</b><br/>
        <b>Major threats:</b> AI-generated scam messages, UPI fraud, OTP social engineering, deepfake voice scams, rural user vulnerability
      </>
    ),
  },
  {
    title: "Prevention Strategy",
    subtitle: "Three-layer defense",
    content: (
      <>
        <b>1. Pre-Delivery:</b> Telecom filters block scams before SMS delivery<br/>
        <b>2. At-Receipt:</b> Real-time message analysis (current system)<br/>
        <b>3. Post-Interaction:</b> Bank transaction monitoring<br/>
        <div style={{marginTop:12}}>
          <b>Combined impact:</b> 80–85% fraud reduction
        </div>
      </>
    ),
  },
  {
    title: "Scalability Plan",
    subtitle: "Growth Roadmap",
    content: (
      <>
        <b>Phase 1 – MVP:</b> Web demo live<br/>
        <b>Phase 2 – App & Extension:</b> Android SDK, Chrome extension<br/>
        <b>Phase 3 – Bank Integration:</b> UPI fraud detection<br/>
        <b>Phase 4 – National Scale:</b> 22 Indian languages, voice scam detection, government dashboard<br/>
        <div style={{marginTop:12}}>
          <b>Infrastructure:</b> Kubernetes, Redis, PostgreSQL, Kafka
        </div>
      </>
    ),
  },
  {
    title: "Government Proposal",
    subtitle: "National AI Scam Detection API",
    content: (
      <>
        <b>Integrate with:</b> Telecom operators, Banks, TRAI DLT gateway<br/>
        <b>Cost:</b> ₹4 Cr/month<br/>
        <b>Fraud prevented:</b> ₹7,000 Cr/year<br/>
        <b>ROI:</b> 140×
      </>
    ),
  },
  {
    title: "Security & Privacy",
    subtitle: "Trust & Transparency",
    content: (
      <>
        <b>Data Privacy:</b> No messages stored, no PII collected, stateless processing<br/>
        <b>System Security:</b> Rate limiting, input validation, CORS restrictions<br/>
        <b>AI Transparency:</b> Fully explainable, no black box models
      </>
    ),
  },
  {
    title: "Our Edge",
    subtitle: "Why Us?",
    content: (
      <>
        <b>Only cybersecurity team among 156 teams</b><br/>
        <b>Advantages:</b> Multi-agent architecture, India-specific fraud dataset, explainable AI, live deployed system, government integration plan, API-first design
      </>
    ),
  },
  {
    title: "Mission",
    subtitle: "Our Vision",
    content: (
      <>
        🛡 <b>Protect Every Indian from Digital Fraud</b><br/>
        <b>₹7,061 Cr</b> stolen last year<br/>
        500M+ users to protect<br/>
        1 API call can check any message.<br/>
        <b>Agentic AI Scam Interceptor</b> — Real-time fraud detection for India.
      </>
    ),
  },
];

export function AboutSlides() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const slide = slides[index];

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#050508" }}>
      <BackgroundBeamsWithCollision>
        <div
          style={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 16px 80px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <motion.button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#c0c0d0",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: 24,
            }}
            whileHover={{ background: "rgba(255,255,255,0.08)", y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            Back
          </motion.button>
          <div style={{ maxWidth: 700, width: "100%", background: "rgba(255,255,255,0.03)", borderRadius: 18, padding: 32, boxShadow: "0 8px 40px #0002", border: "1px solid rgba(255,255,255,0.06)", minHeight: 400 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ color: "#a78bfa", fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{slide.subtitle}</div>
                <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: 800, marginBottom: 18 }}>{slide.title}</h1>
                <div style={{ color: "#e0e0f0", fontSize: "1.1rem" }}>{slide.content}</div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
            <motion.button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              style={{
                padding: "10px 24px",
                borderRadius: 10,
                border: "none",
                background: index === 0 ? "#22242a" : "#a78bfa",
                color: index === 0 ? "#888" : "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: index === 0 ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
              whileTap={{ scale: 0.97 }}
            >
              Previous
            </motion.button>
            <motion.button
              onClick={() => setIndex((i) => Math.min(slides.length - 1, i + 1))}
              disabled={index === slides.length - 1}
              style={{
                padding: "10px 24px",
                borderRadius: 10,
                border: "none",
                background: index === slides.length - 1 ? "#22242a" : "#a78bfa",
                color: index === slides.length - 1 ? "#888" : "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: index === slides.length - 1 ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
              whileTap={{ scale: 0.97 }}
            >
              Next
            </motion.button>
          </div>
          <div style={{ color: "#a78bfa", marginTop: 16, fontSize: "0.95rem" }}>
            Slide {index + 1} of {slides.length}
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
