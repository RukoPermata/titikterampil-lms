/**
 * Modul: P14: Dashboard pengajar
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 */
import { TeacherDashboard } from '@/src/features/auth/components/TeacherDashboard';

/**
 * Menampilkan dashboard pengajar (P14).
 * Menyajikan ringkasan kelas binaan, tugas siswa, dan statistik pengajaran aktif.
 * @returns {React.ReactElement} Tampilan dashboard pengajar aktif.
 */
export default function TeacherDashboardPage() {
  return <TeacherDashboard />;
}
