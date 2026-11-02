/** Modul: Endpoint daftar tugas contoh dari sumber data demo bersama. */
import { listResource } from '@/src/lib/mock-api/handlers';

/**
 * Membaca daftar tugas contoh beserta filter URL.
 * @param {Request} request - Permintaan GET.
 * @returns {Promise<Response>} Respons JSON daftar data.
 */
export async function GET(request) {
  return listResource('assignments', request);
}
