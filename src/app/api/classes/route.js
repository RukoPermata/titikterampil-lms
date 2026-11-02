/** Modul: Endpoint daftar kelas contoh dari sumber data demo bersama. */
import { listResource } from '@/src/lib/mock-api/handlers';

/**
 * Membaca daftar kelas contoh beserta filter URL.
 * @param {Request} request - Permintaan GET.
 * @returns {Promise<Response>} Respons JSON daftar data.
 */
export async function GET(request) {
  return listResource('classes', request);
}
