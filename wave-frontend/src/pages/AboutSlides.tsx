import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import "./AboutSlides.css";

type StatTone = "danger" | "warning" | "positive" | "neutral";

interface SlideStat {
  label: string;
  value: string;
  note: string;
  tone?: StatTone;
}

interface SlidePanel {
  heading: string;
  text: string;
}

interface SlideTimeline {
  label: string;
  progress: number;
  detail: string;
}

interface SlideData {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  bullets: string[];
  stats?: SlideStat[];
  panels?: SlidePanel[];
  tags?: string[];
  timeline?: SlideTimeline[];
  callout?: string;
  formula?: string;
}

const SLIDES: SlideData[] = [
  {
    id: "intro",
    eyebrow: "Team NovaTech",
    title: "Agentic AI Scam Interceptor",
    subtitle: "Real-time multi-agent fraud detection for India",
    stats: [
      { label: "Annual Loss", value: "INR 7,061 Cr", note: "Cyber fraud losses in 2023", tone: "danger" },
      { label: "Incident Rate", value: "Every 7 min", note: "One cyber crime reported", tone: "warning" },
      { label: "Hackathon Standing", value: "1 of 156", note: "Only cybersecurity-focused team", tone: "positive" },
    ],
    bullets: [
      "Built as a practical defense layer between scam messages and users.",
      "Runs concurrent analysis on text, links, scam patterns, and urgency.",
      "Returns a clear risk level with human-readable reasons, not black-box output.",
    ],
    tags: ["Python", "FastAPI", "React", "TypeScript"],
    callout: "Live demo: wave-frontend-plum.vercel.app",
  },
  {
    id: "problem",
    eyebrow: "The Problem",
    title: "Digital Fraud Is Scaling Faster Than Defenses",
    subtitle: "Complaint volume and losses continue to rise each year",
    stats: [
      { label: "Complaints", value: "13.2L", note: "Registered in 2023", tone: "warning" },
      { label: "UPI Share", value: "67%", note: "Cases tied to payment scams", tone: "danger" },
      { label: "Recovery", value: "11%", note: "Average amount recovered", tone: "neutral" },
    ],
    bullets: [
      "Most users see a message once and decide in seconds.",
      "Scam copy now adapts quickly and mimics trusted institutions.",
      "Reactive systems intervene after damage, not before the click.",
    ],
    panels: [
      { heading: "2019 to 2023", text: "Complaint growth accelerated from tens of thousands to over a million." },
      { heading: "Main attack surface", text: "SMS, messaging apps, and phishing links tied to KYC and OTP scams." },
    ],
  },
  {
    id: "gap",
    eyebrow: "Gap Analysis",
    title: "Where Existing Solutions Fall Short",
    subtitle: "Current defenses are fragmented and often single-signal",
    bullets: [
      "Spam filters rely on static patterns and miss new scam variants.",
      "URL blocklists ignore linguistic manipulation inside the message.",
      "Bank alerts are often post-incident notifications, not prevention.",
      "Manual reporting starts only after the victim recognizes the threat.",
    ],
    panels: [
      { heading: "Failure mode", text: "One-dimensional checks cannot combine text intent, link quality, and fraud templates." },
      { heading: "Opportunity", text: "A coordinated agent system can score risk before users tap or share credentials." },
    ],
    callout: "Design target: detect suspicious intent before user interaction.",
  },
  {
    id: "solution",
    eyebrow: "Our Approach",
    title: "A Multi-Agent Scoring Pipeline",
    subtitle: "Fast, explainable, and tuned for India-specific fraud patterns",
    stats: [
      { label: "Text Agent", value: "0 to 40", note: "Language and social engineering cues", tone: "neutral" },
      { label: "URL Agent", value: "0 to 30", note: "Domain, TLD, squatting, shortening", tone: "neutral" },
      { label: "Pattern Agent", value: "0 to 30", note: "Template confidence by scam category", tone: "neutral" },
    ],
    bullets: [
      "Parallel execution keeps analysis responsive for real-world use.",
      "Every score component adds transparent reasons for user trust.",
      "Outputs actionable recommendation: safe, suspicious, or scam.",
    ],
    formula: "Risk score = Text(40) + URL(30) + Pattern(30) + cross-signal bonus",
  },
  {
    id: "architecture",
    eyebrow: "Pipeline",
    title: "System Architecture",
    subtitle: "From message input to decision in one pass",
    bullets: [
      "Input enters preprocessing for cleanup, tokenization, and URL extraction.",
      "Three specialist agents execute concurrently and return partial evidence.",
      "Risk Engine fuses agent outputs and maps score to risk level.",
      "API response includes reasons and recommended next action.",
    ],
    panels: [
      { heading: "Flow", text: "Input -> Preprocess -> Agents -> Risk Engine -> Decision" },
      { heading: "Decision bands", text: "0-30 Safe, 31-60 Suspicious, 61-100 Scam" },
    ],
  },
  {
    id: "agents",
    eyebrow: "Agent Deep Dive",
    title: "Four Specialized Agents",
    subtitle: "Each agent contributes distinct, measurable evidence",
    bullets: [
      "Text Analysis Agent identifies coercion, urgency, and scam language.",
      "URL Verification Agent scores risky domains and phishing link structures.",
      "Fraud Pattern Agent matches known scam templates with confidence.",
      "Risk Engine merges all signals and generates final recommendation.",
    ],
    tags: ["Explainable", "Modular", "Concurrent", "Extensible"],
    callout: "Detailed implementation walkthrough is available in Agent Deep Dive.",
  },
  {
    id: "example",
    eyebrow: "Live Example",
    title: "How One Message Is Evaluated",
    subtitle: "Sample phishing text scored across all agents",
    stats: [
      { label: "Text Score", value: "38/40", note: "Urgency and credential request detected", tone: "danger" },
      { label: "URL Score", value: "30/30", note: "Suspicious domain and phishing path", tone: "danger" },
      { label: "Pattern Score", value: "22/30", note: "Strong bank-alert scam match", tone: "warning" },
    ],
    bullets: [
      "Message includes high-pressure phrasing and account suspension threat.",
      "Link resembles brand squatting with a suspicious TLD.",
      "Combined score crosses scam threshold with high confidence.",
    ],
    callout: "Final output: Risk 82, Level SCAM, recommendation to avoid interaction and report.",
  },
  {
    id: "tech",
    eyebrow: "Technology",
    title: "Production-Ready Stack",
    subtitle: "Fast iteration for hackathon speed and deployment stability",
    bullets: [
      "Frontend: React and TypeScript with Vite deployment pipeline.",
      "Backend: FastAPI and Pydantic contracts for reliable API responses.",
      "Detection: rule-based NLP, pattern matching, and scoring fusion.",
      "Deployment: Render and Vercel for rapid public demos.",
    ],
    panels: [
      { heading: "Endpoint", text: "POST /api/analyze returns score, level, reasons, recommendation." },
      { heading: "Design choice", text: "API-first architecture enables browser, mobile, and SDK integrations." },
    ],
  },
  {
    id: "trends",
    eyebrow: "2024 Insights",
    title: "Fraud Trends To Watch",
    subtitle: "Attack sophistication is increasing while recovery remains low",
    stats: [
      { label: "2024 Loss", value: "INR 1,776 Cr", note: "First 4 months only", tone: "danger" },
      { label: "YoY Growth", value: "+27%", note: "Complaint increase", tone: "warning" },
    ],
    bullets: [
      "AI-generated scam messaging improves quality and personalization.",
      "Deepfake voice calls are being used for social engineering.",
      "Rural and first-time digital users face disproportionate risk.",
      "UPI and OTP scams remain dominant in high-volume cases.",
    ],
  },
  {
    id: "prevention",
    eyebrow: "Prevention Strategy",
    title: "Three-Layer Defense Model",
    subtitle: "Block, warn, and monitor across the transaction lifecycle",
    bullets: [
      "Layer 1: Carrier filters reduce obvious malicious traffic pre-delivery.",
      "Layer 2: At-receipt analysis flags risky messages in real time.",
      "Layer 3: Transaction monitoring catches late-stage suspicious behavior.",
    ],
    panels: [
      { heading: "Expected impact", text: "Combined layers can reduce fraud loss exposure by an estimated 80 to 85 percent." },
      { heading: "Core role", text: "Our product is the decision layer at user-receipt time, where action is still preventable." },
    ],
  },
  {
    id: "roadmap",
    eyebrow: "Scalability Plan",
    title: "Roadmap To National Scale",
    subtitle: "From MVP to large-scale integrations",
    bullets: [
      "Phase 1 complete: live web MVP and end-to-end analysis API.",
      "Phase 2: mobile SDK and browser extension rollout.",
      "Phase 3: bank and payment network integration pilots.",
      "Phase 4: multilingual support and nationwide adoption path.",
    ],
    timeline: [
      { label: "MVP", progress: 100, detail: "Web demo and API live" },
      { label: "SDK + Extension", progress: 35, detail: "Client-side detection surfaces" },
      { label: "Bank Integrations", progress: 20, detail: "Fraud workflow alignment" },
      { label: "National Scale", progress: 10, detail: "Language and partner expansion" },
    ],
  },
  {
    id: "government",
    eyebrow: "Government Proposal",
    title: "National Scam Detection API",
    subtitle: "A shared defensive API for telecoms, banks, and public portals",
    stats: [
      { label: "Estimated Cost", value: "INR 4 Cr/mo", note: "Infrastructure and operations", tone: "neutral" },
      { label: "Potential Prevention", value: "INR 7,000 Cr/yr", note: "Projected fraud blocked", tone: "positive" },
      { label: "ROI", value: "140x", note: "Benefit relative to operating cost", tone: "positive" },
    ],
    bullets: [
      "Offer standardized scoring endpoint for ecosystem integrations.",
      "Push explainable alerts to user apps and enterprise fraud consoles.",
      "Use aggregate telemetry for policy and preventive campaign insights.",
    ],
  },
  {
    id: "security",
    eyebrow: "Security and Privacy",
    title: "Trust By Design",
    subtitle: "Privacy-conscious processing with transparent AI reasoning",
    bullets: [
      "No persistent message storage in default processing path.",
      "Input validation, rate limiting, and strict API boundary controls.",
      "Clear reasons for every high-risk decision to reduce false-confidence.",
      "Architecture supports compliance-focused deployment environments.",
    ],
    tags: ["No Black Box", "Traceable Signals", "Privacy First"],
  },
  {
    id: "edge",
    eyebrow: "Competitive Edge",
    title: "Why This Team Stands Out",
    subtitle: "Focused execution with strong problem-market fit",
    bullets: [
      "Only cybersecurity-centered team in a 156-team competition field.",
      "Built around India-native scam patterns and payment behaviors.",
      "Real deployed prototype instead of concept-only presentation.",
      "API-first architecture enables rapid ecosystem integration.",
    ],
    panels: [
      { heading: "Product strength", text: "Multi-agent explainability balances detection quality with user trust." },
      { heading: "Execution strength", text: "Clear roadmap from prototype to institutional integration." },
    ],
  },
  {
    id: "mission",
    eyebrow: "Mission",
    title: "Protect Every Indian From Digital Fraud",
    subtitle: "Turn one API call into instant decision support",
    stats: [
      { label: "Annual Risk", value: "INR 7,061 Cr", note: "Losses that can be reduced", tone: "danger" },
      { label: "Population Reach", value: "500M+", note: "Digital users to protect", tone: "neutral" },
    ],
    bullets: [
      "Deliver fraud intelligence at the exact moment users need it.",
      "Make scam detection understandable for non-technical audiences.",
      "Scale from hackathon project to national safety infrastructure.",
    ],
    callout: "Agentic AI Scam Interceptor is built to prevent harm before it happens.",
  },
];

function toneClass(tone: StatTone | undefined): string {
  switch (tone) {
    case "danger":
      return "about-stat-danger";
    case "warning":
      return "about-stat-warning";
    case "positive":
      return "about-stat-positive";
    default:
      return "about-stat-neutral";
  }
}

function SlideBody({ slide }: { slide: SlideData }) {
  return (
    <div className="about-slide-frame">
      <div className="about-slide-grid">
        <section className="about-panel about-points-panel">
          <h3>Key Points</h3>
          <ul>
            {slide.bullets.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.26 }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </section>

        <section className="about-panel about-side-panel">
          {slide.panels && (
            <div className="about-panel-stack">
              {slide.panels.map((panel) => (
                <article key={panel.heading} className="about-info-card">
                  <h4>{panel.heading}</h4>
                  <p>{panel.text}</p>
                </article>
              ))}
            </div>
          )}

          {slide.tags && (
            <div className="about-tags" aria-label="Slide tags">
              {slide.tags.map((tag) => (
                <span key={tag} className="about-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {slide.timeline && (
            <div className="about-timeline">
              {slide.timeline.map((item) => (
                <div key={item.label} className="about-timeline-row">
                  <div className="about-timeline-head">
                    <span>{item.label}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="about-timeline-track">
                    <motion.div
                      className="about-timeline-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {slide.callout && <div className="about-callout">{slide.callout}</div>}

      {slide.formula && (
        <pre className="about-formula" aria-label="Scoring formula">
          {slide.formula}
        </pre>
      )}
    </div>
  );
}

export function AboutSlides() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();
  const slide = SLIDES[index];
  const progressPct = ((index + 1) / SLIDES.length) * 100;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setDirection(-1);
        setIndex((current) => Math.max(0, current - 1));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setDirection(1);
        setIndex((current) => Math.min(SLIDES.length - 1, current + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="about-deck-root">
      <BackgroundBeamsWithCollision>
        <motion.section
          className="about-deck-shell"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="about-deck-topbar">
            <button className="about-back-button" onClick={() => navigate("/project")}>Back to Project</button>
            <div className="about-counter">Slide {index + 1} of {SLIDES.length}</div>
          </header>

          <div className="about-progress" role="progressbar" aria-valuemin={1} aria-valuemax={SLIDES.length} aria-valuenow={index + 1}>
            <motion.div
              className="about-progress-fill"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>

          <div className="about-main-card">
            <div className="about-card-glow" aria-hidden />

            <div className="about-headline">
              <p className="about-eyebrow">{slide.eyebrow}</p>
              <h1>{slide.title}</h1>
              <p className="about-subtitle">{slide.subtitle}</p>
            </div>

            {slide.stats && (
              <div className="about-stat-grid">
                {slide.stats.map((stat) => (
                  <article key={stat.label} className={`about-stat-card ${toneClass(stat.tone)}`}>
                    <p className="about-stat-label">{stat.label}</p>
                    <p className="about-stat-value">{stat.value}</p>
                    <p className="about-stat-note">{stat.note}</p>
                  </article>
                ))}
              </div>
            )}

            <div className="about-slide-region">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slide.id}
                  className="about-slide-motion"
                  custom={direction}
                  initial={{ x: direction > 0 ? 48 : -48, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? -48 : 48, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SlideBody slide={slide} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="about-controls">
            <button
              className="about-nav-btn"
              disabled={index === 0}
              onClick={() => {
                setDirection(-1);
                setIndex((current) => Math.max(0, current - 1));
              }}
            >
              Previous
            </button>

            <button
              className="about-nav-btn"
              disabled={index === SLIDES.length - 1}
              onClick={() => {
                setDirection(1);
                setIndex((current) => Math.min(SLIDES.length - 1, current + 1));
              }}
            >
              Next
            </button>

            <button className="about-secondary-btn" onClick={() => navigate("/about-agents")}>
              Agent Deep Dive
            </button>
          </div>

          <div className="about-dots" aria-label="Slide navigation dots">
            {SLIDES.map((item, itemIndex) => (
              <button
                key={item.id}
                className={`about-dot ${itemIndex === index ? "active" : ""}`}
                aria-label={`Go to slide ${itemIndex + 1}`}
                onClick={() => {
                  setDirection(itemIndex >= index ? 1 : -1);
                  setIndex(itemIndex);
                }}
              />
            ))}
          </div>
        </motion.section>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
