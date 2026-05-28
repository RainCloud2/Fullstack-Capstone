import { useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import { Link } from "react-router-dom";
import { learningPhases } from "../data/learningData";
import { fallbackProgress, fetchProgress, mergePhasesWithProgress } from "../services/progressApi";

export default function RoadmapPage() {
  const [progress, setProgress] = useState(fallbackProgress);

  useEffect(() => {
    fetchProgress()
      .then(setProgress)
      .catch(() => setProgress(fallbackProgress));
  }, []);

  const phases = mergePhasesWithProgress(learningPhases, progress);

  return (
    <div className="page-shell">
      <AppNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">Roadmap</p>
            <h1 className="font-display mt-2 text-4xl text-[#172017] sm:text-5xl">Roadmap kamu</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Frontend Engineer path disesuaikan AI berdasarkan skill awalmu.
            </p>
          </div>
          <div className="section-card min-w-[220px] p-5">
            <p className="text-sm font-semibold text-slate-500">Progress total</p>
            <p className="mt-2 text-3xl font-extrabold text-[#285b2f]">{progress.totalProgress}%</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[#4d8b41]" style={{ width: `${progress.totalProgress}%` }} />
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {phases.map((item) => (
            <RoadmapCard key={item.phase} item={item} />
          ))}
        </section>
      </main>
    </div>
  );
}

function RoadmapCard({ item }) {
  return (
    <Link
      to={`/learning/${item.id}`}
      className={["section-card block p-6 transition hover:-translate-y-1 hover:border-[#4d8b41]/30 hover:shadow-xl", !item.active ? "opacity-60" : ""].join(" ")}
      aria-label={`Buka learning ${item.title}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">{item.phase}</p>
          <h2 className="font-display mt-2 text-3xl text-[#172017]">{item.title}</h2>
        </div>
        <span
          className={[
            "rounded-full px-3 py-1 text-xs font-bold",
            item.status === "Terkunci" ? "bg-slate-100 text-slate-500" : "bg-[#e8ffe3] text-[#285b2f]",
          ].join(" ")}
        >
          {item.status}
        </span>
      </div>

      <p className="mt-4 min-h-[52px] text-sm leading-6 text-slate-600 sm:text-base">{item.desc}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className={[
              "rounded-full px-3 py-1 text-xs font-bold",
              item.active ? "bg-[#eef8e8] text-[#285b2f]" : "bg-slate-100 text-slate-500",
            ].join(" ")}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-[#4d8b41]" style={{ width: `${item.progress}%` }} />
      </div>
      <p className="mt-3 text-sm font-bold text-[#285b2f]">
        {item.progress > 0 ? `${item.progress}% selesai` : "Belum dimulai"}
      </p>
    </Link>
  );
}
