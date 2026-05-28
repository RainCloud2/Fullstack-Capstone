import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

const STORAGE_KEY = "studysync-last-quiz-result";

export default function QuizResultPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);

      if (!stored) {
        throw new Error("Hasil quiz belum tersedia.");
      }

      const parsed = JSON.parse(stored);
      setResult(parsed);
    } catch (err) {
      setError(`${err.message} Pastikan kamu sudah menyelesaikan quiz sebelumnya.`);
    }
  }, []);

  const percent = useMemo(() => {
    if (!result) return 0;
    return Math.max(0, Math.min(100, Number(result.roadmapPercent ?? result.quizPercent ?? 0)));
  }, [result]);

  const stateConfig = useMemo(() => {
    if (!result) return null;

    const decision = result.decision || "continue";

    const configMap = {
      passed: {
        badge: "Lulus",
        title: "Kamu siap lanjut ke materi berikutnya.",
        desc: "AI melihat performamu stabil dan cukup kuat untuk membuka fase berikutnya.",
        tone: "green",
      },
      needs_remedial: {
        badge: "Perlu ulang",
        title: "Materi ini masih perlu diulang.",
        desc: "AI mendeteksi pemahaman belum stabil. Lebih aman kalau kamu review dulu.",
        tone: "red",
      },
      stagnant: {
        badge: "Stagnan",
        title: "Progress kamu mulai stagnan.",
        desc: "AI menghentikan sesi lebih awal supaya kamu tidak lanjut saat progress tidak naik.",
        tone: "amber",
      },
      declining: {
        badge: "Turun",
        title: "Performa kamu sedang menurun.",
        desc: "AI melihat penurunan performa di beberapa jawaban terakhir.",
        tone: "orange",
      },
      continue: {
        badge: "Lanjut",
        title: "Quiz selesai dan sesi dinilai aman untuk lanjut.",
        desc: "AI belum menemukan sinyal kuat untuk menghentikan sesi lebih awal.",
        tone: "blue",
      },
    };

    return configMap[decision] ?? configMap.continue;
  }, [result]);

  if (error) {
    return (
      <div className="page-shell">
        <AppNavbar />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="section-card p-8 text-center">
            <h1 className="font-display text-4xl text-[#172017]">Review belum tersedia</h1>
            <p className="mt-3 text-slate-600">{error}</p>
            <Link to="/roadmap" className="btn-primary mt-6 px-5 py-3">
              Kembali ke roadmap
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="page-shell">
        <AppNavbar />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="section-card p-8 text-center">
            <p className="font-bold text-slate-600">Memuat hasil quiz...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <AppNavbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.65fr]">
          <div className="relative overflow-hidden rounded-3xl bg-[#1f4725] p-8 text-white shadow-2xl shadow-green-950/20 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-lime-100">
              Hasil quiz
            </p>
            <h1 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
              {result.quizTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-lime-50/85">
              {stateConfig?.desc}
            </p>
            <p className="mt-4 w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-lime-50">
              Progress roadmap sudah diperbarui otomatis.
            </p>
          </div>

          <aside className="section-card p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              Ringkasan
            </p>
            <p className="mt-3 text-5xl font-extrabold text-[#285b2f]">{percent}%</p>
            <p className="mt-2 font-bold text-[#172017]">
              {result.correctCount} pertanyaan benar
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {stateConfig?.badge || "Selesai"}
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#4d8b41]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="section-card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-[#172017]">AI evaluation summary</h2>
              <span
                className={[
                  "rounded-full px-3 py-1 text-xs font-bold",
                  stateConfig?.tone === "green"
                    ? "bg-[#e8ffe3] text-[#285b2f]"
                    : stateConfig?.tone === "red"
                    ? "bg-red-50 text-red-700"
                    : stateConfig?.tone === "amber"
                    ? "bg-amber-50 text-amber-700"
                    : stateConfig?.tone === "orange"
                    ? "bg-orange-50 text-orange-700"
                    : "bg-blue-50 text-blue-700",
                ].join(" ")}
              >
                {stateConfig?.badge || "Status"}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Tempat ini nanti bisa diisi rekomendasi dari AI, misalnya area yang kuat, area yang perlu diulang,
              dan alasan kenapa sesi dihentikan atau dilanjutkan.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#eef8e8] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4d8b41]">
                  Kuat di
                </p>
                <p className="mt-2 text-sm font-semibold text-[#285b2f]">
                  (placeholder) Komponen ini bisa dihubungkan ke output AI berikutnya
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                  Perlu review
                </p>
                <p className="mt-2 text-sm font-semibold text-red-700">
                  (placeholder) Temanmu bisa isi rekomendasi course / topik berikutnya di sini
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Alasan AI: {result.reason || "Belum ada alasan tambahan dari backend."}
            </p>
          </div>

          <div className="section-card p-6">
            <h2 className="font-display text-2xl text-[#172017]">Rekomendasi course AI</h2>
            <div className="mt-4 rounded-3xl border border-dashed border-[#4d8b41]/30 bg-[#f7fff4] p-5">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#4d8b41]">
                Template slot
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Di sini nanti kamu bisa pasang rekomendasi course dari AI, misalnya:
                <br />
                <b>“Ulangi Flexbox dulu sebelum lanjut ke JavaScript”</b>
                <br />
                atau
                <br />
                <b>“Lanjut ke fase berikutnya”</b>
              </p>

              <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-[#172017]">Contoh output yang bisa dipakai nanti</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>• Recommended course title</li>
                  <li>• Short explanation</li>
                  <li>• Confidence / priority</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/quiz/${result.phaseId}`}
            className="btn-secondary px-5 py-3 text-center text-sm text-[#285b2f]"
          >
            Ulangi quiz
          </Link>
          <Link
            to={`/learning/${result.phaseId}`}
            className="btn-primary px-5 py-3 text-center text-sm"
          >
            Kembali ke learning
          </Link>
        </section>
      </main>
    </div>
  );
}