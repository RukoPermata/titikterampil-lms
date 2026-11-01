import { users, assignments, classes, questions } from '@/src/data/mock';

export function getTeacherStats_103022400061() {
  const submissions = getSubmissions_103022400061();
  const waitingForGrading = submissions.filter((sub) => sub.status !== "Selesai").length;

  return {
    essaysWaiting: waitingForGrading,
    totalQuestions: Array.isArray(questions) ? questions.length : 0,
    totalClasses: Array.isArray(classes) ? classes.length : 0,
    totalAssignments: Array.isArray(assignments) ? assignments.length : 0
  };
}

const defaultSubmissions = [
  {
    id: "sub-01",
    studentName: "Budi Santoso",
    packageName: "Tryout Matematika SMA - Paket 1",
    submittedAt: "2026-10-30 14:20",
    score: null,
    status: "Perlu Dinilai",
    essayPrompt: "Jelaskan langkah menyelesaikan persamaan 2x + 4 = 10 dan tentukan nilai x.",
    essayAnswer: "Langkah pertama kurangkan 4 dari kedua sisi menjadi 2x = 6. Kemudian bagi kedua sisi dengan 2, sehingga didapatkan x = 3.",
    maxScore: 20
  },
  {
    id: "sub-02",
    studentName: "Siti Rahmawati",
    packageName: "Simulasi UTBK-SNBT Skolastik",
    submittedAt: "2026-10-31 09:15",
    score: 18,
    status: "Selesai",
    essayPrompt: "Uraikan argumen utama mengenai dampak kecerdasan buatan pada dunia pendidikan.",
    essayAnswer: "Dampak AI mencakup personalisasi belajar dan efisiensi evaluasi, namun perlu pengawasan etis dan integritas akademik.",
    feedback: "Penjelasan terstruktur dan komprehensif.",
    maxScore: 20
  }
];

export function getSubmissions_103022400061() {
  if (typeof window === "undefined") return defaultSubmissions;

  const saved = window.localStorage.getItem("titikterampil_submissions");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : defaultSubmissions;
    } catch {
      return defaultSubmissions;
    }
  }

  window.localStorage.setItem("titikterampil_submissions", JSON.stringify(defaultSubmissions));
  return defaultSubmissions;
}

export function getSubmissionById_103022400061(id) {
  const submissions = getSubmissions_103022400061();
  return submissions.find((sub) => sub.id === id) || null;
}

export function saveEssayGrade_103022400061(submissionId, score, feedback) {
  const submissions = getSubmissions_103022400061();
  const updated = submissions.map((sub) => {
    if (sub.id === submissionId) {
      return {
        ...sub,
        score: Number(score),
        feedback: feedback,
        status: "Selesai"
      };
    }
    return sub;
  });

  if (typeof window !== "undefined") {
    window.localStorage.setItem("titikterampil_submissions", JSON.stringify(updated));
  }
  return updated;
}

export function getStudentsForMembership_103022400061() {
  const baseStudents = Array.isArray(users) ? users.filter((u) => u.role === "student") : [];
  if (typeof window === "undefined") return baseStudents;

  const saved = window.localStorage.getItem("titikterampil_students");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : baseStudents;
    } catch (e) {
      return baseStudents;
    }
  }

  window.localStorage.setItem("titikterampil_students", JSON.stringify(baseStudents));
  return baseStudents;
}

export function toggleMembership_103022400061(studentId) {
  const students = getStudentsForMembership_103022400061();
  const updated = students.map((st) => {
    if (st.id === studentId) {
      return { ...st, isMember: !st.isMember };
    }
    return st;
  });

  if (typeof window !== "undefined") {
    window.localStorage.setItem("titikterampil_students", JSON.stringify(updated));
  }
  return updated;
}