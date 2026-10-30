"use client";

import React, { useState, useEffect } from "react";
import { classes } from "@/src/data/mock";
import {
  loadAssignments_103022400061,
  loadSubmissions_103022400061,
  createAssignment_103022400061,
  deleteAssignment_103022400061,
  gradeSubmission_103022400061
} from "@/src/features/evaluation/actions";

export default function TeacherAssignmentsPage_103022400061() {
  const [assignments, setAssignments_103022400061] = useState([]);
  const [submissions, setSubmissions_103022400061] = useState([]);
  const [classList] = useState(classes);

  const [title, setTitle_103022400061] = useState("");
  const [classId, setClassId_103022400061] = useState(classes[0]?.id || "");
  const [instructions, setInstructions_103022400061] = useState("");

  const [selectedSubId, setSelectedSubId_103022400061] = useState(null);
  const [inputScore, setInputScore_103022400061] = useState("");
  const [inputFeedback, setInputFeedback_103022400061] = useState("");

  useEffect(() => {
    setAssignments_103022400061(loadAssignments_103022400061());
    setSubmissions_103022400061(loadSubmissions_103022400061());
  }, []);

  function handleAddAssignment_103022400061(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const newData = { classId, title, instructions };
    const updatedAssignments = createAssignment_103022400061(assignments, newData);

    setAssignments_103022400061(updatedAssignments);
    setTitle_103022400061("");
    setInstructions_103022400061("");
  }

  function handleDeleteAssignment_103022400061(id) {
    const updatedAssignments = deleteAssignment_103022400061(assignments, id);
    setAssignments_103022400061(updatedAssignments);
  }

  function handleSelectSubmission_103022400061(sub) {
    setSelectedSubId_103022400061(sub.id);
    setInputScore_103022400061(sub.score !== null && sub.score !== undefined ? sub.score : "");
    setInputFeedback_103022400061(sub.feedback || "");
  }

  function handleSaveGrade_103022400061(e) {
    e.preventDefault();
    if (!selectedSubId || inputScore === "") return;

    const updatedSubmissions = gradeSubmission_103022400061(
      submissions,
      selectedSubId,
      inputScore,
      inputFeedback
    );

    setSubmissions_103022400061(updatedSubmissions);
    setSelectedSubId_103022400061(null);
    setInputScore_103022400061("");
    setInputFeedback_103022400061("");
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Kelola Tugas & Penilaian</h1>
        <p className="text-gray-600">Buat tugas berdasarkan data akademik dan berikan penilaian siswa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Buat Tugas Baru</h2>
          <form onSubmit={handleAddAssignment_103022400061} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Tugas</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle_103022400061(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kelas</label>
              <select
                value={classId}
                onChange={(e) => setClassId_103022400061(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800"
              >
                {classList.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.title} ({cls.level})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instruksi</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions_103022400061(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm transition"
            >
              Simpan Tugas
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white p-5 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Daftar Tugas Aktif</h2>
          {assignments.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada tugas yang terdaftar.</p>
          ) : (
            <div className="space-y-3">
              {assignments.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 rounded-lg flex justify-between items-start hover:bg-gray-50"
                >
                  <div>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      ID Kelas: {item.classId}
                    </span>
                    <h3 className="font-bold text-gray-800 mt-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.instructions}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAssignment_103022400061(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Pengumpulan Siswa</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-600 bg-gray-50">
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Jawaban</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Nilai</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    Belum ada data pengumpulan tugas dari siswa.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 text-gray-800">
                    <td className="py-3 px-4 font-medium">{sub.studentName}</td>
                    <td className="py-3 px-4">{sub.className}</td>
                    <td className="py-3 px-4 max-w-xs truncate">{sub.answerText}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          sub.status === "Sudah Dinilai"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">
                      {sub.score !== null && sub.score !== undefined ? sub.score : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleSelectSubmission_103022400061(sub)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Beri Nilai
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedSubId && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Form Penilaian</h3>
            <form onSubmit={handleSaveGrade_103022400061} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nilai (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inputScore}
                  onChange={(e) => setInputScore_103022400061(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Umpan Balik</label>
                <input
                  type="text"
                  value={inputFeedback}
                  onChange={(e) => setInputFeedback_103022400061(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800"
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded text-sm"
                >
                  Simpan Nilai
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubId_103022400061(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded text-sm"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}