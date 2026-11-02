/**
 * Modul: Logika murni dan validasi fitur pembayaran dan manajemen voucher.
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: kalkulasi harga, validasi form voucher, dan penanganan status transaksi.
 */

/**
 * Memvalidasi form input voucher admin sebelum dikirim ke server.
 * @param {Object} input - Data masukan form voucher.
 * @param {string} input.code - Kode voucher unik.
 * @param {string} input.title - Judul atau deskripsi voucher.
 * @param {number|string} input.quota - Kuota pemakaian.
 * @param {string} input.validUntil - Tanggal kedaluwarsa YYYY-MM-DD.
 * @param {string[]} input.applicablePackages - Daftar ID paket atau ['all'].
 * @param {string} [input.status] - Status voucher ('Aktif' | 'Nonaktif').
 * @returns {{ valid: boolean, errors: Object, candidate: Object|null }} Hasil validasi.
 */
export function validateVoucherForm(input) {
  const errors = {};
  if (!input || typeof input !== 'object') {
    return { valid: false, errors: { general: 'Data formulir tidak valid.' }, candidate: null };
  }

  const rawCode = String(input.code || '').trim().toUpperCase();
  if (!rawCode) {
    errors.code = 'Kode voucher wajib diisi.';
  } else if (!/^[A-Z0-9_-]+$/.test(rawCode)) {
    errors.code = 'Kode voucher hanya boleh berisi huruf kapital, angka, tanda strip (-), atau garis bawah (_).';
  } else if (rawCode.length < 3 || rawCode.length > 20) {
    errors.code = 'Kode voucher harus antara 3 hingga 20 karakter.';
  }

  const rawTitle = String(input.title || '').trim();
  if (!rawTitle) {
    errors.title = 'Judul voucher wajib diisi.';
  } else if (rawTitle.length < 3 || rawTitle.length > 100) {
    errors.title = 'Judul voucher harus antara 3 hingga 100 karakter.';
  }

  const rawQuota = Number(input.quota);
  if (input.quota === '' || input.quota === undefined || input.quota === null) {
    errors.quota = 'Kuota voucher wajib diisi.';
  } else if (!Number.isInteger(rawQuota) || rawQuota < 1) {
    errors.quota = 'Kuota harus berupa bilangan bulat minimal 1.';
  }

  const rawValidUntil = String(input.validUntil || '').trim();
  if (!rawValidUntil) {
    errors.validUntil = 'Masa berlaku voucher wajib diisi.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(rawValidUntil)) {
    errors.validUntil = 'Format tanggal harus YYYY-MM-DD.';
  } else {
    const parsedDate = new Date(`${rawValidUntil}T00:00:00Z`);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== rawValidUntil) {
      errors.validUntil = 'Tanggal masa berlaku tidak valid.';
    }
  }

  let packages = Array.isArray(input.applicablePackages) ? input.applicablePackages : [];
  if (packages.length === 0) {
    errors.applicablePackages = 'Pilih minimal satu paket atau pilih opsi Semua Paket.';
  } else if (packages.includes('all') && packages.length > 1) {
    errors.applicablePackages = 'Opsi Semua Paket tidak boleh digabungkan dengan paket spesifik.';
  }

  const rawStatus = input.status || 'Aktif';
  if (!['Aktif', 'Nonaktif'].includes(rawStatus)) {
    errors.status = 'Status voucher harus Aktif atau Nonaktif.';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { valid: false, errors, candidate: null };
  }

  const candidate = {
    code: rawCode,
    title: rawTitle,
    quota: rawQuota,
    validUntil: rawValidUntil,
    applicablePackages: packages,
    status: rawStatus,
  };

  return { valid: true, errors: {}, candidate };
}

/**
 * Menghitung rincian pembayaran checkout termasuk potongan voucher jika valid.
 * @param {Object} tryout - Data paket tryout yang dibeli.
 * @param {string} [voucherCode] - Kode voucher yang dimasukkan pengguna.
 * @param {Array<Object>} [availableVouchers=[]] - Daftar voucher aktif dari sistem.
 * @returns {Object} Rincian checkout: basePrice, discount, total, appliedVoucher, error.
 */
export function calculateCheckoutDetails(tryout, voucherCode = '', availableVouchers = []) {
  if (!tryout) {
    return {
      basePrice: 0,
      discount: 0,
      adminFee: 0,
      total: 0,
      appliedVoucher: null,
      voucherError: 'Paket tryout tidak ditemukan.',
      isFree: true,
    };
  }

  const basePrice = Number(tryout.price) || 0;
  const adminFee = 0; // Biaya layanan demo gratis

  if (!voucherCode || !voucherCode.trim()) {
    return {
      basePrice,
      discount: 0,
      adminFee,
      total: basePrice + adminFee,
      appliedVoucher: null,
      voucherError: '',
      isFree: basePrice === 0,
    };
  }

  const normalizedCode = voucherCode.trim().toUpperCase();
  const matchedVoucher = availableVouchers.find(
    (v) => v.code && v.code.toUpperCase() === normalizedCode
  );

  if (!matchedVoucher) {
    return {
      basePrice,
      discount: 0,
      adminFee,
      total: basePrice + adminFee,
      appliedVoucher: null,
      voucherError: `Kode voucher "${normalizedCode}" tidak ditemukan.`,
      isFree: basePrice === 0,
    };
  }

  if (matchedVoucher.status !== 'Aktif') {
    return {
      basePrice,
      discount: 0,
      adminFee,
      total: basePrice + adminFee,
      appliedVoucher: null,
      voucherError: matchedVoucher.status === 'Habis'
        ? `Kuota voucher "${normalizedCode}" sudah habis terpakai.`
        : `Voucher "${normalizedCode}" saat ini tidak aktif.`,
      isFree: basePrice === 0,
    };
  }

  if (matchedVoucher.usedCount >= matchedVoucher.quota) {
    return {
      basePrice,
      discount: 0,
      adminFee,
      total: basePrice + adminFee,
      appliedVoucher: null,
      voucherError: `Kuota voucher "${normalizedCode}" sudah habis.`,
      isFree: basePrice === 0,
    };
  }

  const today = new Date().toISOString().slice(0, 10);
  if (matchedVoucher.validUntil < today) {
    return {
      basePrice,
      discount: 0,
      adminFee,
      total: basePrice + adminFee,
      appliedVoucher: null,
      voucherError: `Masa berlaku voucher "${normalizedCode}" telah kedaluwarsa (${matchedVoucher.validUntil}).`,
      isFree: basePrice === 0,
    };
  }

  const appliesToThis =
    matchedVoucher.applicablePackages.includes('all') ||
    matchedVoucher.applicablePackages.includes(tryout.id);

  if (!appliesToThis) {
    return {
      basePrice,
      discount: 0,
      adminFee,
      total: basePrice + adminFee,
      appliedVoucher: null,
      voucherError: `Voucher "${normalizedCode}" tidak berlaku untuk paket "${tryout.title}".`,
      isFree: basePrice === 0,
    };
  }

  // Voucher valid memberikan akses gratis (diskon 100% pada paket demo)
  const discount = basePrice;
  const total = Math.max(0, basePrice - discount + adminFee);

  return {
    basePrice,
    discount,
    adminFee,
    total,
    appliedVoucher: matchedVoucher,
    voucherError: '',
    isFree: total === 0,
  };
}

/**
 * Memformat tanggal string ISO atau tanggal jam ke representasi bahasa Indonesia yang ramah.
 * @param {string} dateString - String tanggal ISO atau format 'YYYY-MM-DD HH:mm'.
 * @returns {string} Tanggal terformat (contoh: '31 Okt 2026, 10:14 WIB').
 */
export function formatTransactionDate(dateString) {
  if (!dateString) return '-';
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return String(dateString);
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(parsed) + ' WIB';
}

/**
 * Daftar metode pembayaran simulasi demo yang didukung sistem.
 */
export const paymentMethods = [
];
