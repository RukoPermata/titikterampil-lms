/** Modul: Endpoint pilihan jenjang dan kelas. */
import { academicList } from '@/src/lib/mock-api/overview';

/**
 * Mengambil pilihan jenjang dan kelas.
 * @param {Request} request - Permintaan GET.
 * @returns {Promise<Response>} Respons JSON hasil pembacaan data.
 */
export async function GET(request) {
  return academicList(request);
}
