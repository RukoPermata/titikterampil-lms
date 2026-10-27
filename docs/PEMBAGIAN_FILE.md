<!--
Modul: Pembagian tanggung jawab file frontend MVP
Author: Tim Titik Terampil; koordinator Kaisar dan Rayazka
Tanggung jawab: mencatat kepemilikan halaman, fungsi modul dan file bersama.
@todo: Perbarui tabel saat file baru ditambahkan dan validasi kompleksitas untuk COTS.
-->
# Pembagian file frontend Titik Terampil

Mengikuti revisi terbaru: P08–P09 milik Fauzan, P14 milik Kaisar, Hilmy fokus P16–P17. Nama menunjukkan penanggung jawab pengembangan; seluruh file masih berupa kerangka dan TODO, bukan bukti kontribusi selesai.

## Halaman utama

| ID | Nama lengkap dan NIM | Halaman | File yang dikembangkan | Target pengerjaan |
|---|---|---|---|---|
| P01 | Kaisar Rayfa Al Baihaqqi (103022400110) | Beranda | app/page.js | Lengkapi informasi program dan identitas visual setelah validasi klien. |
| P02 | Kaisar Rayfa Al Baihaqqi (103022400110) | Masuk | app/login/page.js | Tambahkan validasi kredensial dan hubungkan autentikasi saat backend tersedia. |
| P03 | Kaisar Rayfa Al Baihaqqi (103022400110) | Daftar | app/register/page.js | Buat form nama, email, sandi, jenjang dan tingkat kelas beserta validasinya. |
| P04 | Kaisar Rayfa Al Baihaqqi (103022400110) | Dashboard siswa | app/student/dashboard/page.js | Tampilkan kelas terdaftar, jadwal ujian dan ringkasan nilai siswa aktif. |
| P05 | Fauzan Zulfa Muhammad (103022400032) | Katalog tryout | app/student/tryouts/page.js | Tambahkan filter jenjang, tingkat kelas, mata pelajaran dan pencarian. |
| P06 | Fauzan Zulfa Muhammad (103022400032) | Detail tryout | [app/student/tryouts/[id]/page.js](D:/Project/TitikTerampil/titikterampil-lms/app/student/tryouts/[id]/page.js) | Validasi akses paket dan tampilkan konfirmasi sebelum mulai ujian. |
| P07 | Fauzan Zulfa Muhammad (103022400032) | Ruang ujian | [app/student/exams/[id]/page.js](D:/Project/TitikTerampil/titikterampil-lms/app/student/exams/[id]/page.js) | Implementasikan timer berbasis deadline, autosave, penandaan dan submit idempoten. |
| P08 | Fauzan Zulfa Muhammad (103022400032) | Hasil dan pembahasan | [app/student/results/[id]/page.js](D:/Project/TitikTerampil/titikterampil-lms/app/student/results/[id]/page.js) | Tampilkan hasil percobaan yang sesuai ID serta pembahasan setiap soal. |
| P09 | Fauzan Zulfa Muhammad (103022400032) | Riwayat tryout | app/student/history/page.js | Hubungkan hasil submit CBT dan tambahkan filter riwayat. |
| P10 | Fityah Bayoediansyah Harahap (103022400085) | Kelas belajar | app/student/classes/page.js | Filter kelas sesuai siswa aktif dan tampilkan status keanggotaan. |
| P11 | Fityah Bayoediansyah Harahap (103022400085) | Materi kelas | [app/student/classes/[id]/page.js](D:/Project/TitikTerampil/titikterampil-lms/app/student/classes/[id]/page.js) | Buat pembaca teks, dokumen dan tautan video eksternal. |
| P12 | Fityah Bayoediansyah Harahap (103022400085) | Tugas siswa | [app/student/assignments/[id]/page.js](D:/Project/TitikTerampil/titikterampil-lms/app/student/assignments/[id]/page.js) | Implementasikan jawaban teks, tenggat, validasi dan status pengumpulan. |
| P13 | Kaisar Rayfa Al Baihaqqi (103022400110) | Profil siswa | app/student/profile/page.js | Buat form edit profil dengan validasi konsistensi jenjang dan tingkat kelas. |
| P14 | Kaisar Rayfa Al Baihaqqi (103022400110) | Dashboard pengajar | app/teacher/dashboard/page.js | Hitung ringkasan dari kelas yang ditugaskan kepada pengajar aktif. |
| P15 | Fityah Bayoediansyah Harahap (103022400085) | Kelola materi | app/teacher/materials/page.js | Buat form tambah, edit dan hapus materi sesuai kelas pengajar. |
| P16 | Hilmy Rafi (103022400061) | Tugas dan penilaian | app/teacher/assignments/page.js | Buat CRUD tugas dan form penilaian dengan batas nilai yang valid. |
| P17 | Hilmy Rafi (103022400061) | Monitoring siswa | app/teacher/results/page.js | Tampilkan hasil berdasarkan kelas pengajar dan filter peserta. |
| P18 | Rayazka Aris (103022400096) | Dashboard admin | app/admin/dashboard/page.js | Hitung statistik pengguna, kelas dan aktivitas dari sumber data bersama. |
| P19 | Rayazka Aris (103022400096) | Manajemen pengguna | app/admin/users/page.js | Buat CRUD pengguna, validasi email unik dan pengaturan peran. |
| P20 | Rayazka Aris (103022400096) | Struktur akademik | app/admin/academics/page.js | Buat CRUD mata pelajaran dan validasi relasi kelas 1–12 dengan jenjang. |
| P21 | Rayazka Aris (103022400096) | Manajemen kelas | app/admin/classes/page.js | Buat CRUD kelas serta penempatan siswa dan pengajar. |
| P22 | Farrel Irham Adzkaar Susanto (103022400105) | Bank soal | app/admin/questions/page.js | Buat CRUD soal, opsi jawaban, kunci, bobot dan pembahasan. |
| P23 | Farrel Irham Adzkaar Susanto (103022400105) | Manajemen tryout | app/admin/tryouts/page.js | Buat CRUD paket, pemilihan soal dan validasi rentang jadwal. |
| P24 | Farrel Irham Adzkaar Susanto (103022400105) | Laporan dan rekap | app/admin/reports/page.js | Buat filter jenjang, kelas, paket dan rentang tanggal; ekspor di luar MVP. |

## Fungsi modul

Selain halaman, setiap anggota mengembangkan fungsi pada file berikut. Komponen tambahan untuk modulnya boleh dibuat di folder fitur yang sama.

| Nama lengkap | File | Fungsi utama yang dikembangkan |
|---|---|---|
| Kaisar Rayfa Al Baihaqqi | src/features/auth/actions.js | `validateRegistration()`, `updateProfile()`, `getTeacherSummary()` |
| Fauzan Zulfa Muhammad | src/features/cbt/actions.js | `filterTryouts()`, `startAttempt()`, `saveAnswer()`, `submitAttempt()`, `getAttemptReview()`, `getStudentHistory()` |
| Fityah Bayoediansyah Harahap | src/features/learning/actions.js | `getClassMaterials()`, `saveMaterial()`, `submitAssignment()` |
| Rayazka Aris | src/features/academic/actions.js | `saveUser()`, `saveAcademicStructure()`, `assignClassMembers()` |
| Farrel Irham Adzkaar Susanto | src/features/tryout-management/actions.js | `saveQuestion()`, `saveTryoutPackage()`, `buildReport()` |
| Hilmy Rafi | src/features/evaluation/actions.js | `saveAssignment()`, `gradeSubmission()`, `getStudentMonitoring()` |

## Komponen, layout dan file bersama

Koordinator bertanggung jawab menggabungkan perubahan. Anggota lain berkoordinasi sebelum mengubah kontrak atau komponen yang dipakai lintas modul.

| Penanggung jawab / koordinator | File | Pekerjaan |
|---|---|---|
| Kaisar Rayfa Al Baihaqqi | src/components/Landing.js | Konten dan tampilan landing P01. |
| Kaisar Rayfa Al Baihaqqi | src/components/DemoLogin.js | Form login P02 dan navigasi setelah masuk. |
| Kaisar Rayfa Al Baihaqqi | src/components/DemoProvider.js | State sesi frontend dan keluar dari demo. |
| Kaisar Rayfa Al Baihaqqi | src/components/DashboardShell.js | Navigasi dan guard tampilan tiga peran; koordinasi dengan pemilik modul. |
| Kaisar Rayfa Al Baihaqqi | app/layout.js | Provider global, metadata dan bahasa aplikasi. |
| Kaisar Rayfa Al Baihaqqi | app/student/layout.js | Layout siswa. |
| Kaisar Rayfa Al Baihaqqi | app/teacher/layout.js | Layout pengajar; dipakai bersama Fityah dan Hilmy. |
| Kaisar Rayfa Al Baihaqqi | app/not-found.js | Tampilan halaman tidak ditemukan. |
| Rayazka Aris | app/admin/layout.js | Layout admin; dipakai bersama Farrel. |
| Tim; koordinator Kaisar dan Rayazka | src/components/ModulePage.js | Pratinjau kerangka bersama; tiap anggota mengganti pemakaiannya di halaman miliknya dengan komponen modul sebenarnya. |
| Tim; koordinator Kaisar dan Rayazka | src/config/pages.js | Peta route, pemilik halaman dan TODO; sinkronkan ketika navigasi berubah. |
| Tim; koordinator Rayazka Aris | src/data/mock.js | Kontrak dan data contoh; tiap anggota menambah entitas modulnya dengan koordinasi. |
| Tim; koordinator Kaisar dan Rayazka | app/globals.css | Token, layout responsif dan gaya bersama. |
| Tim; koordinator Kaisar dan Rayazka | next.config.mjs | Konfigurasi frontend; ubah hanya bila diperlukan. |
| Tim; koordinator Kaisar dan Rayazka | README.md | Panduan menjalankan, status fitur dan pengumpulan COTS. |
| Tim; koordinator Kaisar dan Rayazka | docs/DEVELOPMENT.md | Kontrak integrasi, dependensi dan skenario verifikasi. |
| Tim; koordinator Kaisar dan Rayazka | docs/PEMBAGIAN_FILE.md | Tabel kepemilikan file ini. |

## File pendukung

`package.json`, `package-lock.json`, `jsconfig.json`, `eslint.config.mjs`, dan `.gitignore` dikelola bersama saat diperlukan. Jangan mengedit lockfile secara manual. File backend bawaan (`app/index.js`, `app/db/schema/users.js`, `drizzle.config.js`, `example.env`, `Dockerfile`, `compose.yml`) belum menjadi tugas frontend MVP. Aset `public/` dikelola pemilik UI yang memakainya; logo dan ikon resmi menunggu aset klien.

## Batas tanggung jawab lintas modul

- Fauzan: pengerjaan CBT, penilaian otomatis, hasil individual, pembahasan dan riwayat.
- Farrel: soal/paket dan laporan agregat; menggunakan hasil CBT dari Fauzan.
- Fityah: materi dan pengumpulan tugas dari sisi siswa.
- Hilmy: pembuatan tugas, penilaian pengumpulan dan monitoring dari sisi pengajar.
- Kaisar: dashboard pengajar menggunakan data monitoring Hilmy.
- Rayazka: data akademik, akun serta relasi kelas yang dipakai seluruh modul.

Untuk kontribusi COTS, setiap anggota menjelaskan halaman, fungsi, validasi dan alur yang benar-benar dikerjakannya. Pembagian ini menjadi baseline kerja; kompleksitas fitur dan CRUD tetap perlu dievaluasi bersama.

Panduan komentar dan skeleton fungsi: docs/SKELETON_GUIDE.md. Pengujian batas input: tests/frontend-skeleton.test.mjs (koordinator Kaisar dan Rayazka).



Implementasi P19 untuk latihan COTS kini berada seluruhnya di app/admin/users/page.js: data contoh, state, validasi, CRUD localStorage, form, tabel dan CSS lokal. Pencarian, filter, pagination dan modal kustom tidak menjadi fokus latihan. Lihat docs/P19_MANAGEMENT_GUIDE.md untuk urutan membangun ulang kode.
