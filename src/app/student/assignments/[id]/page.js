/**
 * Modul: P12 — Tugas siswa
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Implementasikan jawaban teks, tenggat, validasi dan status pengumpulan.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan tugas siswa (P12).
 * Alur pengembangan: Petunjuk tugas, pengumpulan jawaban dan tampilan nilai.
 * @param {Object} props - Properti route Next.js.
 * @param {Promise<{id: string}>} props.params - ID data pada URL.
 * @returns {Promise<React.ReactElement>} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default async function AssignmentPage({ params }) {
  // 1. TODO: Baca ID tugas, instruksi, tenggat dan pengumpulan sebelumnya.

  // 2. TODO: Siapkan state jawaban pada komponen client.

  // 3. TODO: Validasi jawaban dan kirim melalui submitAssignment.

  // 4. TODO: Tampilkan status pengumpulan dan nilai yang diberikan Hilmy.

  // Parameter sudah dibaca agar route dinamis tetap dapat dijalankan.
  const { id } = await params;
  const viewProps = { pageId: 'P12', recordId: id };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
