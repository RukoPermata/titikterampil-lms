/**
 * Modul: P11 — Materi kelas
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Buat pembaca teks, dokumen dan tautan video eksternal.
 */
import { ModulePage } from '@/src/components/ModulePage';

/**
 * Menampilkan materi kelas (P11).
 * Alur pengembangan: Modul dan materi belajar dalam satu kelas.
 * @param {Object} props - Properti route Next.js.
 * @param {Promise<{id: string}>} props.params - ID data pada URL.
 * @returns {Promise<React.ReactElement>} Tampilan halaman atau pratinjau modul.
 * @remarks Interaksi state/form/timer ditempatkan pada komponen client di folder fitur.
 */
export default async function ClassDetailPage({ params }) {
  // 1. TODO: Baca ID kelas dan periksa keanggotaan siswa.

  // 2. TODO: Ambil materi melalui getClassMaterials.

  // 3. TODO: Pisahkan tampilan materi teks, dokumen dan video eksternal.

  // 4. TODO: Hubungkan materi dan tugas yang memiliki classId sama.

  // Parameter sudah dibaca agar route dinamis tetap dapat dijalankan.
  const { id } = await params;
  const viewProps = { pageId: 'P11', recordId: id };
  // Pratinjau tetap aktif selama implementasi halaman belum selesai.
  return <ModulePage {...viewProps} />;
}
