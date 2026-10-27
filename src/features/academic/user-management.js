/**
 * Modul: Aturan dan transformasi Manajemen Pengguna (P19)
 * @author Rayazka Aris (103022400096)
 * Tanggung jawab: validasi form, filter, urutan, dan perlindungan admin terakhir.
 * @todo Terapkan aturan yang sama di server ketika API tersedia.
 */

export const ROLE_LABELS = { student: 'Siswa', teacher: 'Pengajar', admin: 'Administrator' };
export const STATUS_LABELS = { active: 'Aktif', inactive: 'Nonaktif' };
export const GRADES_BY_LEVEL = { SD: [1, 2, 3, 4, 5, 6], SMP: [7, 8, 9], SMA: [10, 11, 12] };

/**
 * Membuat state awal form; nilai grade string cocok dengan elemen select.
 * @param {Object|null} user - Pengguna yang diedit; null untuk pengguna baru.
 * @returns {Object} Salinan field form tanpa mengubah record asal.
 */
export function createUserForm(user = null) {
  return {
    name: user?.name ?? '', email: user?.email ?? '', role: user?.role ?? 'student',
    status: user?.status ?? 'active', level: user?.level ?? '',
    grade: user?.grade == null ? '' : String(user.grade),
  };
}

/**
 * Memeriksa apakah sebuah record adalah administrator yang masih aktif.
 * @param {Object} user - Record pengguna.
 * @returns {boolean} Status administrator aktif.
 */
export function isActiveAdmin(user) {
  return user?.role === 'admin' && user?.status === 'active';
}

/**
 * Memvalidasi seluruh field form sebelum operasi tambah atau edit dilakukan.
 * @param {Object} form - Nilai dari input form.
 * @param {Array<Object>} users - Sumber terkini untuk pemeriksaan email dan admin.
 * @param {string|null} editingId - ID yang diedit; null berarti menambah pengguna.
 * @returns {Object} errors per field dan candidate yang telah dinormalisasi.
 */
export function validateUserForm(form, users, editingId = null) {
  // 1. Normalisasi input. Email dibandingkan tanpa membedakan huruf besar/kecil.
  const candidate = {
    name: String(form.name ?? '').trim(), email: String(form.email ?? '').trim().toLowerCase(),
    role: form.role, status: form.status,
    // Data akademik hanya berlaku bagi siswa; bersihkan saat peran berubah.
    level: form.role === 'student' ? form.level : '',
    grade: form.role === 'student' && form.grade !== '' ? Number(form.grade) : null,
  };
  const errors = {};

  // 2. Validasi field dasar dan batas panjang agar tabel tetap terbaca.
  if (candidate.name.length < 2 || candidate.name.length > 80) errors.name = 'Nama harus terdiri dari 2–80 karakter.';
  if (candidate.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate.email)) errors.email = 'Masukkan alamat email yang valid.';
  if (users.some((user) => user.id !== editingId && user.email.toLowerCase() === candidate.email)) errors.email = 'Email ini sudah digunakan pengguna lain.';
  if (!Object.hasOwn(ROLE_LABELS, candidate.role)) errors.role = 'Pilih peran yang tersedia.';
  if (!Object.hasOwn(STATUS_LABELS, candidate.status)) errors.status = 'Pilih status pengguna.';

  // 3. Jenjang harus cocok dengan kelas: SD 1–6, SMP 7–9, SMA 10–12.
  if (candidate.role === 'student') {
    if (!Object.hasOwn(GRADES_BY_LEVEL, candidate.level)) errors.level = 'Pilih jenjang pendidikan siswa.';
    if (!GRADES_BY_LEVEL[candidate.level]?.includes(candidate.grade)) errors.grade = 'Pilih kelas yang sesuai dengan jenjang.';
  }

  // 4. Jangan menghilangkan administrator aktif terakhir saat mengganti peran/status.
  const original = users.find((user) => user.id === editingId);
  if (isActiveAdmin(original) && !isActiveAdmin(candidate) && users.filter(isActiveAdmin).length <= 1) {
    errors.form = 'Sisakan minimal satu administrator aktif. Tambahkan admin aktif lain terlebih dahulu.';
  }
  return { errors, candidate };
}

/**
 * Menentukan apakah pengguna boleh dihapus dari direktori demo.
 * @param {Array<Object>} users - Daftar pengguna terkini.
 * @param {string} id - ID yang akan dihapus.
 * @returns {string|null} Pesan penolakan atau null jika dapat dilanjutkan.
 */
export function getDeleteError(users, id) {
  const target = users.find((user) => user.id === id);
  if (!target) return 'Pengguna sudah tidak tersedia. Muat ulang daftar dan coba lagi.';
  if (isActiveAdmin(target) && users.filter(isActiveAdmin).length <= 1) {
    return 'Administrator aktif terakhir tidak dapat dihapus.';
  }
  return null;
}

/**
 * Menyaring dan mengurutkan salinan daftar tanpa memodifikasi sumber.
 * @param {Array<Object>} users - Daftar lengkap pengguna.
 * @param {Object} filters - query, role, status dan sort dari toolbar.
 * @returns {Array<Object>} Daftar sesuai pilihan pengguna.
 */
export function filterUsers(users, { query = '', role = 'all', status = 'all', sort = 'newest' } = {}) {
  const keyword = query.trim().toLocaleLowerCase('id-ID');
  const filtered = users.filter((user) =>
    (role === 'all' || user.role === role) &&
    (status === 'all' || user.status === status) &&
    (!keyword || `${user.name} ${user.email}`.toLocaleLowerCase('id-ID').includes(keyword)),
  );
  return filtered.sort((a, b) => sort === 'name'
    ? a.name.localeCompare(b.name, 'id-ID')
    : b.createdAt.localeCompare(a.createdAt) || a.name.localeCompare(b.name, 'id-ID'));
}

/**
 * Memverifikasi data hasil JSON.parse sebelum dipakai kembali oleh React.
 * @param {unknown} value - Data pengguna yang dibaca dari localStorage.
 * @returns {boolean} True hanya jika skema serta identitas pengguna konsisten.
 */
export function isValidUserList(value) {
  if (!Array.isArray(value) || !value.length) return false;
  const ids = new Set();
  const emails = new Set();
  for (const user of value) {
    if (!user || typeof user.id !== 'string' || !user.id.trim() || ids.has(user.id) || typeof user.name !== 'string' || typeof user.email !== 'string' || typeof user.createdAt !== 'string' || !Number.isFinite(Date.parse(user.createdAt))) return false;
    if (Object.keys(validateUserForm(user, [], null).errors).length) return false;
    const email = user.email.toLowerCase();
    if (emails.has(email)) return false;
    ids.add(user.id);
    emails.add(email);
  }
  return value.some(isActiveAdmin);
}
