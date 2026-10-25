/**
 * Modul: P16 — Tugas dan penilaian
 * @author Hilmy Rafi (103022400061)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Buat CRUD tugas dan form penilaian dengan batas nilai yang valid.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan tugas dan penilaian (P16).
 * Alur pengembangan: Pembuatan tugas dan penilaian pengumpulan siswa.
 * @returns {React.ReactElement} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default function TeacherAssignmentsPage() {
  // 1. TODO: Baca kelas pengajar dan daftar tugasnya.

  // 2. TODO: Siapkan form CRUD tugas melalui saveAssignment.

  // 3. TODO: Tampilkan pengumpulan siswa dari modul Fityah.

  // 4. TODO: Hubungkan form nilai dan umpan balik ke gradeSubmission.

  // Kontrak tampilan awal; ganti dengan data modul setelah langkah di atas selesai.
  const viewProps = { pageId: 'P16' };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
