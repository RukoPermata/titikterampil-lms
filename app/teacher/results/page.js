"use client";

import React, { useState } from "react";
import {
  initialStudentResults_103022400061,
  filterResultsByClass_103022400061
} from "../../../src/features/evaluation/actions";

export default function TeacherResultsPage_103022400061() {
  const [selectedClass, setSelectedClass] = useState("SEMUA");
  const filteredResults = filterResultsByClass_103022400061(
    initialStudentResults_103022400061,
    selectedClass
  );

  function calculateClassAverage_103022400061(dataList) {
    if (dataList.length === 0) return 0;
    const total = dataList.reduce((acc, item) => acc + item.averageAssignmentScore, 0);
    return Math.round(total / dataList.length);
  }

  const classAverage = calculateClassAverage_103022400061(filteredResults);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Monitoring Hasil Belajar Siswa</h1>
          <p className="text-gray-600">Pantau ketuntasan tugas dan rata-rata nilai evaluasi siswa per kelas.</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Filter Kelas Pengajar</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-800 shadow-sm"
          >
            <option value="SEMUA">Semua Kelas</option>
            <option value="10 SMA - Matematika">10 SMA - Matematika</option>
            <option value="8 SMP - IPA Fisika">8 SMP - IPA Fisika</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Total Siswa Dipantau</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{filteredResults.length} Siswa</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Rata-Rata Nilai Tugas</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{classAverage}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Status Kelas</p>
          <p className="text-2xl font-bold text-green-600 mt-1">Aktif</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Tabel Rekapitulasi Siswa</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-600 bg-gray-50">
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Jenjang</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Tugas Selesai</th>
                <th className="py-3 px-4">Rata-Rata Tugas</th>
                <th className="py-3 px-4">Rata-Rata Tryout</th>
                <th className="py-3 px-4">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
              {filteredResults.map((student) => {
                const isGood = student.averageAssignmentScore >= 80;
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{student.studentName}</td>
                    <td className="py-3 px-4">{student.level}</td>
                    <td className="py-3 px-4">{student.className}</td>
                    <td className="py-3 px-4">
                      {student.completedAssignments} / {student.totalAssignments}
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-600">
                      {student.averageAssignmentScore}
                    </td>
                    <td className="py-3 px-4 font-bold text-purple-600">
                      {student.averageTryoutScore}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isGood ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {isGood ? "Sangat Baik" : "Perlu Bimbingan"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}