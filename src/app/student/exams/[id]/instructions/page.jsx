/**
 * Modul: Petunjuk ujian CBT
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menyediakan gerbang konfirmasi sebelum attempt dimulai.
 */
import { ExamInstructions } from '@/src/features/cbt/components/ExamInstructions';

/**
 * Menampilkan petunjuk ujian untuk paket pada URL.
 * @param {Object} props - Properti route Next.js.
 * @param {Promise<{id: string}>} props.params - ID paket pada URL.
 * @returns {Promise<React.ReactElement>} Halaman petunjuk ujian.
 */
export default async function ExamInstructionsPage({ params }) {
  const { id } = await params;
  return <ExamInstructions tryoutId={id} />;
}
