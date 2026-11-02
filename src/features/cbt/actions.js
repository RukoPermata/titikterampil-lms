/**
 * Modul: Fungsi frontend cbt
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Lengkapi integrasi backend setelah kontrak API final disepakati.
 */

/**
 * Menyamakan teks pencarian agar filter tidak bergantung besar-kecil huruf.
 * @param {unknown} value - Nilai yang akan dinormalisasi.
 * @returns {string} Teks huruf kecil tanpa spasi di awal/akhir.
 */
export function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase();
}

/**
 * Memfilter paket berdasarkan pilihan katalog.
 * @param {Array<Object>} packages - Daftar paket tryout.
 * @param {Object} filters - Filter level, grade, subject, dan query pencarian.
 * @returns {Array<Object>} Paket yang sesuai; input bukan array menghasilkan daftar kosong.
 */
export function filterTryouts(packages = [], filters = {}) {
  // 1. Tangani sumber data atau filter yang belum siap.
  if (!Array.isArray(packages)) return [];
  const criteria = filters ?? {};

  // 2. Normalisasi nilai filter dari elemen form.
  const selectedLevel = normalizeText(criteria.level);
  const hasGrade = criteria.grade !== undefined && criteria.grade !== null && String(criteria.grade).trim() !== '';
  const selectedGrade = hasGrade ? String(criteria.grade).trim() : null;
  const selectedSubject = normalizeText(criteria.subject);
  const query = normalizeText(criteria.query);

  // 3. Terapkan seluruh filter tanpa mengubah array asal.
  return packages.filter((item) => {
    if (!item) return false;
    if (selectedLevel && normalizeText(item.level) !== selectedLevel) return false;
    if (selectedGrade && String(item.grade).trim() !== selectedGrade) return false;
    if (selectedSubject && normalizeText(item.subject) !== selectedSubject) return false;
    if (query) {
      const searchable = `${item.title ?? ''} ${item.subject ?? ''} ${item.level ?? ''}`;
      if (!normalizeText(searchable).includes(query)) return false;
    }
    return true;
  });
}

/**
 * Memformat harga rupiah untuk kartu dan detail paket.
 * @param {number} value - Nominal harga.
 * @returns {string} Harga berformat rupiah atau teks gratis.
 */
export function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return 'Gratis';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Memeriksa apakah voucher dapat dipakai untuk sebuah paket.
 * @param {Object} voucher - Record voucher dari API atau data contoh.
 * @param {string} tryoutId - ID paket yang ingin dibuka.
 * @param {Date|string} [now=new Date()] - Waktu pemeriksaan.
 * @returns {{status: string, message: string, voucher?: Object}} Hasil validasi.
 */
export function validateVoucher(voucher, tryoutId, now = new Date()) {
  // 1. Pastikan voucher dan paket tersedia.
  if (!voucher || typeof voucher !== 'object' || Array.isArray(voucher)) {
    return { status: 'error', message: 'Kode voucher tidak ditemukan.' };
  }
  if (typeof tryoutId !== 'string' || !tryoutId.trim()) {
    return { status: 'error', message: 'Paket tryout tidak valid.' };
  }

  // 2. Periksa status, kuota, dan masa berlaku.
  if (voucher.status !== 'Aktif') {
    return { status: 'error', message: 'Voucher sudah tidak aktif.' };
  }
  if (Number(voucher.usedCount) >= Number(voucher.quota)) {
    return { status: 'error', message: 'Kuota voucher sudah habis.' };
  }
  const today = new Date(now);
  const expiry = new Date(`${voucher.validUntil}T23:59:59`);
  if (!Number.isFinite(today.getTime()) || !Number.isFinite(expiry.getTime()) || today > expiry) {
    return { status: 'error', message: 'Masa berlaku voucher sudah berakhir.' };
  }

  // 3. Pastikan voucher mencakup paket yang dipilih.
  const packages = Array.isArray(voucher.applicablePackages) ? voucher.applicablePackages : [];
  if (!packages.includes('all') && !packages.includes(tryoutId)) {
    return { status: 'error', message: 'Voucher tidak berlaku untuk paket ini.' };
  }

  return {
    status: 'success',
    message: `Voucher ${voucher.code} berhasil dipakai. Paket ini terbuka.`,
    voucher,
  };
}


/**
 * Menyiapkan percobaan ujian untuk sebuah paket.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {string} tryoutId - ID paket yang akan dikerjakan.
 * @returns {Object} Kesalahan atau kerangka percobaan; belum memulai timer.
 */
export function startAttempt(tryoutId) {
  // 1. Pastikan ID paket tersedia.
  if (typeof tryoutId !== 'string' || !tryoutId.trim()) {
    return { status: 'error', message: 'ID paket wajib diisi.' };
  }

  // 2. Siapkan kontrak; ID dan deadline belum dibuat pada skeleton.
  const draft = { tryoutId, answers: {}, flaggedQuestionIds: [], submittedAt: null };

  // 3. TODO: Cari paket dan validasi jenjang, jadwal serta batas percobaan.
  // 4. TODO: Pulihkan attempt aktif atau buat ID unik dan deadline dari durasi paket.
  // 5. TODO: Simpan percobaan sebelum UI menyalakan timer berbasis deadline.
  return { status: 'not_implemented', draft, message: 'Percobaan belum dimulai.' };
}

/**
 * Menyiapkan pembaruan satu jawaban CBT.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {string} attemptId - ID percobaan aktif.
 * @param {string} questionId - ID soal yang dijawab.
 * @param {number} optionIndex - Indeks opsi berbasis nol.
 * @returns {Object} Kesalahan atau jawaban yang belum disimpan.
 */
export function saveAnswer(attemptId, questionId, optionIndex) {
  // 1. Validasi bentuk identitas dan indeks opsi.
  if (typeof attemptId !== 'string' || !attemptId.trim() || typeof questionId !== 'string' || !questionId.trim() || !Number.isInteger(optionIndex) || optionIndex < 0) {
    return { status: 'error', message: 'Identitas jawaban atau opsi tidak valid.' };
  }

  // 2. Siapkan perubahan satu soal tanpa menimpa jawaban lainnya.
  const answer = { attemptId, questionId, optionIndex };

  // 3. TODO: Pastikan soal milik paket, opsi tersedia dan attempt belum selesai.
  // 4. TODO: Gabungkan jawaban ke attempt lalu simpan dengan versi skema lokal.
  // 5. TODO: Tangani storage gagal dan beri indikator tersimpan yang akurat.
  return { status: 'not_implemented', answer, message: 'Jawaban belum disimpan.' };
}

/**
 * Menyiapkan pengumpulan dan penilaian percobaan.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {Object} attempt - Percobaan berisi id, answers dan submittedAt.
 * @param {Array<Object>} questions - Soal, kunci dan bobot paket yang dikerjakan.
 * @returns {Object} Kesalahan atau status belum diimplementasikan; belum menghasilkan skor.
 */
export function submitAttempt(attempt, questions = []) {
  // 1. Pastikan percobaan dan soal tersedia.
  if (!attempt || typeof attempt.id !== 'string' || !attempt.id.trim() || !Array.isArray(questions) || questions.length === 0) {
    return { status: 'error', message: 'Percobaan dan daftar soal wajib tersedia.' };
  }

  // 2. Cegah pengumpulan ulang percobaan selesai.
  if (attempt.submittedAt) {
    return { status: 'error', message: 'Percobaan sudah dikumpulkan.' };
  }

  // 3. TODO: Validasi relasi paket/soal serta struktur jawaban dan bobot positif.
  // 4. TODO: Jumlahkan bobot benar dan total bobot; tangani total bobot nol.
  // 5. TODO: Hitung skor = bobot benar / total bobot * 100.
  // 6. TODO: Simpan hasil dan submittedAt sekali sebelum menavigasi ke P08.
  // 7. Jangan mengembalikan nilai contoh seolah penilaian sudah terjadi.
  return { status: 'not_implemented', attemptId: attempt.id, score: null, message: 'Hasil belum dihitung atau disimpan.' };
}

/**
 * Menyiapkan pembacaan hasil dan pembahasan.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {string} attemptId - ID hasil percobaan, bukan ID paket.
 * @returns {Object} Kerangka pembahasan yang belum dimuat.
 */
export function getAttemptReview(attemptId) {
  // 1. Validasi identitas percobaan.
  if (typeof attemptId !== 'string' || !attemptId.trim()) {
    return { status: 'error', message: 'ID percobaan wajib diisi.' };
  }

  // 2. Siapkan bentuk hasil yang akan dipakai halaman P08.
  const review = { score: null, submittedAt: null, items: [] };

  // 3. TODO: Cari attempt milik siswa aktif dan pastikan sudah dikumpulkan.
  // 4. TODO: Gabungkan jawaban, kunci, status benar/salah dan pembahasan.
  // 5. TODO: Bedakan hasil tidak ditemukan dengan kegagalan membaca penyimpanan.
  return { status: 'not_implemented', attemptId, review };
}

/**
 * Menyiapkan daftar riwayat tryout siswa.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {string} studentId - ID siswa aktif.
 * @returns {Object} Kerangka riwayat yang belum dibaca.
 */
export function getStudentHistory(studentId) {
  // 1. Validasi identitas siswa.
  if (typeof studentId !== 'string' || !studentId.trim()) {
    return { status: 'error', message: 'ID siswa wajib diisi.' };
  }

  // 2. Siapkan daftar; status membedakan belum dimuat dari riwayat kosong.
  const attempts = [];

  // 3. TODO: Ambil hanya percobaan selesai milik siswa tersebut.
  // 4. TODO: Gabungkan judul paket dan urutkan submittedAt terbaru.
  // 5. TODO: Kembalikan tautan berdasarkan attemptId untuk P08 dan P09.
  return { status: 'not_implemented', studentId, attempts };
}
