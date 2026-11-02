/**
 * Modul: Riwayat tryout (P09)
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menampilkan daftar percobaan CBT siswa.
 */
import { AttemptHistory } from '@/src/features/cbt/components/AttemptHistory';

/**
 * Menampilkan riwayat attempt milik siswa aktif.
 * @returns {React.ReactElement} Halaman riwayat tryout.
 */
export default function HistoryPage() {
  return <AttemptHistory />;
}
