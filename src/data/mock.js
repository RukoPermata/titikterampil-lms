/**
 * Modul: Kontrak data contoh frontend terpadu
 * @author Tim Titik Terampil; koordinator integrasi: Kaisar dan Rayazka
 * Tanggung jawab: menyediakan data contoh statis lengkap untuk keperluan demo frontend UTS seluruh anggota tim.
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
  {
    id: 'demo',
    title: 'Tryout Matematika SMA',
    level: 'SMA',
    grade: 12,
    subject: 'Matematika',
    durationMinutes: 30,
    price: 35000,
    isFree: false,
    questionCount: 20,
    subtests: [
      { id: 'sub-1', title: 'Aljabar dan Fungsi', durationMinutes: 15, questionCount: 10 },
      { id: 'sub-2', title: 'Geometri dan Trigonometri', durationMinutes: 15, questionCount: 10 },
    ],
  },
  {
    id: 'utbk-snbt',
    title: 'Simulasi UTBK-SNBT Potensi Kognitif',
    level: 'SMA',
    grade: 'Gap Year',
    subject: 'TPS & Literasi',
    durationMinutes: 45,
    price: 50000,
    isFree: false,
    questionCount: 30,
    subtests: [
      { id: 'tps-1', title: 'Kemampuan Penalaran Umum', durationMinutes: 20, questionCount: 15 },
      { id: 'tps-2', title: 'Pengetahuan Kuantitatif', durationMinutes: 25, questionCount: 15 },
    ],
  },
  {
    id: 'smp-demo',
    title: 'Latihan Matematika SMP',
    level: 'SMP',
    grade: 9,
    subject: 'Matematika',
    durationMinutes: 20,
    price: 0,
    isFree: true,
    questionCount: 15,
  },
  {
    id: 'smp-bahasa',
    title: 'Pemahaman Bahasa Indonesia SMP',
    level: 'SMP',
    grade: 8,
    subject: 'Bahasa Indonesia',
    durationMinutes: 20,
    price: 25000,
    isFree: false,
    questionCount: 20,
  },
  {
    id: 'sd-demo',
    title: 'Latihan Matematika SD',
    level: 'SD',
    grade: 6,
    subject: 'Matematika',
    durationMinutes: 15,
    price: 0,
    isFree: true,
    questionCount: 10,
  },
  {
    id: 'sd-ipa',
    title: 'Latihan Sains & IPA Dasar SD',
    level: 'SD',
    grade: 5,
    subject: 'IPA',
    durationMinutes: 15,
    price: 20000,
    isFree: false,
    questionCount: 15,
  },
  {
    id: 'umum-demo',
    title: 'Tryout Kemampuan Skolastik Umum',
    level: 'Umum',
    grade: 'Umum',
    subject: 'Penalaran Umum',
    durationMinutes: 30,
    price: 30000,
    isFree: false,
    questionCount: 25,
  },
];

export const questions = [
  {
    id: 'q-single-1',
    tryoutId: 'demo',
    type: 'single_choice',
    prompt: 'Jika 2x + 4 = 10, berapakah nilai x?',
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    weight: 1,
    explanation: '2x = 10 - 4 = 6, sehingga x = 3.',
  },
  {
    id: 'q-multi-1',
    tryoutId: 'demo',
    type: 'multiple_choice',
    prompt: 'Manakah dari pernyataan berikut yang merupakan bilangan prima? (Pilih semua yang benar)',
    options: ['2', '4', '7', '9'],
    correctIndices: [0, 2],
    weight: 2,
    explanation: '2 dan 7 adalah bilangan prima karena hanya memiliki dua faktor pembagi.',
  },
  {
    id: 'q-truefalse-1',
    tryoutId: 'demo',
    type: 'true_false',
    prompt: 'Sudut siku-siku memiliki besar sudut tepat 90 derajat.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
    weight: 1,
    explanation: 'Definisi matematis sudut siku-siku adalah tepat 90 derajat.',
  },
  {
    id: 'q-short-1',
    tryoutId: 'demo',
    type: 'short_answer',
    prompt: 'Berapakah akar kuadrat positif dari bilangan 144?',
    correctAnswer: '12',
    weight: 1,
    explanation: '12 x 12 = 144, sehingga akar dari 144 adalah 12.',
  },
  {
    id: 'q-essay-1',
    tryoutId: 'demo',
    type: 'essay',
    prompt: 'Jelaskan langkah demi langkah menyelesaikan sistem persamaan linear dua variabel menggunakan metode eliminasi.',
    maxScore: 20,
    rubric: 'Penyebutan konsep (5 poin), langkah eliminasi (10 poin), kesimpulan jawaban (5 poin).',
    explanation: 'Samakan koefisien salah satu variabel, eliminasi variabel tersebut, lalu substitusi nilai ke persamaan awal.',
  },
];

export const vouchers = [
  {
    id: 'v-01',
    code: 'TRYOUTGRATIS',
    title: 'Voucher Promo Bulanan Gratis',
    quota: 100,
    usedCount: 24,
    validUntil: '2026-12-31',
    applicablePackages: ['demo', 'smp-demo', 'sd-demo', 'utbk-snbt'],
    status: 'Aktif',
  },
  {
    id: 'v-02',
    code: 'BIMBELMEMBER',
    title: 'Akses Eksklusif Siswa Bimbel',
    quota: 50,
    usedCount: 18,
    validUntil: '2026-12-31',
    applicablePackages: ['all'],
    status: 'Aktif',
  },
  {
    id: 'v-03',
    code: 'SNBT2026',
    title: 'Potongan Khusus Simulasi UTBK',
    quota: 30,
    usedCount: 30,
    validUntil: '2026-11-15',
    applicablePackages: ['utbk-snbt'],
    status: 'Habis',
  },
];

export const transactions = [
  {
    id: 'trx-001',
    studentName: 'Budi Santoso',
    packageTitle: 'Tryout Matematika SMA',
    amount: 35000,
    paymentMethod: 'GoPay / QRIS',
    status: 'Berhasil',
    date: '2026-10-31 10:14',
  },
  {
    id: 'trx-002',
    studentName: 'Siti Rahmawati',
    packageTitle: 'Simulasi UTBK-SNBT Potensi Kognitif',
    amount: 50000,
    paymentMethod: 'BCA Virtual Account',
    status: 'Berhasil',
    date: '2026-10-31 11:30',
  },
  {
    id: 'trx-003',
    studentName: 'Rian Hidayat',
    packageTitle: 'Pemahaman Bahasa Indonesia SMP',
    amount: 25000,
    paymentMethod: 'Mandiri Bill',
    status: 'Menunggu',
    date: '2026-11-01 08:00',
  },
  {
    id: 'trx-004',
    studentName: 'Kevin Wijaya',
    packageTitle: 'Latihan Sains & IPA Dasar SD',
    amount: 20000,
    paymentMethod: 'ShopeePay',
    status: 'Kedaluwarsa',
    date: '2026-10-29 16:45',
  },
];

export const submissions = [
  {
    id: 'sub-01',
    studentName: 'Budi Santoso',
    packageName: 'Tryout Matematika SMA - Paket 1',
    submittedAt: '2026-10-30 14:20',
    score: null,
    status: 'Perlu Dinilai',
    essayPrompt: 'Jelaskan langkah menyelesaikan persamaan 2x + 4 = 10 dan tentukan nilai x.',
    essayAnswer: 'Langkah pertama kurangkan 4 dari kedua sisi menjadi 2x = 6. Kemudian bagi kedua sisi dengan 2, sehingga didapatkan x = 3.',
    maxScore: 20,
  },
  {
    id: 'sub-02',
    studentName: 'Siti Rahmawati',
    packageName: 'Simulasi UTBK-SNBT Skolastik',
    submittedAt: '2026-10-31 09:15',
    score: 18,
    status: 'Selesai',
    essayPrompt: 'Uraikan argumen utama mengenai dampak kecerdasan buatan pada dunia pendidikan.',
    essayAnswer: 'Dampak AI mencakup personalisasi belajar dan efisiensi evaluasi, namun perlu pengawasan etis dan integritas akademik.',
    feedback: 'Penjelasan terstruktur, argumen kuat dan komprehensif.',
    maxScore: 20,
  },
];

export const classes = [
  { id: 'demo', title: 'Matematika Persiapan Kelas 12', level: 'SMA', grade: 12, teacherId: 'teacher-demo' },
  { id: 'smp-class', title: 'Bimbel Intensif Matematika SMP', level: 'SMP', grade: 9, teacherId: 'teacher-demo' },
  { id: 'sd-class', title: 'Bimbel Berhitung & Calistung SD', level: 'SD', grade: 6, teacherId: 'teacher-demo' },
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
