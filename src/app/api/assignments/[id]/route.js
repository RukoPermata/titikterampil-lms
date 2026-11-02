/** Modul: Detail tugas contoh berdasarkan ID yang tersedia. */
import { detailResource } from '@/src/lib/mock-api/handlers';

/**
 * Membaca satu record.
 * @param {Request} request - Permintaan GET.
 * @param {Object} context - Konteks route berisi Promise params.
 * @returns {Promise<Response>} Respons JSON hasil operasi.
 */
export async function GET(request, context) {
  return detailResource('assignments', request, context);
}
