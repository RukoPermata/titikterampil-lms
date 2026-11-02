/** Modul: Endpoint leaderboard contoh per jenjang. */
import { leaderboardList } from '@/src/lib/mock-api/overview';

/**
 * Mengambil leaderboard contoh per jenjang.
 * @param {Request} request - Permintaan GET.
 * @returns {Promise<Response>} Respons JSON hasil pembacaan data.
 */
export async function GET(request) {
  return leaderboardList(request);
}
