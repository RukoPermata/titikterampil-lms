/** Modul: Kesalahan terkontrol untuk endpoint data demo. */

export class MockApiError extends Error {
  /**
   * Membuat kesalahan yang dapat dikirim sebagai respons HTTP.
   * @param {number} status - Kode HTTP.
   * @param {string} message - Pesan untuk pemanggil API.
   * @param {Object} options - Penyebab internal opsional, tidak dikirim ke klien.
   * @returns {MockApiError} Kesalahan API.
   */
  constructor(status, message, options) {
    super(message, options);
    this.name = 'MockApiError';
    this.status = status;
  }
}

/**
 * Menolak masukan yang tidak memenuhi syarat.
 * @param {boolean} condition - Kondisi yang harus terpenuhi.
 * @param {string} message - Pesan validasi.
 * @param {number} status - Kode kesalahan HTTP.
 * @returns {void} Tidak mengembalikan nilai.
 */
export function ensure(condition, message, status = 400) {
  if (!condition) throw new MockApiError(status, message);
}
