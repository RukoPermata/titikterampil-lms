/** Modul: Endpoint daftar penilaian esai dari sumber data demo bersama. */
import { listResource } from '@/src/lib/mock-api/handlers';

/**
 * Membaca daftar penilaian esai beserta filter URL.
 * @param {Request} request - Permintaan GET.
 * @returns {Promise<Response>} Respons JSON daftar data.
 */
export async function GET(request) {
  return listResource('grading', request);
}
