/** Modul: Endpoint ringkasan statistik admin. */
import { adminSummary } from '@/src/lib/mock-api/overview';

/**
 * Mengambil ringkasan statistik admin.
 * @param {Request} request - Permintaan GET.
 * @returns {Promise<Response>} Respons JSON hasil pembacaan data.
 */
export async function GET(request) {
  return adminSummary(request);
}
