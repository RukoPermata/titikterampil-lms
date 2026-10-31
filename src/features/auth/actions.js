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
  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/`~]/;
  if (!password) {
    errors.push('Kata sandi wajib diisi.');
  } else if (password.length < 8) {
    errors.push('Kata sandi minimal 8 karakter.');
  } else if (!specialCharPattern.test(password)) {
    errors.push('Kata sandi wajib mengandung minimal satu simbol khusus (misal: !@#$).');
  }

  if (input.confirmPassword !== undefined) {
    const confirmPassword = String(input.confirmPassword ?? '');
    if (!confirmPassword) {
      errors.push('Konfirmasi kata sandi wajib diisi.');
    } else if (confirmPassword !== password) {
      errors.push('Konfirmasi kata sandi tidak cocok.');
    }
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
 * Memvalidasi dan menyiapkan perubahan data profil siswa.
 * Memastikan konsistensi jenjang pendidikan (SD, SMP, SMA) dan tingkat kelas (1-12).
 * @param {Object} profile - Profil berisi id, name, level, grade, dan email opsional.
 * @returns {Object} Hasil validasi { status: 'success'|'error', candidate?: Object, user?: Object, message: string, field?: string }.
 */
export function updateProfile(profile) {
  // 1. Pastikan data profil tersedia dan memiliki ID yang valid.
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    return { status: 'error', message: 'Data profil tidak valid.' };
  }
  if (typeof profile.id !== 'string' || !profile.id.trim()) {
    return { status: 'error', field: 'id', message: 'ID profil wajib diisi.' };
  }

  // 2. Validasi nama lengkap
  const name = String(profile.name ?? '').trim();
  if (!name) {
    return { status: 'error', field: 'name', message: 'Nama lengkap wajib diisi.' };
  }

  // 3. Validasi jenjang dan tingkat kelas
  const level = profile.level;
  const grade = Number(profile.grade);
  const gradeRanges = { SD: [1, 2, 3, 4, 5, 6], SMP: [7, 8, 9], SMA: [10, 11, 12] };

  if (!level || !gradeRanges[level]) {
    return {
      status: 'error',
      field: 'level',
      message: 'Pilih jenjang pendidikan yang valid (SD, SMP, SMA).',
    };
  }

  if (!gradeRanges[level].includes(grade)) {
    return {
      status: 'error',
      field: 'grade',
      message: `Kelas ${grade} tidak sesuai dengan jenjang ${level}.`,
    };
  }

  // 4. Susun kandidat profil terverifikasi
  const candidate = {
    id: profile.id,
    name,
    email: profile.email ? String(profile.email).trim().toLowerCase() : undefined,
    level,
    grade,
    role: profile.role || 'student',
  };

  // 5. Simpan perubahan ke penyimpanan lokal jika di lingkungan browser
  if (typeof window !== 'undefined') {
    try {
      const registered = getRegisteredUsers();
      const userIndex = registered.findIndex(
        (u) => u.id === profile.id || (profile.email && u.email === profile.email)
      );
      if (userIndex >= 0) {
        registered[userIndex] = { ...registered[userIndex], ...candidate };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registered));
      }
    } catch {
      // Abaikan bila storage gagal; state aplikasi tetap dimutakhirkan
    }
  }

  return {
    status: 'success',
    candidate,
    user: candidate,
    message: 'Profil siswa berhasil diperbarui.',
  };
}

/**
 * Menghitung ringkasan aktivitas pengajaran untuk dashboard pengajar (P14).
 * Mengagregasi jumlah kelas, siswa terdaftar, tugas aktif, dan pengumpulan yang perlu dinilai.
 * @param {string} teacherId - ID pengajar dari sesi aktif.
 * @param {Object} [data] - Sumber data contoh opsional { classes, assignments, users }.
 * @returns {Object} Hasil agregasi { status: 'success'|'error', teacherId?: string, summary?: Object, message?: string }.
 */
export function getTeacherSummary(teacherId, data = {}) {
  // 1. Pastikan ringkasan diminta untuk pengajar tertentu.
  if (typeof teacherId !== 'string' || !teacherId.trim()) {
    return { status: 'error', message: 'ID pengajar wajib diisi.' };
  }

  const classList = Array.isArray(data.classes) ? data.classes : [
    { id: 'demo', title: 'Matematika · Persiapan Kelas 12', level: 'SMA', grade: 12, teacherId: 'teacher-demo' },
  ];
  const assignmentList = Array.isArray(data.assignments) ? data.assignments : [
    { id: 'demo', classId: 'demo', title: 'Latihan persamaan linear', instructions: 'Jelaskan langkah menyelesaikan persamaan 2x + 4 = 10.' },
  ];
  const userList = Array.isArray(data.users) ? data.users : [
    { id: 'student-demo', name: 'Siswa Contoh', role: 'student', level: 'SMA', grade: 12 },
  ];

  // 2. Ambil kelas yang diampu pengajar aktif
  const teacherClasses = classList.filter((c) => c && c.teacherId === teacherId);
  const classCount = teacherClasses.length;

  // 3. Hitung tugas dan siswa pada kelas pengajar
  const teacherClassIds = new Set(teacherClasses.map((c) => c.id));
  const teacherAssignments = assignmentList.filter((a) => a && teacherClassIds.has(a.classId));
  const assignmentCount = teacherAssignments.length;

  const studentCount = teacherClasses.reduce((acc, c) => {
    if (Array.isArray(c.studentIds) && c.studentIds.length > 0) {
      return acc + c.studentIds.length;
    }
    const matching = userList.filter((u) => u && u.role === 'student' && (!c.level || u.level === c.level));
    return acc + (matching.length || 1);
  }, 0);

  // Pada data contoh, tugas yang terbit membutuhkan penilaian dari pengajar
  const pendingSubmissionCount = teacherAssignments.length;

  const summary = {
    classCount,
    studentCount: classCount > 0 ? studentCount : 0,
    assignmentCount,
    pendingSubmissionCount,
  };

  return {
    status: 'success',
    teacherId,
    summary,
    classes: teacherClasses,
    assignments: teacherAssignments,
    message: 'Ringkasan pengajar berhasil dihitung.',
  };
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
  if (!matched || matched.password !== password) {
    return {
      status: 'error',
      message: 'Email atau kata sandi yang Anda masukkan salah.',
    };
  }

  // 3. Kembalikan identitas pengguna terautentikasi
  return {
    status: 'success',
    user: matched.user,
    message: 'Berhasil masuk.',
  };
}

