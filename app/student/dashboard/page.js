/**
 * Modul: P04 — Dashboard siswa
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Tampilkan kelas terdaftar, jadwal ujian dan ringkasan nilai siswa aktif.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan dashboard siswa (P04).
 * Alur pengembangan: Ringkasan kegiatan belajar dan tryout siswa.
 * @returns {React.ReactElement} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default function StudentDashboardPage() {
  // 1. TODO: Baca identitas siswa aktif dari sesi demo.

  // 2. TODO: Ambil kelas, jadwal tryout dan ringkasan hasil siswa.

  // 3. TODO: Siapkan kondisi loading, data kosong dan kesalahan.

  // 4. TODO: Susun kartu ringkasan dan tautan kegiatan berikutnya.

  // Kontrak tampilan awal; ganti dengan data modul setelah langkah di atas selesai.
  const viewProps = { pageId: 'P04' };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
