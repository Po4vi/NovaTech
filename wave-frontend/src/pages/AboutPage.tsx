import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export function AboutPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#050508" }}>
      <BackgroundBeamsWithCollision>
        <div
          style={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column" as const,
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
          <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: 800, marginBottom: 24 }}>
            About Project
          </h1>
          {/* Project info will go here */}
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}

export default AboutPage;
