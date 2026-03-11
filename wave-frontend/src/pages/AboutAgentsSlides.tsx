import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const slides = [
  {
    title: "Agent 1 — Text Analysis Agent",
    subtitle: "Hybrid Keyword + ML Scam Detection",
    content: (
      <>
        <div style={{marginBottom:12}}>
          <b>Highest-weighted agent (max 40 points = 40% of total score).</b><br/>
          Analyzes message language for scam vocabulary, urgency, psychological pressure, and social engineering cues.<br/>
          <b>Hybrid approach:</b> Rule-based keyword scoring + ML classifier.
        </div>
        <div style={{marginBottom:12}}>
          <b>Internal Logic:</b><br/>
          <pre style={{fontSize:'0.95rem', background:'#181828', color:'#a78bfa', borderRadius:8, padding:12, overflowX:'auto'}}>{`
TextAnalysisAgent.analyze(message, preprocessed)
  INPUT: message (raw), preprocessed (cleaned_text, keywords_found, ...)
  LAYER 1: KEYWORD SCORING
    SCAM_KEYWORDS dict { word: score }
    keyword_score = sum(SCAM_KEYWORDS[k] for k in keywords_found if k in SCAM_KEYWORDS)
    keyword_score = min(keyword_score, 40)
  LAYER 2: ML CLASSIFIER
    vectorizer.transform([cleaned_text])  # TF-IDF
    model.predict_proba(vec)[0][1]       # scam probability
    ml_score = int(proba * 40)
  BLEND: blended = 0.5 * keyword_score + 0.5 * ml_score
  URGENCY: separate 0-10 urgency_score from urgency words
  RETURN: {
    scam_language_score: int (0-40),
    detected_phrases: [...],
    urgency_score: int (0-10),
    category_scores: {...},
    ml_confidence: float
  }
`}</pre>
        </div>
        <div style={{marginBottom:12}}>
          <b>Hybrid Scoring Formula:</b><br/>
          <ul>
            <li><b>Keyword Scoring:</b> Fast, India-specific vocab, no model needed (50% of score)</li>
            <li><b>ML Classifier (TF-IDF + LR):</b> Catches new patterns, generalizes (50% of score)</li>
            <li><b>Urgency Score:</b> Adds context, passed to Risk Engine separately</li>
          </ul>
        </div>
        <div style={{marginBottom:12}}>
          <b>Worked Example:</b><br/>
          <pre style={{fontSize:'0.95rem', background:'#181828', color:'#a78bfa', borderRadius:8, padding:12, overflowX:'auto'}}>{`
EXAMPLE: 'Share your OTP with our agent immediately to avoid account suspension'
Keyword hits: 'otp' +15, 'share' +8, 'account' +5, 'suspension' +10 → keyword_score = 38
ML classifier: scam probability 0.94 → ml_score = 37
BLENDED = (0.5 × 38) + (0.5 × 37) = 37.5 ≈ 37
urgency_score = 8 ('immediately' + 'avoid')
category_scores = { social_engineering: 1, financial_threat: 1 }
`}</pre>
        </div>
      </>
    ),
  },
  {
    title: "Agent 2 — URL Verification Agent",
    subtitle: "Multi-Check Phishing URL Detection",
    content: (
      <>
        <div style={{marginBottom:12}}>
          <b>Most technically sophisticated agent.</b> Performs 6 independent checks on every URL found in the message.<br/>
        </div>
        <div style={{marginBottom:12}}>
          <b>Logic Tree:</b>
          <pre style={{fontSize:'0.95rem', background:'#181828', color:'#22d3ee', borderRadius:8, padding:12, overflowX:'auto'}}>{`
URLVerificationAgent.analyze(message, preprocessed)
  Step 1: URL Extraction (from preprocessed['urls_found'] or regex)
  Step 2: Early exit if no URLs
  Step 3: For EACH URL, run 6 checks:
    1. Suspicious TLD (.xyz, .tk, ...): +10
    2. URL Shortener (bit.ly, ...): +8
    3. Raw IP Address: +12
    4. Phishing Keywords in Path: +5 each (max 15)
    5. Brand Squatting (brand + hyphen): +10
    6. Excessive Subdomains (>=3): +6
  Step 4: Cap total at 30
  RETURN: { has_url, suspicious_domains, url_risk_score, details, urls_found }
`}</pre>
        </div>
        <div style={{marginBottom:12}}>
          <b>Worked Example:</b><br/>
          <pre style={{fontSize:'0.95rem', background:'#181828', color:'#22d3ee', borderRadius:8, padding:12, overflowX:'auto'}}>{`
URL: 'http://sbi-login.xyz/verify?account=123'
CHECK 1: Suspicious TLD: YES (+10)
CHECK 4: Phishing kw: 'verify', 'account' (+10)
CHECK 5: Brand squat: YES (+10)
Total = 30 (max)
Details: Suspicious TLD: .xyz, Phishing keywords: verify, account, Brand squatting
`}</pre>
        </div>
      </>
    ),
  },
  {
    title: "Agent 3 — Fraud Pattern Agent",
    subtitle: "Template-Based Scam Pattern Matching",
    content: (
      <>
        <div style={{marginBottom:12}}>
          <b>Matches message against 8 scam template categories.</b> Each template has keywords and triggers (action phrases). Triggers are weighted 1.5× more.<br/>
        </div>
        <div style={{marginBottom:12}}>
          <b>Pattern Database Structure:</b><br/>
          <pre style={{fontSize:'0.95rem', background:'#181828', color:'#f59e0b', borderRadius:8, padding:12, overflowX:'auto'}}>{`
Pattern ID | Scam Type | Keywords | Triggers
banking_scam | Bank Alert | bank, account, suspended | click here, verify
kyc_scam | KYC/ID | kyc, aadhaar, pan | expired, update immediately
otp_scam | OTP/Credential | otp, password, pin | share, send, enter
lottery_scam | Lottery | won, lottery, prize | claim, pay, register
job_scam | Job/Earn | earn, job, salary | register now, apply now
...etc.
`}</pre>
        </div>
        <div style={{marginBottom:12}}>
          <b>Confidence Formula:</b><br/>
          <pre style={{fontSize:'0.95rem', background:'#181828', color:'#f59e0b', borderRadius:8, padding:12, overflowX:'auto'}}>{`
confidence = min((kw_hits + 1.5*tr_hits) / (total_possible*0.6), 1.0)
pattern_matched = best_score >= 0.3
`}</pre>
        </div>
        <div style={{marginBottom:12}}>
          <b>Worked Example:</b><br/>
          <pre style={{fontSize:'0.95rem', background:'#181828', color:'#f59e0b', borderRadius:8, padding:12, overflowX:'auto'}}>{`
Message: 'URGENT: Your bank account is suspended. Verify now to unblock.'
kw_hits: 4, tr_hits: 1, total_possible: 13
confidence = min((4+1.5)/7.8, 1.0) = 0.705
pattern_matched = True (confidence 70.5%)
pattern_score = int(0.705*30) = 21
`}</pre>
        </div>
      </>
    ),
  },
  {
    title: "Agent 4 — Risk Scoring Engine",
    subtitle: "Fusion, Amplification, and Final Score",
    content: (
      <>
        <div style={{marginBottom:12}}>
          <b>Fusion engine that synthesizes all agent outputs into a final score using a weighted formula and cross-signal amplification.</b>
        </div>
        <div style={{marginBottom:12}}>
          <b>Complete Flow:</b>
          <pre style={{fontSize:'0.95rem', background:'#181828', color:'#22c55e', borderRadius:8, padding:12, overflowX:'auto'}}>{`
RiskScoringAgent.score(text_result, url_result, pattern_result)
  1. Collect text_score (cap 40)
  2. Collect url_score (cap 30)
  3. Collect pattern_score (int(confidence*30))
  4. Cross-signal amplification: if all 3 agents fire, +5
  5. Clamp to 0-100
  6. Classify: 0-30 SAFE, 31-60 SUSPICIOUS, 61-100 SCAM
  7. Lookup recommendation
  RETURN: { risk_score, risk_level, reasons, recommendation }
`}</pre>
        </div>
        <div style={{marginBottom:12}}>
          <b>Reasons List:</b> Built incrementally as each check fires. Every reason maps to a specific agent check.<br/>
          <ul>
            <li>Scam language detected: otp, verify, suspended</li>
            <li>High urgency / threat language used</li>
            <li>Social engineering tactics detected</li>
            <li>Suspicious URL(s): sbi-login.xyz</li>
            <li>Suspicious TLD: .xyz</li>
            <li>Matches known scam pattern: Bank Alert Scam</li>
            <li>Partial match to known scam patterns</li>
            <li>Multiple independent risk signals detected</li>
          </ul>
        </div>
        <div style={{marginBottom:12}}>
          <b>Scoring Formula & Thresholds:</b>
          <pre style={{fontSize:'0.95rem', background:'#181828', color:'#22c55e', borderRadius:8, padding:12, overflowX:'auto'}}>{`
score = text_score (0-40) + url_score (0-30) + pattern_score (0-30) + cross_signal_bonus (0 or +5)
RAW MAX = 105, CLAMPED TO 100
SAFE ≤ 30, SUSPICIOUS ≤ 60, SCAM > 60
`}</pre>
        </div>
      </>
    ),
  },
  {
    title: "Data Models & API Contracts",
    subtitle: "Agent Interfaces & Pydantic Models",
    content: (
      <>
        <div style={{marginBottom:12}}>
          <b>Preprocessed Dict (input to all agents):</b>
          <pre style={{fontSize:'0.95rem', background:'#181828', color:'#a78bfa', borderRadius:8, padding:12, overflowX:'auto'}}>{`
{
  original: str,
  cleaned_text: str,
  tokens: List[str],
  keywords_found: List[str],
  urls_found: List[str],
  has_url: bool,
}
`}</pre>
        </div>
        <div style={{marginBottom:12}}>
          <b>Agent Output Contracts:</b>
          <pre style={{fontSize:'0.95rem', background:'#181828', color:'#a78bfa', borderRadius:8, padding:12, overflowX:'auto'}}>{`
# Agent 1
{
  scam_language_score: int,
  detected_phrases: List[str],
  urgency_score: int,
  category_scores: dict,
  ml_confidence: float,
}
# Agent 2
{
  has_url: bool,
  suspicious_domains: List[str],
  url_risk_score: int,
  details: List[str],
  urls_found: List[str],
}
# Agent 3
{
  pattern_matched: bool,
  matched_pattern: str | None,
  matched_pattern_id: str | None,
  confidence: float,
  pattern_type: str | None,
  all_matches: List[dict],
}
# Agent 4
{
  risk_score: int,
  risk_level: str,
  reasons: List[str],
  recommendation: str,
}
`}</pre>
        </div>
        <div style={{marginBottom:12}}>
          <b>API Models (Pydantic):</b>
          <pre style={{fontSize:'0.95rem', background:'#181828', color:'#a78bfa', borderRadius:8, padding:12, overflowX:'auto'}}>{`
# Request
class AnalyzeRequest(BaseModel):
    message: str
# Response
class AnalyzeResponse(BaseModel):
    risk_score: int
    risk_level: str
    reasons: List[str]
    recommendation: str
    details: Dict[str, Any]
    preprocessed: Dict[str, Any]
    metadata: Dict[str, Any]
`}</pre>
        </div>
      </>
    ),
  },
];

export function AboutAgentsSlides() {
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
          <div style={{ maxWidth: 800, width: "100%", background: "rgba(255,255,255,0.03)", borderRadius: 18, padding: 32, boxShadow: "0 8px 40px #0002", border: "1px solid rgba(255,255,255,0.06)", minHeight: 400 }}>
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
