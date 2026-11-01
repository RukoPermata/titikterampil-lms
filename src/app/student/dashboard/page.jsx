/**
 * Modul: P04: Dashboard siswa
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 */
import { StudentDashboard } from '@/src/features/student/components/StudentDashboard';

/**
 * Menampilkan dashboard siswa (P04).
 * Menyajikan ringkasan kegiatan belajar, tryout CBT terjadwal, dan kelas aktif siswa.
 * @returns {React.ReactElement} Tampilan dashboard siswa aktif.
 */
export default function StudentDashboardPage() {
  return <StudentDashboard />;
}
