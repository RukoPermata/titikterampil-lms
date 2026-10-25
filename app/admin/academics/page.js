/**
 * Modul: P20 — Struktur akademik
 * @author Rayazka Aris (103022400096)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Buat CRUD mata pelajaran dan validasi relasi kelas 1–12 dengan jenjang.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan struktur akademik (P20).
 * Alur pengembangan: Jenjang, tingkat kelas dan mata pelajaran.
 * @returns {React.ReactElement} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default function AcademicsPage() {
  // 1. TODO: Baca konfigurasi SD 1–6, SMP 7–9 dan SMA 10–12.

  // 2. TODO: Siapkan form jenjang, kelas dan mata pelajaran.

  // 3. TODO: Validasi relasi melalui saveAcademicStructure.

  // 4. TODO: Periksa penggunaan data sebelum menghapus konfigurasi akademik.

  // Kontrak tampilan awal; ganti dengan data modul setelah langkah di atas selesai.
  const viewProps = { pageId: 'P20' };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
