import { useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import { getCourseRecommendations } from "../services/aiApi";

export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        
        // Payload ini adalah data minat user. 
        // Di aplikasi nyata, teks ini bisa diambil dari input profil/kuesioner user.
        const payload = {
          pretest_profile_text: "Saya ingin belajar tentang AI, Data Science, dan Machine Learning menggunakan Python",
          taken_courses: [], 
          skip_beginner: false,
          preferred_difficulty: "Beginner", // Bisa "Beginner", "Intermediate", atau "Advanced"
          top_n: 4 // Ambil 4 rekomendasi teratas
        };

        const data = await getCourseRecommendations(payload);

        // Ubah format data dari backend (Python) agar cocok dengan desain UI CourseCard
        const mappedCourses = data.map((item) => {
          // Menyesuaikan warna kartu berdasarkan tingkat kesulitan
          let tone = "blue";
          const diff = item.difficulty.toLowerCase();
          if (diff.includes("intermediate")) tone = "orange";
          if (diff.includes("advanced")) tone = "red";
          if (diff.includes("beginner")) tone = "green";

          return {
            platform: "Coursera", // Dataset model Anda berasal dari Coursera
            badge: `${item.match_score}% Cocok`, // Menampilkan skor kecocokan dari AI
            title: item.title,
            meta: `Tingkat kesulitan: ${item.difficulty}`,
            tags: ["AI Pick", diff],
            rating: "Sistem Rekomendasi Pintar",
            action: "Lihat Kursus",
            url: item.url, // URL untuk menuju ke Coursera
            tone: tone,
          };
        });

        setCourses(mappedCourses);
      } catch (err) {
        setError("Gagal memuat rekomendasi: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  return (
    <div className="page-shell">
      <AppNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">Course</p>
            <h1 className="font-display mt-2 text-4xl text-[#172017] sm:text-5xl">Rekomendasi Course</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Dikurasi AI berdasarkan pemahaman semantik dari profil belajarmu.
            </p>
          </div>
        </section>

        {/* Tampilan Loading */}
        {loading && (
          <div className="py-12 text-center">
            <p className="text-lg font-bold text-[#285b2f] animate-pulse">
              AI sedang mencari kursus terbaik untukmu...
            </p>
          </div>
        )}

        {/* Tampilan Error */}
        {error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-700">
            <p className="font-bold">{error}</p>
          </div>
        )}

        {/* Tampilan Kartu Rekomendasi */}
        {!loading && !error && (
          <section className="grid gap-5 lg:grid-cols-2">
            {courses.map((course) => (
              <CourseCard key={course.title} course={course} />
            ))}
          </section>
        )}
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
        <span className={["rounded-full px-3 py-1 text-xs font-bold", tones[course.tone] || tones.blue].join(" ")}>
          {course.platform}
        </span>
        {course.badge && (
          <span className="rounded-full bg-[#285b2f] px-3 py-1 text-xs font-bold text-white shadow-sm">
            {course.badge}
          </span>
        )}
      </div>

      <h2 className="font-display mt-5 text-2xl leading-tight text-[#172017]">{course.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{course.meta}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {course.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 capitalize">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-500">{course.rating}</p>
        
        {/* Tombol yang mengarah ke URL Coursera aslinya */}
        <a 
          href={course.url} 
          target="_blank" 
          rel="noreferrer"
          className="btn-primary px-5 py-2.5 text-sm text-center"
        >
          {course.action}
        </a>
      </div>
    </article>
  );
}