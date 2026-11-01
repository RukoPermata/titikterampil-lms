/** Modul: Detail voucher berdasarkan ID yang tersedia. */
import { detailResource, patchResource, removeResource } from '@/src/lib/mock-api/handlers';

/**
 * Membaca satu record.
 * @param {Request} request - Permintaan GET.
 * @param {Object} context - Konteks route berisi Promise params.
 * @returns {Promise<Response>} Respons JSON hasil operasi.
 */
export async function GET(request, context) {
  return detailResource('vouchers', request, context);
}

/**
 * Memperbarui sebagian field record.
 * @param {Request} request - Permintaan PATCH.
 * @param {Object} context - Konteks route berisi Promise params.
 * @returns {Promise<Response>} Respons JSON hasil operasi.
 */
export async function PATCH(request, context) {
  return patchResource('vouchers', request, context);
}

/**
 * Menghapus record yang tidak lagi dirujuk.
 * @param {Request} request - Permintaan DELETE.
 * @param {Object} context - Konteks route berisi Promise params.
 * @returns {Promise<Response>} Respons JSON hasil operasi.
 */
export async function DELETE(request, context) {
  return removeResource('vouchers', request, context);
}
