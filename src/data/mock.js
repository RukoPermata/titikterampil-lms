/**
 * Modul: Kontrak data contoh frontend
 * @author Tim Titik Terampil; koordinator integrasi: Kaisar dan Rayazka
 * Tanggung jawab: menyediakan data contoh statis untuk keperluan demo frontend UTS.
 */

export const academics = [
  { level: 'SD', grades: [4, 5, 6] },
  { level: 'SMP', grades: [7, 8, 9] },
  { level: 'SMA', grades: [10, 11, 12, 'Gap Year'] },
  { level: 'Umum', grades: ['Umum'] },
];

export const users = [
  {
    id: 'student-demo',
    name: 'Siswa Contoh',
    email: 'siswa@titikterampil.id',
    whatsapp: '081234567890',
    role: 'student',
    level: 'SMA',
    grade: 12,
    isMember: true,
    readiness: 'Cukup siap',
    studyTargets: ['Teknik Informatika - UI', 'Sistem Informasi - ITB'],
  },
  {
    id: 'teacher-demo',
    name: 'Pengajar Contoh',
    email: 'guru@titikterampil.id',
    whatsapp: '081298765432',
    role: 'teacher',
  },
  {
    id: 'admin-demo',
    name: 'Admin Titik Terampil',
    email: 'admin@titikterampil.id',
    whatsapp: '081211223344',
    role: 'admin',
  },
  {
    id: 'student-sd',
    name: 'Nadia Salsabila',
    email: 'nadia@titikterampil.id',
    whatsapp: '081300000001',
    role: 'student',
    level: 'SD',
    grade: 6,
    isMember: false,
  },
  {
    id: 'student-smp',
    name: 'Farhan Maulana',
    email: 'farhan@titikterampil.id',
    whatsapp: '081300000002',
    role: 'student',
    level: 'SMP',
    grade: 9,
    isMember: false,
  },
  {
    id: 'student-gapyear',
    name: 'Bambang Irawan',
    email: 'bambang@titikterampil.id',
    whatsapp: '081300000003',
    role: 'student',
    level: 'SMA',
    grade: 'Gap Year',
    isMember: true,
  },
];

export const demoAccounts = [
  {
    role: 'student',
    roleLabel: 'Siswa',
    email: 'siswa@titikterampil.id',
    password: 'password123',
    user: users[0],
  },
  {
    role: 'teacher',
    roleLabel: 'Pengajar',
    email: 'guru@titikterampil.id',
    password: 'password123',
    user: users[1],
  },
  {
    role: 'admin',
    roleLabel: 'Administrator',
    email: 'admin@titikterampil.id',
    password: 'password123',
    user: users[2],
  },
];

export const tryouts = [
  { id: 'demo', title: 'Tryout Matematika SMA', level: 'SMA', grade: 12, subject: 'Matematika', durationMinutes: 30 },
  { id: 'utbk-snbt', title: 'Simulasi UTBK-SNBT Potensi Kognitif', level: 'SMA', grade: 'Gap Year', subject: 'TPS & Literasi', durationMinutes: 45 },
  { id: 'smp-demo', title: 'Latihan Matematika SMP', level: 'SMP', grade: 9, subject: 'Matematika', durationMinutes: 20 },
  { id: 'smp-bahasa', title: 'Pemahaman Bahasa Indonesia SMP', level: 'SMP', grade: 8, subject: 'Bahasa Indonesia', durationMinutes: 20 },
  { id: 'sd-demo', title: 'Latihan Matematika SD', level: 'SD', grade: 6, subject: 'Matematika', durationMinutes: 15 },
  { id: 'sd-ipa', title: 'Latihan Sains & IPA Dasar SD', level: 'SD', grade: 5, subject: 'IPA', durationMinutes: 15 },
  { id: 'umum-demo', title: 'Tryout Kemampuan Skolastik Umum', level: 'Umum', grade: 'Umum', subject: 'Penalaran Umum', durationMinutes: 30 },
];

export const classes = [
  { id: 'demo', title: 'Matematika Persiapan Kelas 12', level: 'SMA', grade: 12, teacherId: 'teacher-demo' },
  { id: 'smp-class', title: 'Bimbel Intensif Matematika SMP', level: 'SMP', grade: 9, teacherId: 'teacher-demo' },
  { id: 'sd-class', title: 'Bimbel Berhitung & Calistung SD', level: 'SD', grade: 6, teacherId: 'teacher-demo' },
];

export const questions = [
  { id: 'question-demo', tryoutId: 'demo', prompt: 'Jika 2x + 4 = 10, berapakah nilai x?', options: ['2', '3', '4', '5'], correctIndex: 1, weight: 1, explanation: '2x = 10 - 4 = 6, sehingga x = 3.' },
];

export const assignments = [
  { id: 'demo', classId: 'demo', title: 'Latihan persamaan linear', instructions: 'Jelaskan langkah menyelesaikan persamaan 2x + 4 = 10.' },
];

export const leaderboards = {
  SMA: [
    { rank: 1, name: 'Aditya Pratama', score: 96, school: 'SMA Titik Terampil' },
    { rank: 2, name: 'Siti Rahmawati', score: 92, school: 'SMA Negeri 1' },
    { rank: 3, name: 'Budi Santoso', score: 88, school: 'SMA Titik Terampil' },
    { rank: 4, name: 'Rizky Pratama', score: 85, school: 'Peserta Mandiri' },
    { rank: 5, name: 'Dewi Lestari', score: 82, school: 'SMA Negeri 3' },
  ],
  SMP: [
    { rank: 1, name: 'Farhan Maulana', score: 94, school: 'SMP Titik Terampil' },
    { rank: 2, name: 'Aisyah Putri', score: 90, school: 'SMP Negeri 2' },
    { rank: 3, name: 'Rian Hidayat', score: 86, school: 'Peserta Mandiri' },
  ],
  SD: [
    { rank: 1, name: 'Nadia Salsabila', score: 95, school: 'SD Titik Terampil' },
    { rank: 2, name: 'Kevin Wijaya', score: 91, school: 'SD Unggulan' },
    { rank: 3, name: 'Ahmad Faiz', score: 87, school: 'Peserta Mandiri' },
  ],
  Umum: [
    { rank: 1, name: 'Bambang Irawan', score: 98, school: 'Alumni / Gap Year' },
    { rank: 2, name: 'Rina Anggraini', score: 93, school: 'Peserta Umum' },
  ],
};

/**
 * Mencari satu record pada koleksi data contoh tanpa mengubah isinya.
 * @param {Array<Object>} collection - Koleksi dengan field id berupa string.
 * @param {string} id - ID record yang diminta.
 * @returns {Object|null} Record ditemukan atau null bila input/ID tidak tersedia.
 */
export function getRecord(collection, id) {
  if (!Array.isArray(collection) || typeof id !== 'string') return null;
  const record = collection.find((item) => item?.id === id) ?? null;
  return record;
}
