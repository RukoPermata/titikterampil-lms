/**
 * Modul: P07 — Ruang ujian
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Implementasikan timer berbasis deadline, autosave, penandaan dan submit idempoten.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan ruang ujian (P07).
 * Alur pengembangan: Kerangka CBT dengan navigasi soal dan pilihan jawaban.
 * @param {Object} props - Properti route Next.js.
 * @param {Promise<{id: string}>} props.params - ID data pada URL.
 * @returns {Promise<React.ReactElement>} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default async function ExamPage({ params }) {
  // 1. TODO: Baca ID paket dan pulihkan percobaan aktif bila tersedia.

  // 2. TODO: Hitung sisa waktu dari deadline, bukan hitungan interval yang direset.

  // 3. TODO: Hubungkan pilihan jawaban, navigasi, penandaan dan autosave.

  // 4. TODO: Panggil submitAttempt sekali saat konfirmasi atau waktu habis.

  // 5. TODO: Bersihkan interval pada unmount dan arahkan ke hasil yang sesuai.

  // Parameter sudah dibaca agar route dinamis tetap dapat dijalankan.
  const { id } = await params;
  const viewProps = { pageId: 'P07', recordId: id };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
