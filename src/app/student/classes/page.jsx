"use client"
/**
 * Modul: P10 — Kelas belajar
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Filter kelas sesuai siswa aktif dan tampilkan status keanggotaan.
 */
import { ModulePage } from '@/src/components/ModulePage';
import {useEffect, useState} from 'react';

/**
 * Menampilkan kelas belajar (P10).
 * Alur pengembangan: Ruang belajar berdasarkan jenjang dan mata pelajaran.
 * @returns {React.ReactElement} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default function ClassCatalogPage() {
  // 1. Baca jenjang dan tingkat kelas siswa aktif.
  
  /**
   * struktur data email
   * @type { {email: string, grade: number, id: string, level: string, name: string, role: string} }
   */
  const [currentSession, setCurrentSession] = useState({})

  // 2. TODO: Ambil kelas yang diikuti siswa dari data bersama
  
  useEffect(() => {
    async function render() {
      setCurrentSession(JSON.parse(sessionStorage.getItem("titikterampil_active_session")))
    }
    render()
  }, [])

  // 3. TODO: Siapkan pencarian dan kondisi belum memiliki kelas.

  // 4. TODO: Render kartu kelas beserta tautan detail.

  // Kontrak tampilan awal; ganti dengan data modul setelah langkah di atas selesai.
  const viewProps = { pageId: 'P10', session: currentSession };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
