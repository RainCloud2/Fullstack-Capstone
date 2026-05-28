import AppNavbar from "../components/AppNavbar";

export default function CoursePage() {
  const courses = [
    {
      platform: "Frontend Masters",
      badge: "AI pick",
      title: "JavaScript: The Hard Parts",
      meta: "Will Sentance - 6 jam - Berbayar",
      tags: ["Closure", "Scope", "Prototype"],
      rating: "* 4.9 - 12k pelajar",
      action: "Mulai",
      tone: "green",
    },
    {
      platform: "Udemy",
      title: "ES6+ In Depth - Modern JavaScript",
      meta: "Jonas Schmedtmann - 4.5 jam - Berbayar",
      tags: ["Arrow fn", "Destructuring", "Modules"],
      rating: "* 4.8 - 45k pelajar",
      action: "Mulai",
      tone: "orange",
    },
    {
      platform: "YouTube",
      title: "JavaScript Closure Explained",
      meta: "FreeCodeCamp - 45 menit - Gratis",
      tags: ["Closure", "Scope chain"],
      rating: "2.3jt penonton",
      action: "Tonton",
      tone: "red",
    },
    {
      platform: "MDN Web Docs",
      title: "Closures - MDN Documentation",
      meta: "Mozilla - Baca 20 menit - Gratis",
      tags: ["Referensi", "Contoh kode"],
      rating: "Dokumentasi resmi",
      action: "Baca",
      tone: "blue",
    },
  ];

  return (
    <div className="page-shell">
      <AppNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">Course</p>
            <h1 className="font-display mt-2 text-4xl text-[#172017] sm:text-5xl">Rekomendasi course</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Dikurasi AI sesuai posisimu di roadmap: JavaScript lanjutan.
            </p>
          </div>
          <div className="section-card p-4">
            <p className="text-sm font-bold text-slate-500">Fokus minggu ini</p>
            <p className="mt-1 text-lg font-extrabold text-[#285b2f]">Closure & Scope</p>
          </div>
        </section>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {["Semua", "Closure & Scope", "Berbayar", "Video", "Artikel", "Interaktif"].map((filter, index) => (
            <button
              key={filter}
              className={[
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition",
                index === 0
                  ? "bg-[#285b2f] text-white shadow-lg shadow-green-950/15"
                  : "border border-emerald-950/10 bg-white text-slate-600 hover:text-[#285b2f]",
              ].join(" ")}
            >
              {filter}
            </button>
          ))}
        </div>

        <section className="grid gap-5 lg:grid-cols-2">
          {courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </section>
      </main>
    </div>
  );
}

function CourseCard({ course }) {
  const tones = {
    green: "bg-[#e8ffe3] text-[#285b2f]",
    orange: "bg-orange-50 text-orange-700",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return (
    <article className="section-card flex min-h-[260px] flex-col p-6 transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <span className={["rounded-full px-3 py-1 text-xs font-bold", tones[course.tone]].join(" ")}>
          {course.platform}
        </span>
        {course.badge && (
          <span className="rounded-full bg-[#285b2f] px-3 py-1 text-xs font-bold text-white">
            {course.badge}
          </span>
        )}
      </div>

      <h2 className="font-display mt-5 text-3xl leading-tight text-[#172017]">{course.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{course.meta}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {course.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-500">{course.rating}</p>
        <button className="btn-primary px-5 py-2.5 text-sm">{course.action}</button>
      </div>
    </article>
  );
}
