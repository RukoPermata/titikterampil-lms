/**
 * Modul: P14 — Dashboard pengajar
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Hitung ringkasan dari kelas yang ditugaskan kepada pengajar aktif.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan dashboard pengajar (P14).
 * Alur pengembangan: Ringkasan kelas dan aktivitas pengajaran.
 * @returns {React.ReactElement} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default function TeacherDashboardPage() {
  // 1. TODO: Baca ID pengajar dari sesi aktif.

  // 2. TODO: Panggil getTeacherSummary dengan data monitoring dari Hilmy.

  // 3. TODO: Siapkan ringkasan kelas, tugas dan pengumpulan belum dinilai.

  // 4. TODO: Sediakan tautan menuju materi, tugas dan monitoring.

  // Kontrak tampilan awal; ganti dengan data modul setelah langkah di atas selesai.
  const viewProps = { pageId: 'P14' };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
