"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSubmissions_103022400061 } from "@/src/features/questions/actions";

export default function GradingListPage_103022400061() {
  const [submissions, setSubmissions_103022400061] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setSubmissions_103022400061(getSubmissions_103022400061());
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#087F76]">Daftar Penilaian Esai</h1>
        <p className="text-gray-600 mt-1">Tabel pengumpulan esai peserta yang perlu dinilai dan yang sudah selesai.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EAF8F5] text-[#087F76] text-sm">
              <th className="py-4 px-6 font-semibold">Nama Peserta</th>
              <th className="py-4 px-6 font-semibold">Paket / Tugas</th>
              <th className="py-4 px-6 font-semibold">Tanggal Submit</th>
              <th className="py-4 px-6 font-semibold">Nilai</th>
              <th className="py-4 px-6 font-semibold">Status Penilaian</th>
              <th className="py-4 px-6 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  Belum ada pengumpulan esai dari peserta.
                </td>
              </tr>
            ) : (
              submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-800">{sub.studentName}</td>
                  <td className="py-4 px-6 text-gray-600">{sub.assignmentTitle || sub.tryoutTitle || "-"}</td>
                  <td className="py-4 px-6 text-gray-600">{sub.submittedAt || "-"}</td>
                  <td className="py-4 px-6 font-bold text-[#087F76]">
                    {sub.score !== null && sub.score !== undefined ? sub.score : "-"}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sub.status === "Selesai"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {sub.status || "Menunggu Koreksi"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => router.push(`/teacher/grading/${sub.id}`)}
                      className="bg-[#25B5A9] hover:bg-[#087F76] text-white px-4 py-2 rounded text-xs font-medium transition-colors"
                    >
                      Koreksi Esai
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}