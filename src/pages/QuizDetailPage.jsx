import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { getLearningPhase } from "../data/learningData";
import { applyQuizProgress, fallbackProgress, getStoredProgress, saveProgress } from "../services/progressApi";
import { getOrCreateAnonymousUserId, startQuizSession, submitQuizAnswer } from "../services/aiApi";

export default function QuizDetailPage() {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const phase = getLearningPhase(phaseId);

  const [sessionId, setSessionId] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shouldStopQuiz, setShouldStopQuiz] = useState(false);
  const [lastDecision, setLastDecision] = useState("continue");
  const [lastReason, setLastReason] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [sessionError, setSessionError] = useState("");

  const questionStartedAtRef = useRef(Date.now());

  useEffect(() => {
    let cancelled = false;

    async function initSession() {
      if (!phase) return;

      try {
        const userId = getOrCreateAnonymousUserId();
        const session = await startQuizSession({
          userId,
          topicId: phase.id,
        });

        if (!cancelled) {
          setSessionId(session.session_id);
        }
      } catch (error) {
        if (!cancelled) {
          setSessionError(error.message || "Gagal memulai sesi quiz.");
        }
      }
    }

    initSession();

    return () => {
      cancelled = true;
    };
  }, [phase]);

  useEffect(() => {
    questionStartedAtRef.current = Date.now();
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsChecking(false);
    setShouldStopQuiz(false);
  }, [currentQuestionIndex]);

  if (!phase) {
    return (
      <div className="page-shell">
        <AppNavbar />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="section-card p-8 text-center">
            <h1 className="font-display text-4xl text-[#172017]">Quiz tidak ditemukan</h1>
            <Link to="/roadmap" className="btn-primary mt-6 px-5 py-3">
              Kembali ke roadmap
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const totalQuestions = phase.quiz.questions.length;
  const currentQuestion = phase.quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const finishQuiz = () => {
    const answeredQuestions = currentQuestionIndex + 1;
    const quizPercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const finalDecision = lastDecision || "continue";
    const roadmapPercent =
      finalDecision === "passed" ? 100 : Math.max(quizPercent, 0);

    const finalSummary = {
      phaseId: phase.id,
      phaseTitle: phase.title,
      quizTitle: phase.quiz.title,
      totalQuestions,
      answeredQuestions,
      correctCount,
      incorrectCount: answeredQuestions - correctCount,
      quizPercent,
      roadmapPercent,
      decision: finalDecision,
      reason: lastReason || "",
      finishedAt: new Date().toISOString(),
    };

    sessionStorage.setItem("studysync-last-quiz-result", JSON.stringify(finalSummary));

    const currentProgress = getStoredProgress() ?? fallbackProgress;
    // PENTING: Tambahkan finalDecision ke applyQuizProgress
    saveProgress(applyQuizProgress(currentProgress, phase.id, roadmapPercent, finalDecision));

    navigate(`/quiz-result/${phase.id}`);
  };

  const handleSubmitAnswer = async () => {
    if (!sessionId || selectedOption === null || isChecking || isSubmitted || quizFinished) return;

    setIsChecking(true);
    setSessionError("");

    const timeSpentSec = Math.max(
      1,
      Math.round((Date.now() - questionStartedAtRef.current) / 1000)
    );

    const isCorrect = selectedOption === currentQuestion.answer;

    try {
      const result = await submitQuizAnswer({
        sessionId,
        questionId: `${phase.id}-${currentQuestionIndex + 1}`,
        isCorrect,
        timeSpentSec,
        difficulty: currentQuestion.difficulty,
      });

      const nextCorrectCount = correctCount + (isCorrect ? 1 : 0);
      const masteryScore = Number(result.mastery_score ?? 0);

      setCorrectCount(nextCorrectCount);
      setLastDecision(result.decision ?? "continue");
      setLastReason(result.reason ?? "");
      setShouldStopQuiz(Boolean(result.should_stop_quiz));
      setIsSubmitted(true);

      const debugSnapshot = {
        phaseId: phase.id,
        quizTitle: phase.quiz.title,
        questionNumber: currentQuestionIndex + 1,
        questionText: currentQuestion.question,
        selectedOption,
        correctOption: currentQuestion.answer,
        isCorrect,
        timeSpentSec,
        masteryScore,
        decision: result.decision ?? "continue",
        reason: result.reason ?? "",
        shouldStopQuiz: Boolean(result.should_stop_quiz),
        answeredQuestions: currentQuestionIndex + 1,
        correctCount: nextCorrectCount,
        totalQuestions,
        timestamp: new Date().toISOString(),
      };

      window.__QUIZ_AI_DEBUG__ = debugSnapshot;
      window.sessionStorage.setItem("studysync-last-ai", JSON.stringify(debugSnapshot));
      console.debug("[Quiz AI Debug]", debugSnapshot);
    } catch (error) {
      setSessionError(error.message || "Gagal mengirim jawaban ke AI.");
      setSelectedOption(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handlePrimaryAction = async () => {
    if (isChecking || quizFinished) return;

    if (!isSubmitted) {
      await handleSubmitAnswer();
      return;
    }

    if (shouldStopQuiz || isLastQuestion) {
      finishQuiz();
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  };

  if (quizFinished) {
    return (
      <div className="page-shell">
        <AppNavbar />

        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="section-card p-8">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">Sesi selesai</p>
            <h1 className="font-display mt-3 text-4xl text-[#172017]">{phase.quiz.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Quiz sudah selesai. Progress roadmap dan status belajar sudah diperbarui otomatis.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/quiz")}
                className="btn-secondary px-5 py-3 text-sm text-[#285b2f]"
              >
                Kembali ke daftar quiz
              </button>
              <Link to={`/learning/${phase.id}`} className="btn-primary px-5 py-3 text-sm">
                Kembali ke learning
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <AppNavbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <Link to={`/learning/${phase.id}`} className="text-sm font-bold text-[#285b2f]">
              Kembali ke learning
            </Link>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">
              {phase.phase}
            </p>
            <h1 className="font-display mt-2 text-4xl text-[#172017] sm:text-5xl">
              {phase.quiz.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Jawab satu per satu. AI akan mengecek jawaban setelah kamu menekan Submit.
            </p>
          </div>
        </section>

        {sessionError && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {sessionError}
          </div>
        )}

        <section className="section-card p-4 sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                Question {currentQuestionIndex + 1}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Difficulty:{" "}
                <span className="capitalize text-[#285b2f]">{currentQuestion.difficulty}</span>
              </p>
            </div>

            <div className="rounded-full bg-[#eef8e8] px-4 py-2 text-sm font-bold text-[#285b2f]">
              AI checks after submit
            </div>
          </div>

          <QuestionCard
            question={currentQuestion}
            selected={selectedOption}
            submitted={isSubmitted}
            disabled={isChecking || isSubmitted}
            onSelect={(optionIndex) => {
              if (isChecking || isSubmitted) return;
              setSelectedOption(optionIndex);
            }}
          />
        </section>

        <section className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={selectedOption === null || isChecking}
            onClick={handlePrimaryAction}
            className={[
              "rounded-xl px-5 py-3 text-sm font-bold transition",
              selectedOption === null || isChecking
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "btn-primary",
            ].join(" ")}
          >
            {isChecking
              ? "Mengecek..."
              : !isSubmitted
              ? "Submit"
              : shouldStopQuiz || isLastQuestion
              ? "Selesai"
              : "Lanjut"}
          </button>
        </section>
      </main>
    </div>
  );
}

function QuestionCard({ question, selected, submitted, disabled, onSelect }) {
  return (
    <article className="rounded-3xl border border-emerald-950/10 bg-white p-5 sm:p-7">
      <h2 className="text-xl font-bold leading-8 text-[#172017] sm:text-2xl">{question.question}</h2>

      <div className="mt-5 grid gap-3">
        {question.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          const isCorrect = optionIndex === question.answer;
          const isWrongSelected = submitted && isSelected && !isCorrect;

          let buttonClass =
            "border-slate-200 bg-white text-slate-600 hover:border-[#4d8b41]/50";

          if (submitted) {
            if (isCorrect) {
              buttonClass = "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm";
            } else if (isWrongSelected) {
              buttonClass = "border-red-500 bg-red-50 text-red-700 shadow-sm";
            } else {
              buttonClass = "border-slate-200 bg-slate-50 text-slate-400";
            }
          } else if (isSelected) {
            buttonClass = "border-[#4d8b41] bg-white text-[#285b2f] shadow-sm";
          }

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(optionIndex)}
              disabled={disabled}
              className={[
                "rounded-2xl border p-4 text-left font-semibold transition",
                disabled && !submitted ? "cursor-not-allowed" : "",
                buttonClass,
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
    </article>
  );
}