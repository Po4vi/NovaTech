import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";

import { MainPage } from "@/pages/MainPage";
import { ProjectPage } from "@/pages/ProjectPage";
import { AboutPage } from "@/pages/AboutPage";
import { AboutAgentsSlides } from "@/pages/AboutAgentsSlides";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#050508",
            color: "#e0e0f0",
            fontFamily: "Inter, system-ui, sans-serif",
            gap: 16,
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ color: "#8b8b9e" }}>An unexpected error occurred.</p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = "/main";
            }}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: "#a78bfa",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#050508",
        color: "#e0e0f0",
        fontFamily: "Inter, system-ui, sans-serif",
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: "3rem", fontWeight: 800, color: "#a78bfa" }}>404</h1>
      <p style={{ color: "#8b8b9e" }}>Page not found.</p>
      <Link
        to="/main"
        style={{
          padding: "10px 24px",
          borderRadius: 10,
          background: "#a78bfa",
          color: "#fff",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Go Home
      </Link>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/main" replace />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/about-agents" element={<AboutAgentsSlides />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
