/**
 * Modul: P05 — Katalog tryout
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Tambahkan filter jenjang, tingkat kelas, mata pelajaran dan pencarian.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan katalog tryout (P05).
 * Alur pengembangan: Temukan latihan sesuai jenjang dan kelas.
 * @returns {React.ReactElement} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default function TryoutCatalogPage() {
  // 1. TODO: Siapkan state pencarian, jenjang, kelas dan mata pelajaran.

  // 2. TODO: Ambil paket contoh dari kontrak data bersama.

  // 3. TODO: Terapkan filterTryouts dan tangani hasil pencarian kosong.

  // 4. TODO: Render kartu paket dengan tautan ke detail yang sesuai.

  // Kontrak tampilan awal; ganti dengan data modul setelah langkah di atas selesai.
  const viewProps = { pageId: 'P05' };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
