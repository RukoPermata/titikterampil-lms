/** Modul: Endpoint daftar pengguna dari sumber data demo bersama. */
import { listResource, postResource } from '@/src/lib/mock-api/handlers';

/**
 * Membaca daftar pengguna beserta filter URL.
 * @param {Request} request - Permintaan GET.
 * @returns {Promise<Response>} Respons JSON daftar data.
 */
export async function GET(request) {
  return listResource('users', request);
}

/**
 * Menambahkan pengguna untuk simulasi frontend.
 * @param {Request} request - Permintaan POST berisi JSON.
 * @returns {Promise<Response>} Record baru atau kesalahan validasi.
 */
export async function POST(request) {
  return postResource('users', request);
}
