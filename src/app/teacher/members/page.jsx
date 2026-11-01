"use client";

import React, { useEffect, useState } from "react";
import { getStudentsForMembership_103022400061, toggleMembership_103022400061 } from "@/src/features/questions/actions";

export default function MembersManagementPage_103022400061() {
  const [students, setStudents_103022400061] = useState(() => getStudentsForMembership_103022400061());
  const [search, setSearch_103022400061] = useState("");
  function handleToggleMember_103022400061(id) {
    const updated = toggleMembership_103022400061(id);
    setStudents_103022400061(updated);
  }

  const filteredStudents = students.filter(
    (st) =>
      st.name.toLowerCase().includes(search.toLowerCase()) ||
      st.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#087F76]">Daftar Siswa & Status Member</h1>
          <p className="text-gray-600 mt-1">Pencarian akun peserta dan aktivasi atau pencabutan status Member.</p>
        </div>
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Cari nama atau email siswa..."
            value={search}
            onChange={(e) => setSearch_103022400061(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#25B5A9]"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EAF8F5] text-[#087F76] text-sm">
              <th className="py-4 px-6 font-semibold">Nama Peserta</th>
              <th className="py-4 px-6 font-semibold">Kontak</th>
              <th className="py-4 px-6 font-semibold">Jenjang & Kelas</th>
              <th className="py-4 px-6 font-semibold">Status Member</th>
              <th className="py-4 px-6 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  Tidak ada data peserta yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-800">{st.name}</td>
                  <td className="py-4 px-6">
                    <div className="text-gray-800">{st.email}</div>
                    <div className="text-gray-500 text-xs mt-0.5">WA: {st.whatsapp || "-"}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {st.level} &middot; Kelas {st.grade}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        st.isMember ? "bg-[#25B5A9] text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {st.isMember ? "Member Aktif" : "Non-Member"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleToggleMember_103022400061(st.id)}
                      className={`px-4 py-2 rounded text-xs font-bold transition-colors ${
                        st.isMember
                          ? "border border-red-500 text-red-600 hover:bg-red-50"
                          : "bg-[#087F76] text-white hover:bg-[#25B5A9]"
                      }`}
                    >
                      {st.isMember ? "Cabut Status Member" : "Aktifkan Member"}
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