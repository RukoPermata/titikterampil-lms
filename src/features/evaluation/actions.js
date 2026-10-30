import { assignments, classes, users } from '@/src/data/mock';

let sessionAssignments_103022400061 = [...assignments];
let sessionSubmissions_103022400061 = [];

export function loadAssignments_103022400061() {
  return sessionAssignments_103022400061;
}

export function loadSubmissions_103022400061() {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("titikterampil_submissions");
    if (saved) {
      try {
        sessionSubmissions_103022400061 = JSON.parse(saved);
      } catch (e) {
        sessionSubmissions_103022400061 = [];
      }
    }
  }
  return sessionSubmissions_103022400061;
}

export function createAssignment_103022400061(currentList, newData) {
  const newItem = {
    id: `task-${Date.now()}`,
    classId: newData.classId,
    title: newData.title,
    instructions: newData.instructions
  };
  sessionAssignments_103022400061 = [...currentList, newItem];
  return sessionAssignments_103022400061;
}

export function deleteAssignment_103022400061(currentList, id) {
  sessionAssignments_103022400061 = currentList.filter((item) => item.id !== id);
  return sessionAssignments_103022400061;
}

export function gradeSubmission_103022400061(currentSubmissions, submissionId, scoreValue, feedbackText) {
  sessionSubmissions_103022400061 = currentSubmissions.map((sub) => {
    if (sub.id === submissionId) {
      return {
        ...sub,
        score: Number(scoreValue),
        feedback: feedbackText,
        status: "Sudah Dinilai"
      };
    }
    return sub;
  });

  if (typeof window !== "undefined") {
    window.localStorage.setItem("titikterampil_submissions", JSON.stringify(sessionSubmissions_103022400061));
  }

  return sessionSubmissions_103022400061;
}

export function calculateStudentResults_103022400061(submissionsList, currentAssignments) {
  const students = Array.isArray(users) ? users.filter((u) => u.role === "student") : [];
  const totalTasks = Array.isArray(currentAssignments) ? currentAssignments.length : 0;

  return students.map((st) => {
    const studentClass = classes.find((c) => c.level === st.level && c.grade === st.grade) || classes[0];
    const studentSubs = Array.isArray(submissionsList)
      ? submissionsList.filter((sub) => sub.studentId === st.id || sub.studentName === st.name)
      : [];

    let totalScore = 0;
    let gradedCount = 0;

    studentSubs.forEach((sub) => {
      if (sub.score !== null && sub.score !== undefined) {
        totalScore += Number(sub.score);
        gradedCount++;
      }
    });

    const averageScore = gradedCount > 0 ? Math.round(totalScore / gradedCount) : 0;

    return {
      id: st.id,
      studentName: st.name,
      level: st.level,
      className: studentClass?.title || "-",
      completedAssignments: studentSubs.length,
      totalAssignments: totalTasks,
      averageScore: averageScore
    };
  });
}

export function filterResultsByClass_103022400061(resultsList, selectedClass) {
  if (!Array.isArray(resultsList)) return [];
  if (!selectedClass || selectedClass === "SEMUA") {
    return resultsList;
  }
  return resultsList.filter((item) => item.className === selectedClass);
}

export function calculateClassAverage_103022400061(dataList) {
  if (!Array.isArray(dataList) || dataList.length === 0) return 0;
  const total = dataList.reduce((acc, item) => acc + item.averageScore, 0);
  return Math.round(total / dataList.length);
}