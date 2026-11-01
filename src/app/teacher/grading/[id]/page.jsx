"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSubmissionById_103022400061, saveEssayGrade_103022400061 } from "@/src/features/questions/actions";

export default function GradingDetailPage_103022400061() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [submission] = useState(() => (id ? getSubmissionById_103022400061(id) : null));
  const [score, setScore_103022400061] = useState(() => {
    const data = id ? getSubmissionById_103022400061(id) : null;
    return data && data.score !== null && data.score !== undefined ? data.score : "";
  });
  const [feedback, setFeedback_103022400061] = useState(() => {
    const data = id ? getSubmissionById_103022400061(id) : null;
    return data?.feedback || "";
  });

  function handleSubmit_103022400061(e) {
    e.preventDefault();
    if (score === "") return;
    saveEssayGrade_103022400061(id, score, feedback);
    router.push("/teacher/grading");
  }

  if (!submission) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-[#087F76]">Form Penilaian Esai Peserta</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-gray-600 text-sm">
          Data pengumpulan dengan ID tersebut tidak ditemukan atau belum tersedia.
        </div>
        <button
          onClick={() => router.push("/teacher/grading")}
          className="bg-[#087F76] text-white px-4 py-2 rounded text-sm font-medium"
        >
          Kembali ke Daftar Penilaian
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#087F76]">Form Penilaian Esai Peserta</h1>
          <p className="text-gray-600 mt-1">
            {submission.studentName} &middot; {submission.assignmentTitle || "Penugasan Esai"}
          </p>
        </div>
        <button
          onClick={() => router.push("/teacher/grading")}
          className="text-sm font-medium text-[#087F76] hover:underline"
        >
          Kembali ke Daftar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Jawaban Esai Peserta</h2>
          <div className="bg-gray-50 p-4 rounded text-gray-700 text-sm leading-relaxed whitespace-pre-wrap min-h-[180px]">
            {submission.answerText || "Tidak ada teks jawaban."}
          </div>
          <div className="pt-4 border-t">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Rubrik Penilaian:</h3>
            <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
              <li>Ketepatan konsep dan logika penyelesaian (40%)</li>
              <li>Kejelasan langkah pengerjaan (40%)</li>
              <li>Kerapihan dan struktur penjelasan (20%)</li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#25B5A9] border-t-4">
          <h2 className="text-lg font-bold text-[#087F76] mb-4">Form Input Nilai & Evaluasi</h2>
          <form onSubmit={handleSubmit_103022400061} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nilai Angka (0 - 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore_103022400061(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-[#25B5A9] focus:outline-none"
                placeholder="Masukkan nilai..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Catatan Evaluasi Pengajar</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback_103022400061(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-[#25B5A9] focus:outline-none h-32"
                placeholder="Tuliskan umpan balik untuk peserta..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-[#25B5A9] hover:bg-[#087F76] text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Simpan Nilai Final
              </button>
              <button
                type="button"
                onClick={() => router.push("/teacher/grading")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}