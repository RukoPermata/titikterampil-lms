/**
 * Modul: P22 — Bank soal
 * @author Farrel Irham Adzkaar Susanto (103022400105)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Buat CRUD soal, opsi jawaban, kunci, bobot dan pembahasan.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan bank soal (P22).
 * Alur pengembangan: Penyusunan soal pilihan ganda beserta pembahasannya.
 * @returns {React.ReactElement} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default function QuestionsPage() {
  // 1. TODO: Siapkan pencarian soal berdasarkan jenjang dan mata pelajaran.

  // 2. TODO: Siapkan form soal, opsi, kunci, bobot dan pembahasan.

  // 3. TODO: Validasi input melalui saveQuestion.

  // 4. TODO: Periksa referensi paket sebelum menghapus soal.

  // Kontrak tampilan awal; ganti dengan data modul setelah langkah di atas selesai.
  const viewProps = { pageId: 'P22' };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
