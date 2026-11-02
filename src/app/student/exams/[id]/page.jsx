/**
 * Modul: Ruang ujian CBT (P07)
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menyiapkan route ruang ujian dengan timer dan autosave.
 */
import { ExamRoom } from '@/src/features/cbt/components/ExamRoom';

/**
 * Menampilkan ruang ujian untuk paket pada URL.
 * @param {Object} props - Properti route Next.js.
 * @param {Promise<{id: string}>} props.params - ID paket pada URL.
 * @returns {Promise<React.ReactElement>} Ruang ujian CBT.
 */
export default async function ExamPage({ params }) {
  const { id } = await params;
  return <ExamRoom tryoutId={id} />;
}
