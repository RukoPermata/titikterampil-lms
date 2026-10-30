"use client";

import React, { useState } from "react";
import { classes } from "@/src/data/mock";
import {
  loadAssignments_103022400061,
  loadSubmissions_103022400061,
  calculateStudentResults_103022400061,
  filterResultsByClass_103022400061,
  calculateClassAverage_103022400061
} from "@/src/features/evaluation/actions";

export default function TeacherResultsPage_103022400061() {
  const [selectedClass, setSelectedClass_103022400061] = useState("SEMUA");
  const [classList] = useState(classes);

  const assignments = loadAssignments_103022400061();
  const submissions = loadSubmissions_103022400061();

  const studentResults = calculateStudentResults_103022400061(submissions, assignments);
  const filteredResults = filterResultsByClass_103022400061(studentResults, selectedClass);
  const classAverage = calculateClassAverage_103022400061(filteredResults);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Monitoring Hasil Belajar Siswa</h1>
          <p className="text-gray-600">Pantau rekapitulasi nilai siswa berdasarkan data dari sistem.</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Filter Kelas</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass_103022400061(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-800 shadow-sm"
          >
            <option value="SEMUA">Semua Kelas</option>
            {classList.map((cls) => (
              <option key={cls.id} value={cls.title}>
                {cls.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Total Siswa Dipantau</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{filteredResults.length} Siswa</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Rata-Rata Nilai Kelas</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{classAverage}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Total Tugas Terdaftar</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{assignments.length} Tugas</p>
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
                <th className="py-3 px-4">Rata-Rata Nilai</th>
                <th className="py-3 px-4">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
              {filteredResults.map((student) => {
                const isGood = student.averageScore >= 80;
                const hasSubmission = student.completedAssignments > 0;
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{student.studentName}</td>
                    <td className="py-3 px-4">{student.level}</td>
                    <td className="py-3 px-4">{student.className}</td>
                    <td className="py-3 px-4">
                      {student.completedAssignments} / {student.totalAssignments}
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-600">
                      {hasSubmission ? student.averageScore : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          !hasSubmission
                            ? "bg-gray-100 text-gray-600"
                            : isGood
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {!hasSubmission ? "Belum Ada Nilai" : isGood ? "Sangat Baik" : "Perlu Bimbingan"}
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