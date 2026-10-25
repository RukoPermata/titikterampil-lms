/**
 * Modul: P15 — Kelola materi
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Buat form tambah, edit dan hapus materi sesuai kelas pengajar.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan kelola materi (P15).
 * Alur pengembangan: Pengelolaan konten belajar oleh pengajar.
 * @returns {React.ReactElement} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default function MaterialsPage() {
  // 1. TODO: Baca kelas yang ditugaskan kepada pengajar.

  // 2. TODO: Siapkan daftar materi dan form tambah atau edit.

  // 3. TODO: Validasi materi melalui saveMaterial sebelum menyimpan.

  // 4. TODO: Tambahkan konfirmasi hapus dan perbarui daftar setelah berhasil.

  // Kontrak tampilan awal; ganti dengan data modul setelah langkah di atas selesai.
  const viewProps = { pageId: 'P15' };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
