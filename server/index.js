import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";

import authRoutes from "./routes/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 3001;

const quizResults = new Map();
const progressState = {
  totalLessons: 40,
  phases: [
    { id: "fondasi-web", progress: 0, status: "Belum dimulai" },
    { id: "javascript", progress: 0, status: "Terkunci" },
    { id: "react-ekosistem", progress: 0, status: "Terkunci" },
    { id: "career-preparation", progress: 0, status: "Terkunci" },
  ],
};

app.use(cors({ origin: "https://fullstack-capstone-ten.vercel.app" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "studysync-api",
  });
});

app.use("/api", authRoutes);

app.get("/api/progress", (req, res) => {
  res.status(200).json({
    data: getProgressSummary(),
  });
});

app.post("/api/quiz-results", (req, res) => {
  const payload = req.body;
  const totalQuestions = Number(payload.totalQuestions || 0);
  const score = Number(payload.score || 0);
  const percent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const id = Date.now().toString();
  const result = {
    id,
    phaseId: payload.phaseId,
    quizTitle: payload.quizTitle,
    score,
    totalQuestions,
    percent,
    durationSeconds: payload.durationSeconds,
    createdAt: new Date().toISOString(),
    answers: payload.answers ?? [],
  };

  quizResults.set(id, result);
  updatePhaseProgress(payload.phaseId, percent);

  res.status(201).json({
    data: result,
    progress: getProgressSummary(),
  });
});

app.get("/api/quiz-results/:id", (req, res) => {
  const result = quizResults.get(req.params.id);

  if (!result) {
    return res.status(404).json({
      error: "Quiz result not found",
    });
  }

  return res.status(200).json({
    data: result,
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`StudySync API running at http://localhost:${PORT}`);
});

function getProgressSummary() {
  const totalProgress = Math.round(
    progressState.phases.reduce((sum, phase) => sum + phase.progress, 0) /
      progressState.phases.length
  );
  const results = [...quizResults.values()];
  const averageScore = results.length
    ? Math.round(
        results.reduce((sum, result) => sum + result.percent, 0) /
          results.length
      )
    : 0;

  return {
    totalProgress,
    completedLessons: Math.round(
      (progressState.totalLessons * totalProgress) / 100
    ),
    totalLessons: progressState.totalLessons,
    completedQuizzes: results.length,
    averageScore,
    phases: progressState.phases,
  };
}

function updatePhaseProgress(phaseId, percent) {
  const phase = progressState.phases.find((item) => item.id === phaseId);

  if (!phase) return;

  phase.progress = Math.max(phase.progress, percent);

  if (phase.progress >= 100) {
    phase.status = "Selesai";
  } else if (phase.progress > 0) {
    phase.status = "Sedang berjalan";
  }

  const currentIndex = progressState.phases.findIndex(
    (item) => item.id === phaseId
  );
  const nextPhase = progressState.phases[currentIndex + 1];

  if (phase.progress >= 80 && nextPhase?.status === "Terkunci") {
    nextPhase.status = "Belum dimulai";
  }
}
