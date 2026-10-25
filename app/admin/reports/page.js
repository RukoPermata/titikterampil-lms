/**
 * Modul: P24 — Laporan dan rekap
 * @author Farrel Irham Adzkaar Susanto (103022400105)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Buat filter jenjang, kelas, paket dan rentang tanggal; ekspor di luar MVP.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan laporan dan rekap (P24).
 * Alur pengembangan: Rekap hasil tryout dan aktivitas pembelajaran.
 * @returns {React.ReactElement} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default function ReportsPage() {
  // 1. TODO: Baca hasil percobaan selesai dari modul Fauzan.

  // 2. TODO: Siapkan filter jenjang, kelas, paket dan tanggal.

  // 3. TODO: Agregasikan data melalui buildReport.

  // 4. TODO: Tampilkan rekap serta kondisi kosong; ekspor belum termasuk MVP.

  // Kontrak tampilan awal; ganti dengan data modul setelah langkah di atas selesai.
  const viewProps = { pageId: 'P24' };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
