import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

export default function QuizPage() {
  const navigate = useNavigate();

  const quizzes = [
    { icon: "HT", title: "HTML & CSS", info: "Quiz adaptif", score: "Mulai", action: "Mulai", tone: "blue" },
    { icon: "GT", title: "Git basics", info: "Quiz adaptif", score: "Mulai", action: "Mulai", tone: "orange" },
    { icon: "JS", title: "JavaScript dasar", info: "Quiz adaptif", score: "Mulai", action: "Mulai", tone: "violet" },
    { icon: "CL", title: "Closure & Scope", info: "Quiz adaptif", score: "Mulai", action: "Mulai", tone: "green" },
    { icon: "AS", title: "Async / Await", info: "Quiz adaptif", score: "Terkunci", action: "Terkunci", tone: "slate", locked: true },
  ];

  return (
    <div className="page-shell">
      <AppNavbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">Quiz</p>
          <h1 className="font-display mt-2 text-4xl text-[#172017] sm:text-5xl">Quiz & tes skill</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Quiz sekarang jalan per soal, dan AI akan menghentikan sesi kalau mastery sudah cukup tinggi atau perlu remedial.
          </p>
        </section>

        <section className="section-card p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="font-display text-3xl text-[#172017]">Semua quiz</h2>
          </div>

          <div className="mt-5 space-y-3">
            {quizzes.map((quiz) => (
              <QuizItem
                key={quiz.title}
                quiz={quiz}
                onStart={() => !quiz.locked && navigate(`/quiz/${quiz.title.toLowerCase().replace(/\s+/g, "-")}`)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function QuizItem({ quiz, onStart }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    orange: "bg-orange-50 text-orange-700",
    violet: "bg-violet-50 text-violet-700",
    green: "bg-green-50 text-green-700",
    slate: "bg-slate-100 text-slate-500",
  };

  return (
    <article
      className={[
        "flex flex-col gap-4 rounded-2xl border border-emerald-950/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between",
        quiz.locked ? "opacity-60" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <div className={["grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-black", tones[quiz.tone]].join(" ")}>
          {quiz.icon}
        </div>
        <div>
          <h3 className="font-bold text-[#172017]">{quiz.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{quiz.info}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <span className="rounded-full bg-[#e8ffe3] px-4 py-2 text-sm font-bold text-[#285b2f]">
          {quiz.score}
        </span>
        <button
          type="button"
          disabled={quiz.locked}
          onClick={onStart}
          className={[
            "rounded-xl px-4 py-2 text-sm font-bold transition",
            quiz.locked
              ? "cursor-not-allowed bg-slate-100 text-slate-500"
              : "bg-red-50 text-[#8e1b13] hover:bg-red-100",
          ].join(" ")}
        >
          {quiz.action}
        </button>
      </div>
    </article>
  );
}