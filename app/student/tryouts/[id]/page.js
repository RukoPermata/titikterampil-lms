/**
 * Modul: P06 — Detail tryout
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Validasi akses paket dan tampilkan konfirmasi sebelum mulai ujian.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan detail tryout (P06).
 * Alur pengembangan: Petunjuk, durasi dan aturan pengerjaan tryout.
 * @param {Object} props - Properti route Next.js.
 * @param {Promise<{id: string}>} props.params - ID data pada URL.
 * @returns {Promise<React.ReactElement>} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default async function TryoutDetailPage({ params }) {
  // 1. TODO: Baca ID paket dari parameter route.

  // 2. TODO: Cari paket dan tangani ID yang tidak ditemukan.

  // 3. TODO: Periksa kesesuaian jenjang, jadwal dan aturan percobaan.

  // 4. TODO: Tampilkan instruksi serta konfirmasi sebelum startAttempt.

  // Parameter sudah dibaca agar route dinamis tetap dapat dijalankan.
  const { id } = await params;
  const viewProps = { pageId: 'P06', recordId: id };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
