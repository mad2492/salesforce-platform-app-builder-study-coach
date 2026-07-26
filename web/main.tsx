import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import StudyCoach from "../app/StudyCoach";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StudyCoach />
  </StrictMode>,
);
