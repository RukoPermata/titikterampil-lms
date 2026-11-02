/**
 * Modul: Peta 24 halaman dan pemilik modul
 * @author Tim Titik Terampil; koordinator integrasi: Kaisar dan Rayazka
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Sinkronkan perubahan route bersama semua pemilik modul.
 */
export const pages = [
  {
    "id": "P01",
    "route": "/",
    "title": "Beranda",
    "owner": "Kaisar Rayfa Al Baihaqqi (103022400110)",
    "component": "LandingPage",
    "description": "Memperkenalkan layanan belajar dan tryout SD, SMP, SMA.",
    "todo": "Lengkapi informasi program dan identitas visual setelah validasi klien.",
    "role": "public"
  },
  {
    "id": "P02",
    "route": "/login",
    "title": "Masuk",
    "owner": "Kaisar Rayfa Al Baihaqqi (103022400110)",
    "component": "LoginPage",
    "description": "Pilih peran untuk mencoba navigasi frontend.",
    "todo": "Tambahkan validasi kredensial dan hubungkan autentikasi saat backend tersedia.",
    "role": "login"
  },
  {
    "id": "P03",
    "route": "/register",
    "title": "Daftar",
    "owner": "Kaisar Rayfa Al Baihaqqi (103022400110)",
    "component": "RegisterPage",
    "description": "Pendaftaran siswa baru.",
    "todo": "Buat form nama, email, sandi, jenjang dan tingkat kelas beserta validasinya.",
    "role": "register"
  },
  {
    "id": "P04",
    "route": "/student/dashboard",
    "title": "Dashboard siswa",
    "owner": "Kaisar Rayfa Al Baihaqqi (103022400110)",
    "component": "StudentDashboardPage",
    "description": "Ringkasan kegiatan belajar dan tryout siswa.",
    "todo": "Tampilkan kelas terdaftar, jadwal ujian dan ringkasan nilai siswa aktif.",
    "role": "student"
  },
  {
    "id": "P05",
    "route": "/student/tryouts",
    "title": "Katalog tryout",
    "owner": "Fauzan Zulfa Muhammad (103022400032)",
    "component": "TryoutCatalogPage",
    "description": "Katalog paket dengan filter jenjang, kelas, mapel, pencarian, dan status akses.",
    "todo": "Sinkronkan status publikasi paket dengan backend saat tersedia.",
    "role": "student"
  },
  {
    "id": "P06",
    "route": "/student/tryouts/[id]",
    "title": "Detail tryout",
    "owner": "Fauzan Zulfa Muhammad (103022400032)",
    "component": "TryoutDetailPage",
    "description": "Detail paket, subtes, harga, penukaran voucher, dan gerbang akses.",
    "todo": "Hubungkan pembayaran ke modul checkout ketika halaman P09 tersedia.",
    "role": "student"
  },
  {
    "id": "P07",
    "route": "/student/exams/[id]",
    "title": "Ruang ujian",
    "owner": "Fauzan Zulfa Muhammad (103022400032)",
    "component": "ExamPage",
    "description": "Ruang ujian lima tipe soal dengan timer, autosave, navigasi, dan submit idempoten.",
    "todo": "Pindahkan penyimpanan attempt dan penilaian ke server saat backend siap.",
    "role": "student"
  },
  {
    "id": "P26",
    "route": "/student/exams/[id]/instructions",
    "title": "Petunjuk ujian",
    "owner": "Fauzan Zulfa Muhammad (103022400032)",
    "component": "ExamInstructionsPage",
    "description": "Konfirmasi aturan dan tombol mulai sebelum attempt dibuat.",
    "todo": "Sinkronkan pemeriksaan akses paket dengan backend.",
    "role": "student"
  },
  {
    "id": "P08",
    "route": "/student/results/[id]",
    "title": "Hasil dan pembahasan",
    "owner": "Fauzan Zulfa Muhammad (103022400032)",
    "component": "ResultPage",
    "description": "Skor objektif, status pending esai, dan pembahasan setiap soal.",
    "todo": "Tampilkan nilai esai dari pengajar setelah penilaian backend tersedia.",
    "role": "student"
  },
  {
    "id": "P09",
    "route": "/student/history",
    "title": "Riwayat tryout",
    "owner": "Fauzan Zulfa Muhammad (103022400032)",
    "component": "HistoryPage",
    "description": "Riwayat attempt aktif dan selesai dengan filter paket serta status.",
    "todo": "Ganti sumber localStorage dengan API riwayat peserta.",
    "role": "student"
  },
  {
    "id": "P25",
    "route": "/student/leaderboard",
    "title": "Leaderboard",
    "owner": "Fauzan Zulfa Muhammad (103022400032)",
    "component": "LeaderboardPage",
    "description": "Papan peringkat nilai terbaik peserta per jenjang.",
    "todo": "Hubungkan agregasi nilai final per paket ketika backend tersedia.",
    "role": "student"
  },
  {
    "id": "P11",
    "route": "/student/classes/[id]",
    "title": "Materi kelas",
    "owner": "Fityah Bayoediansyah Harahap (103022400085)",
    "component": "ClassDetailPage",
    "description": "Modul dan materi belajar dalam satu kelas.",
    "todo": "Buat pembaca teks, dokumen dan tautan video eksternal.",
    "role": "student"
  },
  {
    "id": "P12",
    "route": "/student/assignments/[id]",
    "title": "Tugas siswa",
    "owner": "Fityah Bayoediansyah Harahap (103022400085)",
    "component": "AssignmentPage",
    "description": "Petunjuk tugas, pengumpulan jawaban dan tampilan nilai.",
    "todo": "Implementasikan jawaban teks, tenggat, validasi dan status pengumpulan.",
    "role": "student"
  },
  {
    "id": "P13",
    "route": "/student/profile",
    "title": "Profil siswa",
    "owner": "Kaisar Rayfa Al Baihaqqi (103022400110)",
    "component": "ProfilePage",
    "description": "Identitas, jenjang dan tingkat kelas siswa.",
    "todo": "Buat form edit profil dengan validasi konsistensi jenjang dan tingkat kelas.",
    "role": "student"
  },
  {
    "id": "P14",
    "route": "/teacher/dashboard",
    "title": "Dashboard pengajar",
    "owner": "Kaisar Rayfa Al Baihaqqi (103022400110)",
    "component": "TeacherDashboardPage",
    "description": "Ringkasan kelas dan aktivitas pengajaran.",
    "todo": "Hitung ringkasan dari kelas yang ditugaskan kepada pengajar aktif.",
    "role": "teacher"
  },
  {
    "id": "P15",
    "route": "/admin/questions",
    "title": "Bank Soal",
    "owner": "Farrel Irham Adzkaar Susanto (103022400105)",
    "component": "QuestionsPage",
    "description": "Akses koleksi soal dan manajemen paket latihan tryout untuk pengajar.",
    "todo": "Sinkronkan akses pengajar ke bank soal admin.",
    "role": "teacher"
  },
  {
    "id": "P16",
    "route": "/teacher/grading",
    "title": "Daftar Penilaian Esai",
    "owner": "Hilmy Rafi (103022400061)",
    "component": "TeacherGradingPage",
    "description": "Tabel pengumpulan esai peserta dan antarmuka koreksi nilai.",
    "todo": "Hubungkan form koreksi dengan database nilai.",
    "role": "teacher"
  },
  {
    "id": "P17",
    "route": "/teacher/members",
    "title": "Pemberian Status Member",
    "owner": "Hilmy Rafi (103022400061)",
    "component": "TeacherMembersPage",
    "description": "Pencarian siswa dan aktivasi atau pencabutan status Member khusus bimbel.",
    "todo": "Mutasi database untuk update status Member.",
    "role": "teacher"
  },
  {
    "id": "P18",
    "route": "/admin/dashboard",
    "title": "Dashboard admin",
    "owner": "Rayazka Aris (103022400096)",
    "component": "AdminDashboardPage",
    "description": "Ringkasan administrasi platform Titik Terampil.",
    "todo": "Hitung statistik pengguna, kelas dan aktivitas dari sumber data bersama.",
    "role": "admin"
  },
  {
    "id": "P19",
    "route": "/admin/users",
    "title": "Manajemen pengguna",
    "owner": "Rayazka Aris (103022400096)",
    "component": "UsersPage",
    "description": "Pengelolaan akun siswa, pengajar dan admin.",
    "todo": "Buat CRUD pengguna, validasi email unik dan pengaturan peran.",
    "role": "admin"
  },
  {
    "id": "P20",
    "route": "/admin/academics",
    "title": "Struktur akademik",
    "owner": "Rayazka Aris (103022400096)",
    "component": "AcademicsPage",
    "description": "Jenjang, tingkat kelas dan mata pelajaran.",
    "todo": "Buat CRUD mata pelajaran dan validasi relasi kelas 1–12 dengan jenjang.",
    "role": "admin"
  },
  {
    "id": "P21",
    "route": "/admin/classes",
    "title": "Manajemen kelas",
    "owner": "Rayazka Aris (103022400096)",
    "component": "AdminClassesPage",
    "description": "Penempatan pengajar dan siswa dalam kelas.",
    "todo": "Buat CRUD kelas serta penempatan siswa dan pengajar.",
    "role": "admin"
  },
  {
    "id": "P22",
    "route": "/admin/questions",
    "title": "Bank soal",
    "owner": "Farrel Irham Adzkaar Susanto (103022400105)",
    "component": "QuestionsPage",
    "description": "Penyusunan soal pilihan ganda beserta pembahasannya.",
    "todo": "Buat CRUD soal, opsi jawaban, kunci, bobot dan pembahasan.",
    "role": "admin"
  },
  {
    "id": "P23",
    "route": "/admin/tryouts",
    "title": "Manajemen tryout",
    "owner": "Farrel Irham Adzkaar Susanto (103022400105)",
    "component": "AdminTryoutsPage",
    "description": "Paket soal, durasi dan jadwal tryout.",
    "todo": "Buat CRUD paket, pemilihan soal dan validasi rentang jadwal.",
    "role": "admin"
  },
  {
    "id": "P24",
    "route": "/admin/reports",
    "title": "Laporan dan rekap",
    "owner": "Farrel Irham Adzkaar Susanto (103022400105)",
    "component": "ReportsPage",
    "description": "Rekap hasil tryout dan aktivitas pembelajaran.",
    "todo": "Buat filter jenjang, kelas, paket dan rentang tanggal; ekspor di luar MVP.",
    "role": "admin"
  },
  {
    "id": "P25",
    "route": "/student/checkout/[id]",
    "title": "Checkout paket",
    "owner": "Fityah Bayoediansyah Harahap (103022400085)",
    "component": "StudentCheckoutPage",
    "description": "Ringkasan pesanan dan simulasi pembayaran paket tryout.",
    "todo": "Simulasi status menunggu, bayar berhasil, dan kedaluwarsa.",
    "role": "student"
  },
  {
    "id": "P26",
    "route": "/admin/vouchers",
    "title": "Manajemen voucher",
    "owner": "Fityah Bayoediansyah Harahap (103022400085)",
    "component": "AdminVouchersPage",
    "description": "Pengelolaan kode voucher promo try out dan statistik kuota.",
    "todo": "Form pembuatan voucher dan tabel voucher aktif beserta kuota.",
    "role": "admin"
  },
  {
    "id": "P27",
    "route": "/admin/transactions",
    "title": "Daftar transaksi",
    "owner": "Fityah Bayoediansyah Harahap (103022400085)",
    "component": "AdminTransactionsPage",
    "description": "Pemantauan riwayat transaksi pembelian paket seluruh peserta.",
    "todo": "Tabel rekapitulasi transaksi seluruh peserta beserta statusnya.",
    "role": "admin"
  }
];

/**
 * Mencari metadata berdasarkan ID halaman internal.
 * @param {string} id - ID P01 sampai P27.
 * @returns {Object|undefined} Metadata halaman atau undefined bila ID tidak dikenal.
 */
export function findPage(id) {
  // 1. Tolak parameter yang bukan ID string.
  if (typeof id !== 'string') return undefined;
  // 2. Cari satu sumber metadata agar pemilik dan route selalu konsisten.
  const page = pages.find((item) => item.id === id);
  // 3. TODO: Tambahkan pemetaan ID fitur untuk pelacakan kontribusi COTS.
  return page;
}

/**
 * Mengubah pola route dinamis menjadi alamat data demo.
 * @param {string} route - Pola route, misalnya /student/classes/[id].
 * @returns {string} Route contoh dengan ID demo; input tidak valid kembali ke beranda.
 */
export function demoHref(route) {
  // 1. Hindari pembentukan tautan dari nilai yang bukan string.
  if (typeof route !== 'string') return '/';
  // 2. Ganti parameter tunggal yang digunakan oleh kerangka saat ini.
  const href = route.replace('[id]', 'demo');
  // 3. TODO: Gunakan ID entitas aktif ketika navigasi berasal dari data modul.
  return href;
}