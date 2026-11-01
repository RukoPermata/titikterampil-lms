"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { classes, assignments } from "@/src/data/mock";
import { getTeacherStats_103022400061 } from "@/src/features/questions/actions";

export default function TeacherDashboardPage_103022400061() {
  const [stats, setStats_103022400061] = useState({
    essaysWaiting: 0,
    totalQuestions: 0,
    totalClasses: 0,
    totalAssignments: 0
  });

  useEffect(() => {
    setStats_103022400061(getTeacherStats_103022400061());
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#087F76]">Dashboard Pengajar</h1>
        <p className="text-gray-600 mt-1">Ringkasan penugasan esai, soal diampu, dan kelas binaan aktif.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Esai Menunggu Koreksi</p>
          <p className="text-3xl font-bold text-[#25B5A9] mt-2">{stats.essaysWaiting}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Soal Diampu</p>
          <p className="text-3xl font-bold text-[#087F76] mt-2">{stats.totalQuestions}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Kelas Binaan</p>
          <p className="text-3xl font-bold text-[#25B5A9] mt-2">{stats.totalClasses}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Penugasan Aktif</p>
          <p className="text-3xl font-bold text-[#087F76] mt-2">{stats.totalAssignments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/teacher/grading"
          className="block bg-[#EAF8F5] p-5 rounded-xl border border-[#25B5A9] hover:bg-[#25B5A9] hover:text-white transition-colors group"
        >
          <h3 className="text-lg font-bold text-[#087F76] group-hover:text-white">Daftar Penilaian Esai</h3>
          <p className="text-sm text-gray-600 group-hover:text-white mt-1">
            Periksa dan koreksi jawaban esai peserta.
          </p>
        </Link>
        <Link
          href="/teacher/members"
          className="block bg-[#EAF8F5] p-5 rounded-xl border border-[#25B5A9] hover:bg-[#25B5A9] hover:text-white transition-colors group"
        >
          <h3 className="text-lg font-bold text-[#087F76] group-hover:text-white">Pemberian Status Member</h3>
          <p className="text-sm text-gray-600 group-hover:text-white mt-1">
            Kelola aktivasi dan pencabutan akses Member siswa.
          </p>
        </Link>
        <Link
          href="/admin/questions"
          className="block bg-[#EAF8F5] p-5 rounded-xl border border-[#25B5A9] hover:bg-[#25B5A9] hover:text-white transition-colors group"
        >
          <h3 className="text-lg font-bold text-[#087F76] group-hover:text-white">Bank Soal</h3>
          <p className="text-sm text-gray-600 group-hover:text-white mt-1">
            Akses koleksi soal dan manajemen paket latihan.
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-[#087F76] mb-3">Daftar Kelas Binaan</h2>
          <div className="space-y-3">
            {classes.map((cls) => (
              <div key={cls.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{cls.title}</p>
                  <p className="text-xs text-gray-500">Jenjang {cls.level} - Kelas {cls.grade}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#EAF8F5] text-[#087F76]">
                  {cls.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-[#087F76] mb-3">Penugasan Esai Terdaftar</h2>
          <div className="space-y-3">
            {assignments.map((asg) => (
              <div key={asg.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="font-semibold text-gray-800">{asg.title}</p>
                <p className="text-xs text-gray-600 mt-1">{asg.instructions}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}