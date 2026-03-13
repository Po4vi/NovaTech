import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

// Static Tailwind class lookup maps (dynamic interpolation breaks JIT compilation)
const bgColorMap: Record<string, string> = {
  green: "bg-green-500/50",
  yellow: "bg-yellow-500/50",
  orange: "bg-orange-500/50",
  red: "bg-red-500/50",
  purple: "bg-purple-500/50",
  blue: "bg-blue-500/50",
};

const bgSolidColorMap: Record<string, string> = {
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  blue: "bg-blue-500",
};

const textColorMap: Record<string, string> = {
  green: "text-green-400",
  yellow: "text-yellow-400",
  orange: "text-orange-400",
  red: "text-red-400",
  purple: "text-purple-400",
  blue: "text-blue-400",
};

const slides = [
  {
    title: "AGENTIC AI SCAM INTERCEPTOR",
    subtitle: "Real-Time Multi-Agent Fraud Detection System",
    content: (
      <>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 text-center"
        >
          <div className="text-xl md:text-2xl font-semibold text-center">
            <span className="text-purple-400">TEAM NOVATECH</span> <br />
            <a 
              href="https://wave-frontend-plum.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm md:text-base text-purple-300 hover:text-purple-200 underline decoration-purple-500/30"
            >
              wave-frontend-plum.vercel.app (LIVE)
            </a>
          </div>
          
          <div className="grid grid-cols-2 gap-4 my-6 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-red-400">₹7,061 Cr</div>
              <div className="text-xs text-gray-400">Lost to Cyber Fraud (2023)</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-orange-400">7 min</div>
              <div className="text-xs text-gray-400">1 cyber crime reported</div>
            </motion.div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
            <span className="text-purple-300 font-semibold">156 teams — </span>
            <span className="text-yellow-400 font-bold">ONLY Cybersecurity team</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {["Python", "TypeScript", "FastAPI", "React"].map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          <div className="text-sm text-gray-400 mt-4 text-center">
            Hackathon 2025 | Agentic AI • Cybersecurity • FinTech
          </div>
        </motion.div>
      </>
    ),
  },
  {
    title: "India's Digital Fraud Crisis",
    subtitle: "The Problem",
    content: (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-4"
            >
              <div className="text-3xl font-bold text-red-400">₹7,061 Cr</div>
              <div className="text-xs text-gray-300">cyber fraud losses (2023)</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4"
            >
              <div className="text-3xl font-bold text-blue-400">13.2L</div>
              <div className="text-xs text-gray-300">cyber complaints (2023)</div>
            </motion.div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
            <div className="text-lg font-semibold text-purple-300">67% involve UPI / digital payment fraud</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-300">Cyber complaints growth:</div>
            {[
              { year: 2019, count: 44, color: "green" },
              { year: 2020, count: 115, color: "yellow" },
              { year: 2021, count: 452, color: "orange" },
              { year: 2022, count: 966, color: "red" },
              { year: 2023, count: 1320, color: "purple" },
            ].map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <span className="text-xs w-12 text-gray-400">{item.year}</span>
                <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / 1320) * 100}%` }}
                    transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                    className={`h-full ${bgColorMap[item.color]} rounded-full`}
                  />
                </div>
                <span className="text-xs text-gray-300">{item.count}K</span>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { type: "UPI / Payment Fraud", percent: 67 },
              { type: "OTP / Credential Theft", percent: 58 },
              { type: "Banking Phishing", percent: 43 },
              { type: "Job / Investment Scams", percent: 31 },
              { type: "Delivery Scams", percent: 22 },
            ].map((scam, i) => (
              <motion.div
                key={scam.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="bg-gray-800/50 rounded-lg p-2 text-xs"
              >
                <div className="text-gray-300">{scam.type}</div>
                <div className="text-purple-400 font-bold">{scam.percent}%</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </>
    ),
  },
  {
    title: "Gap Analysis",
    subtitle: "Why existing solutions fail",
    content: (
      <>
        <motion.div className="space-y-4">
          {[
            { name: "Telecom Spam Filters", issue: "Regex rule based, misses ~40% new scam variants", color: "red" },
            { name: "Google Safe Browsing", issue: "URL only detection, cannot understand message context", color: "yellow" },
            { name: "Bank SMS Alerts", issue: "Reactive (after fraud happens), no AI", color: "orange" },
            { name: "Manual Reporting", issue: "Depends on victim recognition, usually too late", color: "red" },
          ].map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative pl-6 border-l-2 border-red-500/30 py-2"
            >
              <div className="absolute -left-2 top-3 w-3 h-3 rounded-full bg-red-500/50" />
              <div className="font-semibold text-gray-200">{item.name}</div>
              <div className="text-sm text-gray-400">{item.issue}</div>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30"
          >
            <span className="text-green-400 font-bold text-lg">✅ Our Solution:</span>
            <p className="text-gray-200 mt-1">Multi-agent AI analyzing language, URLs, fraud patterns <span className="text-yellow-400 font-semibold">before the user clicks</span></p>
          </motion.div>
        </motion.div>
      </>
    ),
  },
  {
    title: "Our Solution",
    subtitle: "Agentic AI Scam Interceptor",
    content: (
      <>
        <motion.div className="space-y-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-center p-3 bg-purple-500/20 rounded-xl border border-purple-500/30"
          >
            <span className="text-xl font-bold text-purple-300">Real-time multi-agent pipeline</span>
          </motion.div>

          <div className="grid gap-3">
            {[
              { icon: "🤖", title: "Agentic Architecture", desc: "4 specialized AI agents", color: "purple" },
              { icon: "🔍", title: "Explainable Output", desc: "Shows why message is suspicious", color: "blue" },
              { icon: "⚡", title: "Real-Time (<500 ms)", desc: "Concurrent agent execution", color: "yellow" },
              { icon: "🇮🇳", title: "India-Specific", desc: "Trained on UPI, KYC, OTP, Aadhaar scams", color: "green" },
              { icon: "📊", title: "Risk Score (0–100)", desc: "Text 40%, URL 35%, Pattern 20%, Urgency 5%", color: "orange" },
              { icon: "🔌", title: "API First Design", desc: "FastAPI endpoints: /api/analyze, /api/health, /api/history", color: "red" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-800/30 transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <span className="font-semibold text-gray-200">{item.title}:</span>
                  <span className="text-sm text-gray-400 ml-1">{item.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </>
    ),
  },
  {
    title: "Architecture",
    subtitle: "Pipeline",
    content: (
      <>
        <motion.div className="space-y-4">
          <div className="relative">
            {/* Pipeline visualization */}
            {["User Input", "Preprocessor", "Concurrent Agents", "Risk Engine", "Decision"].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center mb-2"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-300">
                  {i + 1}
                </div>
                <div className="ml-3 text-gray-300">{step}</div>
                {i < 4 && (
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="ml-2 text-gray-600"
                  >
                    ↓
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { agent: "Agent 1 – Text Analysis", score: "+40", color: "blue" },
              { agent: "Agent 2 – URL Detector", score: "+30", color: "purple" },
              { agent: "Agent 3 – Fraud Pattern", score: "+20", color: "orange" },
              { agent: "Agent 4 – Risk Engine", score: "+10", color: "green" }
            ].map((agent) => (
              <motion.div
                key={agent.agent}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/50 rounded-lg p-2 text-sm"
              >
                <div className="text-gray-300">{agent.agent}</div>
                <div className={`${textColorMap[agent.color]} font-bold`}>{agent.score}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-3 bg-gray-800/70 rounded-lg"
          >
            <div className="text-sm font-mono text-purple-300">
              Risk = (Text × 0.40) + (URL × 0.35) + (Pattern × 0.20) + Urgency
            </div>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="px-2 py-1 bg-green-500/20 rounded text-green-300">0–29 → SAFE</span>
              <span className="px-2 py-1 bg-yellow-500/20 rounded text-yellow-300">30–59 → SUSPICIOUS</span>
              <span className="px-2 py-1 bg-red-500/20 rounded text-red-300">60–100 → SCAM</span>
            </div>
          </motion.div>
        </motion.div>
      </>
    ),
  },
  {
    title: "Agent Deep Dive",
    subtitle: "The 4 Specialized Agents",
    content: (
      <>
        <motion.div className="space-y-4">
          {[
            { 
              agent: "Agent 1 – Text Analysis", 
              max: 40, 
              desc: "Detects OTP requests, account suspension, urgency language, social engineering cues. Rule-based + Zero-shot NLP classifier.",
              color: "blue"
            },
            { 
              agent: "Agent 2 – URL Verification", 
              max: 30, 
              desc: "Checks suspicious TLDs (.xyz, .tk), URL shorteners, brand squatting, IP-based domains.",
              color: "purple"
            },
            { 
              agent: "Agent 3 – Fraud Pattern", 
              max: 20, 
              desc: "Matches known scam templates: banking, lottery, UPI, government impersonation.",
              color: "orange"
            },
            { 
              agent: "Agent 4 – Risk Engine", 
              max: "N/A", 
              desc: "Combines all agents, adds cross-signal amplification if multiple signals trigger. Outputs risk score, explanation, recommendation.",
              color: "green"
            },
          ].map((agent, i) => (
            <motion.div
              key={agent.agent}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative pl-4 border-l-2 border-purple-500/30 py-2"
            >
              <div className="flex items-center gap-2">
                <span className={`${textColorMap[agent.color]} font-bold`}>{agent.agent}</span>
                <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                  Max: {agent.max}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{agent.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </>
    ),
  },
  {
    title: "Live Example",
    subtitle: "How it works",
    content: (
      <>
        <motion.div className="space-y-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-3 bg-gray-800/70 rounded-lg border border-gray-700"
          >
            <div className="text-xs text-gray-400 mb-1">Input message:</div>
            <div className="text-sm text-red-300 font-mono">
              "URGENT: Your SBI account has been SUSPENDED!<br/>
              Verify KYC: http://sbi-login.xyz<br/>
              Share OTP immediately"
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Text agent", score: 38, max: 40, color: "blue" },
              { label: "URL agent", score: 30, max: 30, color: "purple" },
              { label: "Pattern agent", score: 22, max: 20, color: "orange" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-800/50 rounded-lg p-2"
              >
                <div className="text-xs text-gray-400">{item.label}</div>
                <div className={`${textColorMap[item.color]} font-bold text-lg`}>
                  {item.score}/{item.max}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center p-3 bg-gradient-to-r from-purple-500/20 to-red-500/20 rounded-xl"
          >
            <div className="text-2xl font-bold text-red-400">82 → SCAM</div>
            <div className="text-sm text-gray-300 mt-1">
              Do not click links. Report immediately.
            </div>
          </motion.div>
        </motion.div>
      </>
    ),
  },
  {
    title: "Technology",
    subtitle: "Stack & API",
    content: (
      <>
        <motion.div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-3"
            >
              <div className="text-xs text-gray-300">Frontend</div>
              <div className="text-sm font-semibold text-blue-300">React, TypeScript</div>
              <div className="text-xs text-gray-400">Vite, Vercel</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-3"
            >
              <div className="text-xs text-gray-300">Backend</div>
              <div className="text-sm font-semibold text-green-300">FastAPI, Python</div>
              <div className="text-xs text-gray-400">Pydantic, Render</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20"
          >
            <div className="text-xs text-gray-300">AI Layer</div>
            <div className="text-sm text-purple-300">NLTK, TF-IDF, Zero-shot classifier</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/70 rounded-xl p-3"
          >
            <div className="text-xs text-gray-400 mb-2">API Example:</div>
            <div className="text-xs font-mono text-green-300 bg-black/30 p-2 rounded">
              POST /api/analyze {"{"}"message": "Your SBI account suspended...{"}"}<br/>
              <span className="text-gray-400">Response: {"{"}"risk_score": 82, "risk_level": "SCAM", ...{"}"}</span>
            </div>
          </motion.div>
        </motion.div>
      </>
    ),
  },
  {
    title: "Current Fraud Trends",
    subtitle: "2024 Insights",
    content: (
      <>
        <motion.div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-red-500/10 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-red-400">₹1,776 Cr</div>
              <div className="text-xs text-gray-300">lost in first 4 months of 2024</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-orange-500/10 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-orange-400">27%</div>
              <div className="text-xs text-gray-300">YoY increase in complaints</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gray-800/70 rounded-xl p-3"
          >
            <div className="text-sm text-gray-300">Only <span className="text-red-400 font-bold">11%</span> recovery rate</div>
          </motion.div>

          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-300">Major threats:</div>
            {[
              "AI-generated scam messages",
              "UPI fraud",
              "OTP social engineering",
              "Deepfake voice scams",
              "Rural user vulnerability",
            ].map((threat, i) => (
              <motion.div
                key={threat}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-sm text-gray-400">{threat}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </>
    ),
  },
  {
    title: "Prevention Strategy",
    subtitle: "Three-layer defense",
    content: (
      <>
        <motion.div className="space-y-4">
          {[
            { layer: "1. Pre-Delivery", desc: "Telecom filters block scams before SMS delivery", color: "blue" },
            { layer: "2. At-Receipt", desc: "Real-time message analysis (current system)", color: "purple" },
            { layer: "3. Post-Interaction", desc: "Bank transaction monitoring", color: "green" },
          ].map((item, i) => (
            <motion.div
              key={item.layer}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative pl-6 border-l-2 border-purple-500/30 py-2"
            >
              <div className={`${textColorMap[item.color]} font-bold`}>{item.layer}</div>
              <div className="text-sm text-gray-400">{item.desc}</div>
            </motion.div>
          ))}

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl text-center"
          >
            <span className="text-2xl font-bold text-green-400">80–85%</span>
            <span className="text-gray-300 ml-2">fraud reduction</span>
          </motion.div>
        </motion.div>
      </>
    ),
  },
  {
    title: "Scalability Plan",
    subtitle: "Growth Roadmap",
    content: (
      <>
        <motion.div className="space-y-3">
          {[
            { phase: "Phase 1 – MVP", desc: "Web demo live", progress: 100, color: "green" },
            { phase: "Phase 2 – App & Extension", desc: "Android SDK, Chrome extension", progress: 0, color: "blue" },
            { phase: "Phase 3 – Bank Integration", desc: "UPI fraud detection", progress: 0, color: "purple" },
            { phase: "Phase 4 – National Scale", desc: "22 Indian languages, voice scam detection, government dashboard", progress: 0, color: "orange" },
          ].map((item, i) => (
            <motion.div
              key={item.phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="space-y-1"
            >
              <div className="flex justify-between text-sm">
                <span className={`${textColorMap[item.color]} font-semibold`}>{item.phase}</span>
                <span className="text-xs text-gray-400">{item.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  className={`h-full ${bgSolidColorMap[item.color]}`}
                />
              </div>
              <div className="text-xs text-gray-400">{item.desc}</div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 p-2 bg-gray-800/50 rounded-lg text-sm"
          >
            <span className="text-purple-300">Infrastructure:</span>
            <span className="text-gray-400 ml-1">Kubernetes, Redis, PostgreSQL, Kafka</span>
          </motion.div>
        </motion.div>
      </>
    ),
  },
  {
    title: "Government Proposal",
    subtitle: "National AI Scam Detection API",
    content: (
      <>
        <motion.div className="space-y-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30"
          >
            <div className="text-sm text-purple-300">Integrate with:</div>
            <div className="text-sm text-gray-300 mt-1">Telecom operators, Banks, TRAI DLT gateway</div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/70 rounded-xl p-3 text-center"
            >
              <div className="text-xs text-gray-400">Cost</div>
              <div className="text-lg font-bold text-red-400">₹4 Cr/month</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/70 rounded-xl p-3 text-center"
            >
              <div className="text-xs text-gray-400">Fraud prevented</div>
              <div className="text-lg font-bold text-green-400">₹7,000 Cr/year</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl"
          >
            <span className="text-3xl font-bold text-yellow-400">140×</span>
            <span className="text-gray-300 ml-2">ROI</span>
          </motion.div>
        </motion.div>
      </>
    ),
  },
  {
    title: "Security & Privacy",
    subtitle: "Trust & Transparency",
    content: (
      <>
        <motion.div className="space-y-4">
          {[
            { title: "Data Privacy", desc: "No messages stored, no PII collected, stateless processing", icon: "🔒", color: "green" },
            { title: "System Security", desc: "Rate limiting, input validation, CORS restrictions", icon: "🛡️", color: "blue" },
            { title: "AI Transparency", desc: "Fully explainable, no black box models", icon: "🔍", color: "purple" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className={`${textColorMap[item.color]} font-semibold`}>{item.title}</div>
                <div className="text-sm text-gray-400">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </>
    ),
  },
  {
    title: "Our Edge",
    subtitle: "Why Us?",
    content: (
      <>
        <motion.div className="space-y-3">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-center p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
          >
            <span className="text-xl font-bold text-purple-300">Only cybersecurity team among 156 teams</span>
          </motion.div>

          <div className="grid grid-cols-2 gap-2">
            {[
              "Multi-agent architecture",
              "India-specific fraud dataset",
              "Explainable AI",
              "Live deployed system",
              "Government integration plan",
              "API-first design",
            ].map((advantage, i) => (
              <motion.div
                key={advantage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-gray-800/50 rounded-lg p-2 text-sm text-center"
              >
                <span className="text-green-400 mr-1">✓</span>
                {advantage}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </>
    ),
  },
  {
    title: "Mission",
    subtitle: "Our Vision",
    content: (
      <>
        <motion.div className="space-y-6 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl mb-4"
          >
            🛡️
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-purple-400"
          >
            Protect Every Indian from Digital Fraud
          </motion.div>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-red-500/10 rounded-xl p-3"
            >
              <div className="text-xl font-bold text-red-400">₹7,061 Cr</div>
              <div className="text-xs text-gray-400">stolen last year</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-blue-500/10 rounded-xl p-3"
            >
              <div className="text-xl font-bold text-blue-400">500M+</div>
              <div className="text-xs text-gray-400">users to protect</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-400"
          >
            1 API call can check any message.
          </motion.div>

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
            className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30"
          >
            <span className="font-bold text-purple-300">Agentic AI Scam Interceptor</span>
            <span className="text-gray-300"> — Real-time fraud detection for India.</span>
          </motion.div>
        </motion.div>
      </>
    ),
  },
];

export function AboutSlides() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();
  const slide = slides[index];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setDirection(-1);
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setDirection(1);
        setIndex((i) => Math.min(slides.length - 1, i + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

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
            onClick={() => navigate("/project")}
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
            ← Back
          </motion.button>

          <motion.div 
            style={{ 
              maxWidth: 800, 
              width: "100%", 
              background: "rgba(255,255,255,0.03)", 
              borderRadius: 24, 
              padding: 40, 
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)", 
              minHeight: 500,
              backdropFilter: "blur(10px)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                <div style={{ color: "#a78bfa", fontWeight: 700, fontSize: "1rem", marginBottom: 8, letterSpacing: "0.05em" }}>
                  {slide.subtitle}
                </div>
                <motion.h1 
                  style={{ color: "#fff", fontSize: "2.5rem", fontWeight: 800, marginBottom: 24, lineHeight: 1.2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {slide.title}
                </motion.h1>
                <motion.div 
                  style={{ color: "#e0e0f0", fontSize: "1.1rem" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.content}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
            <motion.button
              onClick={() => {
                setDirection(-1);
                setIndex((i) => Math.max(0, i - 1));
              }}
              disabled={index === 0}
              style={{
                padding: "12px 28px",
                borderRadius: 12,
                border: "none",
                background: index === 0 ? "#22242a" : "linear-gradient(135deg, #a78bfa, #8b5cf6)",
                color: index === 0 ? "#888" : "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: index === 0 ? "not-allowed" : "pointer",
                boxShadow: index === 0 ? "none" : "0 4px 15px rgba(139, 92, 246, 0.3)",
              }}
              whileHover={index !== 0 ? { scale: 1.05, boxShadow: "0 6px 20px rgba(139, 92, 246, 0.4)" } : {}}
              whileTap={index !== 0 ? { scale: 0.95 } : {}}
            >
              ← Previous
            </motion.button>
            
            <motion.button
              onClick={() => {
                setDirection(1);
                setIndex((i) => Math.min(slides.length - 1, i + 1));
              }}
              disabled={index === slides.length - 1}
              style={{
                padding: "12px 28px",
                borderRadius: 12,
                border: "none",
                background: index === slides.length - 1 ? "#22242a" : "linear-gradient(135deg, #a78bfa, #8b5cf6)",
                color: index === slides.length - 1 ? "#888" : "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: index === slides.length - 1 ? "not-allowed" : "pointer",
                boxShadow: index === slides.length - 1 ? "none" : "0 4px 15px rgba(139, 92, 246, 0.3)",
              }}
              whileHover={index !== slides.length - 1 ? { scale: 1.05, boxShadow: "0 6px 20px rgba(139, 92, 246, 0.4)" } : {}}
              whileTap={index !== slides.length - 1 ? { scale: 0.95 } : {}}
            >
              Next →
            </motion.button>

            <motion.button
              onClick={() => navigate("/about-agents")}
              style={{
                padding: "12px 28px",
                borderRadius: 12,
                border: "2px solid #a78bfa",
                background: "transparent",
                color: "#a78bfa",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.05, background: "rgba(167, 139, 250, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              Agent Deep Dive
            </motion.button>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
            {slides.map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: i === index ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === index ? "#a78bfa" : "rgba(255,255,255,0.2)",
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.2 }}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
              />
            ))}
          </div>

          <div style={{ color: "#a78bfa", marginTop: 16, fontSize: "0.95rem" }}>
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Slide {index + 1} of {slides.length}
            </motion.span>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}