/**
 * Modul: Kontrak fetch API untuk transaksi pembayaran dan manajemen voucher.
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: komunikasi HTTP dengan endpoint /api/transactions dan /api/vouchers.
 */

export class PaymentApiError extends Error {
  /**
   * Membuat error yang menyimpan HTTP status code dan pesan user-friendly.
   * @param {string} message - Pesan kesalahan yang dapat dipahami pengguna.
   * @param {number} [status=0] - Status HTTP (0 jika error jaringan / offline).
   */
  constructor(message, status = 0) {
    super(message);
    this.name = 'PaymentApiError';
    this.status = status;
  }
}

/**
 * Menyusun query string untuk endpoint voucher dari parameter filter.
 * @param {Object} [filters={}] - Filter voucher: q, status, code, tryoutId.
 * @returns {string} Query string URL yang aman.
 */
export function vouchersQuery(filters = {}) {
  const params = new URLSearchParams();
  for (const key of ['q', 'status', 'code', 'tryoutId']) {
    const value = String(filters[key] ?? '').trim();
    if (value) params.set(key, value);
  }
  return params.toString();
}

/**
 * Menyusun query string untuk endpoint transaksi dari parameter filter.
 * @param {Object} [filters={}] - Filter transaksi: q, status, studentId, tryoutId.
 * @returns {string} Query string URL yang aman.
 */
export function transactionsQuery(filters = {}) {
  const params = new URLSearchParams();
  for (const key of ['q', 'status', 'studentId', 'tryoutId']) {
    const value = String(filters[key] ?? '').trim();
    if (value) params.set(key, value);
  }
  return params.toString();
}

/**
 * Membuat instance API client pembayaran dan voucher.
 * @param {Function} [fetcher=fetch] - Implementasi fetch.
 * @returns {Object} Kumpulan metode API voucher dan transaksi.
 */
export function createPaymentApi(fetcher = (...args) => fetch(...args)) {
  /**
   * Pembungkus fetch dengan penanganan kesalahan terpadu.
   * @param {string} path - URL endpoint lokal.
   * @param {Object} [options={}] - Opsi fetch (method, headers, body, signal).
   * @returns {Promise<any>} Data hasil parse respons JSON.
   */
  async function request(path, options = {}) {
    const method = options.method || 'GET';
    let response;
    try {
      response = await fetcher(path, {
        method,
        signal: options.signal,
        cache: 'no-store',
        ...(options.body === undefined
          ? {}
          : {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(options.body),
            }),
      });
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      throw new PaymentApiError(
        method === 'GET'
          ? 'Gagal terhubung ke server. Periksa koneksi internet Anda.'
          : 'Gagal mengirim permintaan ke server. Silakan coba kembali.'
      );
    }

    let result;
    try {
      result = await response.json();
    } catch {
      throw new PaymentApiError('Respons server tidak dapat dibaca.', response.status);
    }

    if (!response.ok || !result || result.status !== 'success') {
      const message =
        typeof result?.message === 'string'
          ? result.message
          : 'Terjadi kesalahan pada server saat memproses data.';
      throw new PaymentApiError(message, response.status);
    }

    return result.data;
  }

  return {
    // Voucher endpoints
    vouchers: (query = '', signal) =>
      request(`/api/vouchers${query ? `?${query}` : ''}`, { signal }),
    voucher: (id, signal) =>
      request(`/api/vouchers/${encodeURIComponent(id)}`, { signal }),
    saveVoucher: (body, id = null) =>
      request(`/api/vouchers${id ? `/${encodeURIComponent(id)}` : ''}`, {
        method: id ? 'PATCH' : 'POST',
        body,
      }),
    deleteVoucher: (id) =>
      request(`/api/vouchers/${encodeURIComponent(id)}`, { method: 'DELETE' }),

    // Transaction endpoints
    transactions: (query = '', signal) =>
      request(`/api/transactions${query ? `?${query}` : ''}`, { signal }),
    transaction: (id, signal) =>
      request(`/api/transactions/${encodeURIComponent(id)}`, { signal }),
    saveTransaction: (body, id = null) =>
      request(`/api/transactions${id ? `/${encodeURIComponent(id)}` : ''}`, {
        method: id ? 'PATCH' : 'POST',
        body,
      }),

    // Data pendukung
    tryouts: (signal) => request('/api/tryouts', { signal }),
    adminSummary: (signal) => request('/api/admin/summary', { signal }),
  };
}

export const paymentApi = createPaymentApi();
