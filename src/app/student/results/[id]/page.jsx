/**
 * Modul: Hasil dan pembahasan (P08)
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menampilkan hasil attempt beserta pembahasan setiap soal.
 */
import { ResultReview } from '@/src/features/cbt/components/ResultReview';

/**
 * Menampilkan hasil percobaan berdasarkan attemptId pada URL.
 * @param {Object} props - Properti route Next.js.
 * @param {Promise<{id: string}>} props.params - ID attempt pada URL.
 * @returns {Promise<React.ReactElement>} Halaman hasil dan pembahasan.
 */
export default async function ResultPage({ params }) {
  const { id } = await params;
  return <ResultReview attemptId={id} />;
}
