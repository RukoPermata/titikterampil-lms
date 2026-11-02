/** Modul: Kontrak fetch untuk manajemen pengguna dan dashboard admin. */
export class AdminApiError extends Error {
  /**
   * Membuat error yang menyimpan status HTTP dan kepastian hasil mutasi.
   * @param {string} message - Pesan yang dapat ditampilkan.
   * @param {number} status - HTTP status, 0 untuk kegagalan koneksi.
   * @returns {AdminApiError} Error permintaan.
   */
  constructor(message, status = 0) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
  }
}

/**
 * Membentuk query pengguna dengan membuang filter kosong.
 * @param {Object} filters - q, role, dan isMember.
 * @returns {string} Query yang aman untuk URL.
 */
export function usersQuery(filters = {}) {
  const params = new URLSearchParams();
  for (const key of ['q', 'role', 'isMember']) {
    const value = String(filters[key] ?? '').trim();
    if (value) params.set(key, value);
  }
  return params.toString();
}

/**
 * Memeriksa record minimal sebelum UI mengakses field pengguna.
 * @param {unknown} value - Record hasil JSON.
 * @returns {boolean} True jika kontrak identitas terpenuhi.
 */
function isUser(value) {
  return Boolean(value && typeof value.id === 'string' && typeof value.name === 'string' &&
    typeof value.email === 'string' && typeof value.whatsapp === 'string' &&
    ['student', 'teacher', 'admin'].includes(value.role));
}

/**
 * Menyediakan pemanggilan API; fetch dapat diganti pada pengujian.
 * @param {Function} fetcher - Implementasi Fetch API.
 * @returns {Object} Operasi pengguna, referensi akademik, dan ringkasan.
 */
export function createAdminApi(fetcher = (...args) => fetch(...args)) {
  /**
   * Memeriksa HTTP, JSON, dan bentuk data pada satu permintaan.
   * @param {string} path - URL endpoint lokal.
   * @param {Object} options - method, body, dan signal.
   * @param {Function} check - Pemeriksaan bentuk data.
   * @returns {Promise<unknown>} Data yang sudah diperiksa.
   */
  async function request(path, options = {}, check = () => true) {
    const method = options.method || 'GET';
    let response;
    try {
      response = await fetcher(path, { method, signal: options.signal, cache: 'no-store',
        ...(options.body === undefined ? {} : {
          headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(options.body),
        }),
      });
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      throw new AdminApiError(method === 'GET' ? 'Tidak dapat terhubung ke server. Coba muat ulang.' :
        'Hasil penyimpanan belum dapat dipastikan. Muat ulang daftar sebelum mencoba lagi.');
    }
    let result;
    try { result = await response.json(); } catch {
      throw new AdminApiError('Respons server tidak dapat dibaca. Muat ulang data sebelum melanjutkan.', response.status);
    }
    if (!response.ok || !result || result.status !== 'success') {
      throw new AdminApiError(typeof result?.message === 'string' ? result.message :
        'Permintaan gagal. Coba muat ulang data.', response.status);
    }
    if (!check(result.data)) throw new AdminApiError('Bentuk data server tidak sesuai. Coba muat ulang.', response.status);
    return result.data;
  }
  return {
    users: (query, signal) => request(`/api/users${query ? `?${query}` : ''}`, { signal },
      (data) => Array.isArray(data) && data.every(isUser)),
    user: (id, signal) => request(`/api/users/${encodeURIComponent(id)}`, { signal }, isUser),
    academics: (signal) => request('/api/academics', { signal }, (data) =>
      Array.isArray(data) && data.length > 0 && data.every((item) => typeof item.level === 'string' &&
        Array.isArray(item.grades) && item.grades.length > 0)),
    save: (body, id) => request(`/api/users${id ? `/${encodeURIComponent(id)}` : ''}`,
      { method: id ? 'PATCH' : 'POST', body }, isUser),
    member: (id, isMember) => request(`/api/users/${encodeURIComponent(id)}`,
      { method: 'PATCH', body: { isMember } }, isUser),
    remove: (id) => request(`/api/users/${encodeURIComponent(id)}`, { method: 'DELETE' },
      (data) => data?.id === id),
    summary: (signal) => request('/api/admin/summary', { signal }, (data) => data &&
      ['totalUsers', 'totalStudents', 'totalTeachers', 'totalAdmins', 'activeMembers', 'totalPackages',
        'publishedPackages', 'unclassifiedPackages', 'estimatedRevenue', 'pendingTransactions', 'pendingEssays']
        .every((key) => typeof data[key] === 'number' && Number.isFinite(data[key]) && data[key] >= 0)),
  };
}

export const adminApi = createAdminApi();
