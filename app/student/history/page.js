/**
 * Modul: P09 — Riwayat tryout
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Hubungkan hasil submit CBT dan tambahkan filter riwayat.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan riwayat tryout (P09).
 * Alur pengembangan: Daftar percobaan ujian yang telah diselesaikan.
 * @returns {React.ReactElement} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default function HistoryPage() {
  // 1. TODO: Baca ID siswa dari sesi aktif.

  // 2. TODO: Ambil percobaan selesai melalui getStudentHistory.

  // 3. TODO: Urutkan riwayat terbaru dan siapkan filter paket.

  // 4. TODO: Tampilkan riwayat atau kondisi belum pernah mengikuti tryout.

  // Kontrak tampilan awal; ganti dengan data modul setelah langkah di atas selesai.
  const viewProps = { pageId: 'P09' };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
