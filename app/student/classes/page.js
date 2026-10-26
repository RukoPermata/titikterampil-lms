/**
 * Modul: P10 — Kelas belajar
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 */
import { ClassCatalog } from '@/src/features/learning/components/ClassCatalog';

/**
 * Menampilkan kelas belajar (P10).
 * @returns {React.ReactElement} Tampilan halaman katalog kelas belajar siswa.
 * @remarks Interaksi state/filter/pencarian ditempatkan pada komponen client di folder fitur.
 */
export default function ClassCatalogPage() {
  return <ClassCatalog />;
}
