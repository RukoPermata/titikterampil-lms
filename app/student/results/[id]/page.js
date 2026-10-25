/**
 * Modul: P08 — Hasil dan pembahasan
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Tampilkan hasil percobaan yang sesuai ID serta pembahasan setiap soal.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan hasil dan pembahasan (P08).
 * Alur pengembangan: Nilai dan evaluasi jawaban siswa.
 * @param {Object} props - Properti route Next.js.
 * @param {Promise<{id: string}>} props.params - ID data pada URL.
 * @returns {Promise<React.ReactElement>} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default async function ResultPage({ params }) {
  // 1. TODO: Baca ID hasil; pada kerangka saat ini ID masih menggunakan paket contoh.

  // 2. TODO: Ambil hasil percobaan selesai melalui getAttemptReview.

  // 3. TODO: Siapkan ringkasan nilai dan pembahasan tiap jawaban.

  // 4. TODO: Tampilkan kondisi tidak ditemukan bila percobaan belum selesai.

  // Parameter sudah dibaca agar route dinamis tetap dapat dijalankan.
  const { id } = await params;
  const viewProps = { pageId: 'P08', recordId: id };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
