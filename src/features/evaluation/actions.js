import { assignments, classes, users } from '../../data/mock';

export const initialSubmissions_103022400061 = [
  {
    id: "SUB-demo-01",
    assignmentId: assignments[0]?.id,
    studentName: users.find(u => u.role === 'student')?.name,
    className: classes[0]?.title,
    submittedAt: "2026-10-27 09:00",
    answerText: "2x = 10 - 4 = 6, sehingga x = 3",
    score: null,
    feedback: "",
    status: "Belum Dinilai"
  }
];

export function loadAssignments_103022400061() {
  return assignments;
}

export function createAssignment_103022400061(currentList, newData) {
  const newItem = {
    id: `TUGAS-0${currentList.length + 1}`,
    classId: newData.classId,
    title: newData.title,
    instructions: newData.instructions
  };
  return [...currentList, newItem];
}

export function deleteAssignment_103022400061(currentList, id) {
  return currentList.filter((item) => item.id !== id);
}

export function gradeSubmission_103022400061(currentSubmissions, submissionId, scoreValue, feedbackText) {
  return currentSubmissions.map((sub) => {
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
}

export function calculateStudentResults_103022400061(submissionsList) {
  const student = users.find(u => u.role === 'student');
  const studentClass = classes[0];

  return [
    {
      id: student?.id,
      studentName: student?.name,
      level: student?.level,
      className: studentClass?.title,
      completedAssignments: submissionsList.length,
      totalAssignments: assignments.length,
      averageAssignmentScore: submissionsList[0].score || 0,
      averageTryoutScore: 85
    }
  ];
}

export function filterResultsByClass_103022400061(resultsList, selectedClass) {
  if (!selectedClass || selectedClass === "SEMUA") {
    return resultsList;
  }
  return resultsList.filter((item) => item.className === selectedClass);
}