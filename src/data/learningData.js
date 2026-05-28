export const learningPhases = [
  {
    id: "fondasi-web",
    phase: "Fase 1",
    title: "Fondasi Web",
    desc: "Struktur HTML, layout CSS, responsif, dan workflow Git.",
    tags: ["HTML", "CSS", "Flexbox", "Git Basics"],
    progress: 0,
    status: "Belum dimulai",
    active: true,
    focus: "HTML, CSS, dan dasar workflow web",
    courses: [
      {
        title: "HTML & CSS Foundations",
        provider: "StudySync Placeholder",
        duration: "2 jam",
        level: "Beginner",
        tags: ["HTML", "CSS"],
      },
      {
        title: "Responsive Layout with Flexbox",
        provider: "StudySync Placeholder",
        duration: "1.5 jam",
        level: "Beginner",
        tags: ["Flexbox", "Responsive"],
      },
      {
        title: "Git Basics for Web Projects",
        provider: "StudySync Placeholder",
        duration: "1 jam",
        level: "Beginner",
        tags: ["Git", "Version Control"],
      },
    ],
    quiz: {
      title: "Quiz Fondasi Web",
      questions: [
        {
          question: "Tag HTML apa yang biasanya dipakai untuk judul utama halaman?",
          difficulty: "easy",
          options: ["<main>", "<h1>", "<section>", "<header>"],
          answer: 1,
        },
        {
          question: "Properti CSS apa yang dipakai untuk mengatur jarak di dalam elemen?",
          difficulty: "easy",
          options: ["margin", "padding", "border", "display"],
          answer: 1,
        },
        {
          question: "Perintah Git untuk menyimpan snapshot perubahan adalah...",
          difficulty: "medium",
          options: ["git save", "git push", "git commit", "git upload"],
          answer: 2,
        },
        {
          question: "CSS property apa yang biasa dipakai untuk membuat layout fleksibel satu dimensi?",
          difficulty: "medium",
          options: ["display: flex", "position: fixed", "font-style", "z-index"],
          answer: 0,
        },
        {
          question: "Elemen HTML semantik untuk area navigasi biasanya adalah...",
          difficulty: "easy",
          options: ["<aside>", "<nav>", "<article>", "<footer>"],
          answer: 1,
        },
      ],
    },
  },
  {
    id: "javascript",
    phase: "Fase 2",
    title: "JavaScript",
    desc: "Logika, DOM, scope, async flow, dan pola ES6+ modern.",
    tags: ["JS Dasar", "Closure", "Async / Await", "ES6+"],
    progress: 0,
    status: "Terkunci",
    active: false,
    focus: "Logika JavaScript dan interaktivitas browser",
    courses: [
      {
        title: "JavaScript Dasar untuk Frontend",
        provider: "StudySync Placeholder",
        duration: "3 jam",
        level: "Beginner",
        tags: ["Variables", "Function", "DOM"],
      },
      {
        title: "Closure & Scope Praktis",
        provider: "StudySync Placeholder",
        duration: "2 jam",
        level: "Intermediate",
        tags: ["Closure", "Scope"],
      },
      {
        title: "Async JavaScript Workflow",
        provider: "StudySync Placeholder",
        duration: "2.5 jam",
        level: "Intermediate",
        tags: ["Promise", "Async / Await"],
      },
    ],
    quiz: {
      title: "Quiz JavaScript",
      questions: [
        {
          question: "Method yang umum dipakai untuk memilih elemen DOM berdasarkan selector CSS adalah...",
          difficulty: "easy",
          options: ["document.find()", "document.querySelector()", "document.pick()", "document.getCss()"],
          answer: 1,
        },
        {
          question: "Closure terjadi ketika function...",
          difficulty: "hard",
          options: [
            "tidak punya parameter",
            "mengakses variable dari scope luarnya",
            "hanya berjalan sekali",
            "selalu mengembalikan string",
          ],
          answer: 1,
        },
        {
          question: "Keyword untuk menunggu Promise selesai di dalam async function adalah...",
          difficulty: "medium",
          options: ["wait", "pause", "await", "then"],
          answer: 2,
        },
        {
          question: "Operator apa yang membandingkan nilai dan tipe data sekaligus?",
          difficulty: "easy",
          options: ["==", "=", "===", "!="],
          answer: 2,
        },
        {
          question: "Method array yang cocok untuk membuat array baru dari hasil transformasi adalah...",
          difficulty: "medium",
          options: ["forEach", "map", "push", "pop"],
          answer: 1,
        },
      ],
    },
  },
  {
    id: "react-ekosistem",
    phase: "Fase 3",
    title: "React & Ekosistem",
    desc: "Component-based UI, hooks, state, routing, dan TypeScript.",
    tags: ["React dasar", "Hooks", "State", "TypeScript"],
    progress: 0,
    status: "Terkunci",
    active: false,
    focus: "Komponen React dan state management",
    courses: [
      {
        title: "React Component Basics",
        provider: "StudySync Placeholder",
        duration: "2 jam",
        level: "Intermediate",
        tags: ["React", "Components"],
      },
    ],
    quiz: {
      title: "Quiz React & Ekosistem",
      questions: [
        {
          question: "React membangun UI menggunakan konsep utama bernama...",
          difficulty: "easy",
          options: ["Table", "Component", "Database", "Package"],
          answer: 1,
        },
        {
          question: "Hook React yang umum dipakai untuk menyimpan state lokal adalah...",
          difficulty: "easy",
          options: ["useRoute", "useState", "useClass", "useHtml"],
          answer: 1,
        },
        {
          question: "Props pada React dipakai untuk...",
          difficulty: "medium",
          options: ["mengirim data ke component", "menghapus component", "membuat database", "menjalankan server"],
          answer: 0,
        },
        {
          question: "Hook yang cocok untuk menjalankan efek setelah render adalah...",
          difficulty: "medium",
          options: ["useEffect", "useMemo", "useRef", "useNavigate"],
          answer: 0,
        },
        {
          question: "TypeScript membantu proyek React dengan cara...",
          difficulty: "hard",
          options: ["menghapus CSS", "menambahkan type checking", "mengganti browser", "membuat API otomatis"],
          answer: 1,
        },
      ],
    },
  },
  {
    id: "career-preparation",
    phase: "Fase 4",
    title: "Career Preparation",
    desc: "Portfolio project, CV, LinkedIn, dan technical interview.",
    tags: ["Portfolio", "CV", "Interview"],
    progress: 0,
    status: "Terkunci",
    active: false,
    focus: "Portfolio dan persiapan karier developer",
    courses: [
      {
        title: "Build Your Frontend Portfolio",
        provider: "StudySync Placeholder",
        duration: "2 jam",
        level: "Beginner",
        tags: ["Portfolio", "Project"],
      },
    ],
    quiz: {
      title: "Quiz Career Preparation",
      questions: [
        {
          question: "Portfolio developer yang baik sebaiknya menampilkan...",
          difficulty: "medium",
          options: ["hanya foto profil", "project dan penjelasan proses", "password akun", "semua file mentah"],
          answer: 1,
        },
        {
          question: "README project yang baik biasanya menjelaskan...",
          difficulty: "easy",
          options: ["cara menjalankan project", "password pribadi", "semua file node_modules", "riwayat chat"],
          answer: 0,
        },
        {
          question: "Saat interview teknis, menjelaskan trade-off solusi menunjukkan...",
          difficulty: "medium",
          options: ["kemampuan berpikir teknis", "tidak tahu jawaban", "project tidak selesai", "tidak perlu testing"],
          answer: 0,
        },
        {
          question: "CV developer sebaiknya menonjolkan...",
          difficulty: "easy",
          options: ["impact project dan skill relevan", "semua hobi detail", "alamat lengkap publik", "font sebanyak mungkin"],
          answer: 0,
        },
        {
          question: "Portfolio project paling kuat jika punya...",
          difficulty: "hard",
          options: ["demo, source code, dan penjelasan keputusan", "hanya screenshot", "nama project saja", "file kosong"],
          answer: 0,
        },
      ],
    },
  },
];

export function getLearningPhase(phaseId) {
  return learningPhases.find((phase) => phase.id === phaseId);
}
