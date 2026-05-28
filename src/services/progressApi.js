const API_URL = "http://localhost:3001";
const STORAGE_KEY = "studysync-progress";

export const fallbackProgress = {
  totalProgress: 0,
  completedLessons: 0,
  totalLessons: 40,
  completedQuizzes: 0,
  averageScore: 0,
  phases: [
    {
      id: "fondasi-web",
      progress: 0,
      mastery: 0,
      status: "Belum dimulai",
    },
    {
      id: "javascript",
      progress: 0,
      mastery: 0,
      status: "Terkunci",
    },
    {
      id: "react-ekosistem",
      progress: 0,
      mastery: 0,
      status: "Terkunci",
    },
    {
      id: "career-preparation",
      progress: 0,
      mastery: 0,
      status: "Terkunci",
    },
  ]
};

export async function fetchProgress() {
  try {
    // Prioritaskan local storage agar progress kuis tidak ter-reset oleh backend dummy
    const stored = getStoredProgress();
    if (stored.totalProgress > 0 || stored.completedQuizzes > 0) {
      return stored;
    }

    const response = await fetch(`${API_URL}/api/progress`);

    if (!response.ok) {
      throw new Error("Gagal mengambil progress.");
    }

    const payload = await response.json();
    saveProgress(payload.data);
    return payload.data;
  } catch {
    return getStoredProgress();
  }
}

export function mergePhasesWithProgress(phases, progress) {
  return phases.map((phase) => {
    const phaseProgress = progress.phases.find((item) => item.id === phase.id);

    return {
      ...phase,
      progress: phaseProgress?.progress ?? phase.progress,
      status: phaseProgress?.status ?? phase.status,
      active: phaseProgress?.status !== "Terkunci",
    };
  });
}

export function getStoredProgress() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : fallbackProgress;
  } catch {
    return fallbackProgress;
  }
}

export function saveProgress(progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage failures; fallback progress keeps the UI usable.
  }
}

export function applyQuizProgress(currentProgress, phaseId, percentScore, decision) {
  const masteryPercent = Math.min(100, Math.max(0, percentScore));

  const phases = currentProgress.phases.map((phase, index, allPhases) => {
    // 1. Update status materi yang baru saja dikerjakan
    if (phase.id === phaseId) {
      return {
        ...phase,
        progress: masteryPercent,
        mastery: masteryPercent,
        status:
          decision === "passed" || masteryPercent >= 100
            ? "Selesai"
            : decision === "needs_remedial" || decision === "struggling" || decision === "declining"
            ? "Perlu review"
            : "Sedang berjalan",
      };
    }

    const previousPhase = allPhases[index - 1];

    // 2. Buka status "Terkunci" pada materi B, jika materi A (sebelumnya) sukses dilewati
    if (
      phase.status === "Terkunci" &&
      previousPhase?.id === phaseId &&
      (decision === "passed" || masteryPercent >= 75)
    ) {
      return {
        ...phase,
        status: "Belum dimulai",
      };
    }

    return phase;
  });

  const totalProgress = Math.round(
    phases.reduce((sum, phase) => sum + phase.progress, 0) /
      phases.length
  );

  return {
    ...currentProgress,
    phases,
    totalProgress,
    completedLessons: Math.round(
      (currentProgress.totalLessons * totalProgress) / 100
    ),
    completedQuizzes:
      currentProgress.completedQuizzes + 1,

    averageScore: Math.round(
      phases.reduce((sum, phase) => sum + phase.progress, 0) /
        phases.length
    ),
  };
}