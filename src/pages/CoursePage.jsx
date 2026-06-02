import { useState, useEffect } from "react";
import AppNavbar from "../components/AppNavbar";
// Pastikan Anda sudah membuat dan meng-export getRecommendations di aiApi.js
import { getRecommendations } from "../services/aiApi"; 

export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fungsi untuk memanggil AI backend saat halaman dimuat
    const fetchAIRecommendations = async () => {
      try {
        setLoading(true);
        // Sesuaikan payload ini dengan state/profil user yang sebenarnya
        const response = await getRecommendations({
          pretest_profile_text: "I want to learn advanced javascript and react",
          skip_beginner: true,
          top_n: 4
        });
        
        // Response dari backend akan di-set ke state courses
        setCourses(response);
      } catch (err) {
        console.error("Gagal mengambil rekomendasi:", err);
        setError("Gagal memuat rekomendasi dari AI.");
      } finally {
        setLoading(false);
      }
    };

    fetchAIRecommendations();
  }, []);

  return (
    <div className="page-shell">
      <AppNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">Course</p>
            <h1 className="font-display mt-2 text-4xl text-[#172017] sm:text-5xl">Rekomendasi course</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Dikurasi AI sesuai posisimu di roadmap.
            </p>
          </div>
        </section>

        {/* Handling Loading & Error States */}
        {loading && <p className="text-slate-500 font-medium">AI sedang meracik rekomendasi terbaik untukmu...</p>}
        {error && <p className="text-red-500 font-medium">{error}</p>}

        {/* Tampilkan data dari AI */}
        {!loading && !error && (
          <section className="grid gap-5 lg:grid-cols-2">
            {courses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function CourseCard({ course }) {
  // Karena backend mengembalikan format data yang sedikit berbeda dari dummy data awal,
  // kita sesuaikan prop mapping di komponen ini.
  return (
    <article className="section-card flex min-h-[260px] flex-col p-6 transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full px-3 py-1 text-xs font-bold bg-[#e8ffe3] text-[#285b2f]">
          Coursera
        </span>
        {/* Tampilkan Match Score dari AI */}
        <span className="rounded-full bg-[#285b2f] px-3 py-1 text-xs font-bold text-white">
          {course.match_score}% Match
        </span>
      </div>

      <h2 className="font-display mt-5 text-3xl leading-tight text-[#172017]">{course.title}</h2>
      
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          Level: {course.difficulty}
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <a 
          href={course.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-primary px-5 py-2.5 text-sm text-center"
        >
          Lihat Kursus
        </a>
      </div>
    </article>
  );
}