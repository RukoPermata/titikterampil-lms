/** Modul: Endpoint daftar transaksi simulasi dari sumber data demo bersama. */
import { listResource, postResource } from '@/src/lib/mock-api/handlers';

/**
 * Membaca daftar transaksi simulasi beserta filter URL.
 * @param {Request} request - Permintaan GET.
 * @returns {Promise<Response>} Respons JSON daftar data.
 */
export async function GET(request) {
  return listResource('transactions', request);
}

/**
 * Menambahkan transaksi simulasi untuk simulasi frontend.
 * @param {Request} request - Permintaan POST berisi JSON.
 * @returns {Promise<Response>} Record baru atau kesalahan validasi.
 */
export async function POST(request) {
  return postResource('transactions', request);
}
