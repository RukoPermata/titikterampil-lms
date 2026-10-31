/**
 * Modul: Utilitas pendukung umum
 * @author Tim Titik Terampil
 * Tanggung jawab: menyediakan fungsi pembantu bersama (format mata uang, tanggal, dsb).
 */

/**
 * Memformat angka menjadi format mata uang Rupiah.
 * @param {number} amount - Nominal angka.
 * @returns {string} String format Rupiah (contoh: Rp 50.000).
 */
export function formatRupiah(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
