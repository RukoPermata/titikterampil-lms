/**
 * Modul: Fungsi frontend auth
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Kembangkan fungsi sesuai kontrak data; status not_implemented tidak berarti operasi berhasil.
 */
/**
 * Memeriksa kesiapan data pendaftaran siswa.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {Object} input - Nama, email, password, level dan grade dari form.
 * @returns {Object} Hasil validasi awal; valid tetap false selama aturan lengkap belum dibuat.
 */
export function validateRegistration(input) {
  // 1. Tolak input selain objek form.
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { status: 'error', valid: false, errors: ['Data pendaftaran wajib diisi.'] };
  }

  // 2. Normalisasi identitas tanpa mengembalikan atau menyimpan sandi.
  const candidate = {
    name: String(input.name ?? '').trim(),
    email: String(input.email ?? '').trim().toLowerCase(),
    level: input.level,
    grade: Number(input.grade),
  };

  const errors = [];
  if (!candidate.name) errors.push('Nama lengkap wajib diisi.');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!candidate.email) {
    errors.push('Alamat email wajib diisi.');
  } else if (!emailPattern.test(candidate.email)) {
    errors.push('Format email tidak valid.');
  }

  const password = String(input.password ?? '');
  if (!password) {
    errors.push('Kata sandi wajib diisi.');
  } else if (password.length < 6) {
    errors.push('Kata sandi minimal 6 karakter.');
  }

  const gradeRanges = { SD: [1, 2, 3, 4, 5, 6], SMP: [7, 8, 9], SMA: [10, 11, 12] };
  if (!candidate.level || !gradeRanges[candidate.level]) {
    errors.push('Pilih jenjang pendidikan yang valid (SD, SMP, SMA).');
  } else if (!gradeRanges[candidate.level].includes(candidate.grade)) {
    errors.push(`Kelas ${candidate.grade} tidak sesuai dengan jenjang ${candidate.level}.`);
  }

  if (errors.length > 0) {
    return { status: 'not_implemented', valid: false, candidate, errors };
  }

  return {
    status: 'success',
    valid: true,
    candidate,
    message: 'Data pendaftaran berhasil divalidasi.',
  };
}

/**
 * Menyiapkan perubahan profil siswa.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {Object} profile - Profil dengan id, name, level dan grade.
 * @returns {Object} Kesalahan input atau kandidat perubahan yang belum disimpan.
 */
export function updateProfile(profile) {
  // 1. Pastikan identitas profil tersedia.
  if (!profile || typeof profile.id !== 'string' || !profile.id.trim()) {
    return { status: 'error', message: 'ID profil wajib diisi.' };
  }

  // 2. Ambil hanya field profil yang diizinkan, bukan sandi atau peran.
  const candidate = { id: profile.id, name: String(profile.name ?? '').trim(), level: profile.level, grade: profile.grade };

  // 3. TODO: Validasi nama dan pasangan jenjang/kelas.
  // 4. TODO: Simpan perubahan melalui adapter frontend; tangani storage gagal.
  // 5. TODO: Sinkronkan sesi dan tampilkan sukses hanya setelah penyimpanan berhasil.
  return { status: 'not_implemented', candidate, message: 'Profil belum disimpan.' };
}

/**
 * Menyiapkan ringkasan dashboard pengajar.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {string} teacherId - ID pengajar dari sesi demo aktif.
 * @returns {Object} Kerangka ringkasan yang belum dihitung.
 */
export function getTeacherSummary(teacherId) {
  // 1. Pastikan ringkasan diminta untuk pengajar tertentu.
  if (typeof teacherId !== 'string' || !teacherId.trim()) {
    return { status: 'error', message: 'ID pengajar wajib diisi.' };
  }

  // 2. Siapkan kontrak; null berarti belum dihitung, bukan nilai nol.
  const summary = { classCount: null, pendingSubmissionCount: null, studentCount: null };

  // 3. TODO: Ambil kelas pengajar dari data akademik Rayazka.
  // 4. TODO: Gunakan hasil monitoring Hilmy untuk menghitung tugas dan peserta.
  // 5. TODO: Tangani data kosong dan teruskan ringkasan ke dashboard P14.
  return { status: 'not_implemented', teacherId, summary };
}

/**
 * Daftar kredensial akun demo frontend untuk pengujian.
 */
export const DEMO_ACCOUNTS = [
  {
    role: 'student',
    roleLabel: 'Siswa',
    email: 'siswa@titikterampil.id',
    password: 'password123',
    user: {
      id: 'student-demo',
      name: 'Siswa Contoh',
      email: 'siswa@titikterampil.id',
      role: 'student',
      level: 'SMA',
      grade: 12,
    },
  },
  {
    role: 'teacher',
    roleLabel: 'Pengajar',
    email: 'guru@titikterampil.id',
    password: 'password123',
    user: {
      id: 'teacher-demo',
      name: 'Pengajar Contoh',
      email: 'guru@titikterampil.id',
      role: 'teacher',
    },
  },
  {
    role: 'admin',
    roleLabel: 'Administrator',
    email: 'admin@titikterampil.id',
    password: 'password123',
    user: {
      id: 'admin-demo',
      name: 'Admin Titik Terampil',
      email: 'admin@titikterampil.id',
      role: 'admin',
    },
  },
];

const STORAGE_KEY = 'titikterampil_registered_users';

/**
 * Membaca daftar pengguna yang didaftarkan melalui form frontend.
 * @returns {Array<Object>} Daftar akun terdaftar di localStorage.
 */
export function getRegisteredUsers() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Menyimpan pengguna baru ke localStorage agar dapat login kembali.
 * @param {Object} userData - Data pendaftaran pengguna.
 * @returns {boolean} True jika penyimpanan berhasil.
 */
export function saveRegisteredUser(userData) {
  if (typeof window === 'undefined' || !userData || !userData.email) return false;
  try {
    const list = getRegisteredUsers().filter((u) => u.email !== userData.email);
    list.push(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

/**
 * Memvalidasi kredensial dan melakukan autentikasi pengguna pada tingkat frontend.
 * @param {Object} credentials - Input dari formulir masuk (email dan password).
 * @returns {Object} Hasil autentikasi { status: 'success'|'error', user?: Object, message?: string, field?: string }.
 */
export function authenticateUser(credentials) {
  // 1. Validasi input awal
  if (!credentials || typeof credentials !== 'object' || Array.isArray(credentials)) {
    return { status: 'error', message: 'Data kredensial masuk tidak valid.' };
  }

  const email = String(credentials.email ?? '').trim().toLowerCase();
  const password = String(credentials.password ?? '');

  if (!email) {
    return { status: 'error', field: 'email', message: 'Alamat email wajib diisi.' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { status: 'error', field: 'email', message: 'Format alamat email tidak valid.' };
  }

  if (!password) {
    return { status: 'error', field: 'password', message: 'Kata sandi wajib diisi.' };
  }

  // 2. Gabungkan akun yang baru didaftarkan dengan akun demo bawaan
  const registered = getRegisteredUsers().map((u) => ({
    email: u.email,
    password: u.password,
    user: {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role || 'student',
      level: u.level,
      grade: u.grade,
    },
  }));

  const allAccounts = [...registered, ...DEMO_ACCOUNTS];

  const matched = allAccounts.find((acc) => acc.email === email);
  if (!matched) {
    return {
      status: 'error',
      field: 'email',
      message: 'Email tidak ditemukan. Silakan periksa kembali atau daftar akun baru.',
    };
  }

  if (matched.password !== password) {
    return {
      status: 'error',
      field: 'password',
      message: 'Kata sandi yang Anda masukkan salah.',
    };
  }

  // 3. Kembalikan identitas pengguna terautentikasi
  return {
    status: 'success',
    user: matched.user,
    message: 'Berhasil masuk.',
  };
}

