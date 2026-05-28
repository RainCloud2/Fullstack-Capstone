import AppNavbar from "../components/AppNavbar";

export default function QuizPage() {
  const quizzes = [
    { icon: "HT", title: "HTML & CSS", info: "20 soal - Selesai 3 hari lalu", score: "92%", action: "Ulangi", tone: "blue" },
    { icon: "GT", title: "Git basics", info: "15 soal - Skor di bawah target", score: "78%", action: "Ulangi sekarang", tone: "orange", danger: true },
    { icon: "JS", title: "JavaScript dasar", info: "25 soal - Selesai kemarin", score: "85%", action: "Ulangi", tone: "violet" },
    { icon: "CL", title: "Closure & Scope", info: "20 soal - Sedang berjalan", score: "Belum selesai", action: "Lanjut", tone: "green", progress: true },
    { icon: "AS", title: "Async / Await", info: "20 soal - Selesaikan fase 2 dulu", score: "-", action: "Terkunci", tone: "slate", locked: true },
  ];

  return (
    <div className="page-shell">
      <AppNavbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">Quiz</p>
          <h1 className="font-display mt-2 text-4xl text-[#172017] sm:text-5xl">Quiz & tes skill</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Selesaikan quiz untuk membuka materi berikutnya dan menjaga rekomendasi AI tetap akurat.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Quiz selesai" value="3 / 8" desc="37% selesai" />
          <StatCard title="Rata-rata skor" value="85%" desc="Bagus" />
          <StatCard title="Perlu diulang" value="1 quiz" desc="Git basics" />
        </section>

        <section className="mt-8 section-card p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="font-display text-3xl text-[#172017]">Semua quiz</h2>
            <span className="rounded-full bg-[#eef8e8] px-4 py-2 text-sm font-bold text-[#285b2f]">
              Next: Closure & Scope
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {quizzes.map((quiz) => (
              <QuizItem key={quiz.title} quiz={quiz} />
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-[#4d8b41]/15 bg-[#e8ffe3] p-6 text-[#23470f]">
          <h3 className="font-bold">Rekomendasi AI</h3>
          <p className="mt-2 leading-7">
            Ulangi quiz <b>Git basics</b>. Skor 78% masih sedikit di bawah target 80%, terutama di branching dan merge conflict.
          </p>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, desc }) {
  return (
    <div className="section-card p-5">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <h2 className="mt-3 text-3xl font-extrabold text-[#172017]">{value}</h2>
      <p className="mt-1 text-sm font-bold text-[#4d8b41]">{desc}</p>
    </div>
  );
}

function QuizItem({ quiz }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    orange: "bg-orange-50 text-orange-700",
    violet: "bg-violet-50 text-violet-700",
    green: "bg-green-50 text-green-700",
    slate: "bg-slate-100 text-slate-500",
  };

  return (
    <article className={["flex flex-col gap-4 rounded-2xl border border-emerald-950/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between", quiz.locked ? "opacity-60" : ""].join(" ")}>
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
        <span className={["rounded-full px-4 py-2 text-sm font-bold", quiz.progress ? "bg-slate-100 text-slate-500" : "bg-[#e8ffe3] text-[#285b2f]"].join(" ")}>
          {quiz.score}
        </span>
        <button
          disabled={quiz.locked}
          className={[
            "rounded-xl px-4 py-2 text-sm font-bold transition",
            quiz.danger
              ? "bg-[#8e1b13] text-white hover:bg-[#74160f]"
              : quiz.locked
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
