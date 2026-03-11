import { Routes, Route, Navigate } from "react-router-dom";

import { MainPage } from "@/pages/MainPage";
import { ProjectPage } from "@/pages/ProjectPage";
import { AboutPage } from "@/pages/AboutPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/main" replace />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/project" element={<ProjectPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/about-agents" element={require("@/pages/AboutAgentsSlides").AboutAgentsSlides()} />
    </Routes>
  );
}

export default App;
