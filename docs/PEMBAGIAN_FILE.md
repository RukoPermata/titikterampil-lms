<!--
Modul: Pembagian tanggung jawab file frontend MVP Titik Terampil
Author: Tim Titik Terampil; koordinator integrasi Kaisar dan Rayazka
Tanggung jawab: mencatat arsitektur folder resmi, pemetaan 27 layar, dan checklist tugas UTS vs UAS.
-->
# Pembagian Tugas Tim: Titik Terampil (Frontend UTS & Roadmap UAS)

Dokumen ini merupakan panduan kerja resmi 6 anggota tim Titik Terampil berdasarkan PRD terbaru, arsitektur 27 layar, dan kesepakatan struktur folder `src/app/`.

---

## 1. Batasan Scope: UTS vs UAS

| Dimensi | Target UTS (Fokus Sekarang) | Target UAS (Fase Berikutnya) |
|---|---|---|
| **Fokus Utama** | **Murni Frontend & UI/UX Interaktif** | **Backend, Database, dan Integrasi Server** |
| **Karakteristik Data** | Data contoh statis (`src/data/mock.js`) dan browser storage (`sessionStorage` / `localStorage`) | Database relasional PostgreSQL via Drizzle ORM |
| **Autentikasi** | Simulasi login frontend, guard demo UI, dan form 2FA interaktif | Autentikasi server sungguhan, hashing password, pengiriman email OTP via SMTP |
| **Akses & Pembayaran** | UI katalog, penukaran voucher demo, dan simulasi status checkout | Integrasi SDK Midtrans produksi dan penanganan webhook payment |
| **Ruang Ujian CBT** | Engine timer frontend, autosave lokal, render 5 tipe soal, tampilan pembahasan | Penyimpanan sesi ujian di server, validasi anti-cheat, scoring server-side |
| **Penilaian Esai** | Form input koreksi nilai manual dan perubahan state skor lokal | Penyimpanan riwayat nilai pengajar dan sinkronisasi database |
| **Impor Soal** | Parser berkas CSV/Excel di browser dengan validasi kolom | Upload handler server, penyimpanan aset gambar soal ke object storage |

---

## 2. Struktur Folder Resmi Proyek (`src/app/`)

Mengikuti struktur resmi Next.js yang disepakati bersama:

```text
titikterampil-lms/
├── public/                                # Aset statis (logo, ikon, gambar ilustrasi)
├── docs/                                  # Dokumentasi proyek, PRD, dan panduan tim
│
├── src/
│   ├── app/                               # Routing, Halaman, dan Layout (Next.js App Router)
│   │   ├── globals.css                    # Token visual brand (#25B5A9), form, dan utilitas shell
│   │   ├── layout.jsx                     # Root layout, font, dan DemoProvider global
│   │   ├── not-found.jsx                  # Halaman 404
│   │   ├── page.jsx                       # [Layar 01] Landing Page
│   │   ├── api/                               # Endpoint Mock API (Fetch API UTS Poin 2.2)
│   │   │   ├── tryouts/route.js               # GET data tryout dinamis
│   │   │   ├── leaderboard/route.js           # GET data peringkat nilai
│   │   │   └── user/route.js                  # GET data profil pengguna
│   │   │
│   │   ├── (auth)/                        # Route Group Publik & Autentikasi
│   │   │   ├── login/page.jsx             # [Layar 02] Sign In
│   │   │   ├── register/page.jsx          # [Layar 03] Sign Up (+ WhatsApp)
│   │   │   └── verify-2fa/page.jsx        # [Layar 04] Verifikasi Kode Email 2FA
│   │   │
│   │   ├── student/                       # Ruang Kerja Peserta
│   │   │   ├── layout.jsx                 # Guard peran student
│   │   │   ├── onboarding/page.jsx        # [Layar 05] Personalisasi Awal
│   │   │   ├── dashboard/page.jsx         # [Layar 06] Dashboard Peserta (+ Leaderboard Widget)
│   │   │   ├── tryouts/
│   │   │   │   ├── page.jsx               # [Layar 07] Katalog Try Out (Filter Jenjang Eksklusif)
│   │   │   │   └── [id]/page.jsx          # [Layar 08] Detail Paket Try Out & Redeem Voucher
│   │   │   ├── checkout/[id]/page.jsx     # [Layar 09] Checkout & Status Pembayaran
│   │   │   ├── exam/[id]/
│   │   │   │   ├── instructions/page.jsx  # [Layar 10] Petunjuk Sebelum Ujian
│   │   │   │   └── page.jsx               # [Layar 11] Ruang Ujian CBT
│   │   │   ├── results/[id]/page.jsx      # [Layar 12] Hasil Skor & Pembahasan Tiap Soal
│   │   │   ├── history/page.jsx           # [Layar 13] Riwayat Try Out Peserta
│   │   │   ├── leaderboard/page.jsx       # [Layar 14] Halaman Leaderboard Antar Jenjang
│   │   │   └── profile/page.jsx           # [Layar 15] Profil Peserta (+ Target Prodi & Kesiapan)
│   │   │
│   │   ├── teacher/                       # Ruang Kerja Pengajar
│   │   │   ├── layout.jsx                 # Guard peran teacher
│   │   │   ├── dashboard/page.jsx         # [Layar 16] Dashboard Pengajar
│   │   │   ├── questions/page.jsx         # [Layar 17-18] Bank Soal & Form Tambah/Edit Soal
│   │   │   ├── grading/
│   │   │   │   ├── page.jsx               # [Layar 19] Daftar Penugasan Esai
│   │   │   │   └── [id]/page.jsx          # [Layar 20] Form Penilaian Esai Peserta
│   │   │   └── members/page.jsx           # [Layar 21] Daftar Siswa & Pemberian Status Member
│   │   │
│   │   └── admin/                         # Ruang Kerja Administrator
│   │       ├── layout.jsx                 # Guard peran admin
│   │       ├── dashboard/page.jsx         # [Layar 22] Dashboard Admin
│   │       ├── users/page.jsx             # [Layar 23] Manajemen Pengguna & Member
│   │       ├── packages/
│   │       │   ├── page.jsx               # [Layar 24] Manajemen Paket Try Out
│   │       │   └── editor/page.jsx        # [Layar 25] Form Tambah/Edit Paket & Subtes
│   │       ├── vouchers/page.jsx          # [Layar 26] Manajemen Kode Voucher
│   │       └── transactions/page.jsx      # [Layar 27] Pemantauan Daftar Transaksi
│   │
│   ├── components/                        # Komponen Bersama Lintas Fitur
│   │   ├── DashboardShell.jsx             # Sidebar navigasi peran, topbar, dan role-guard
│   │   ├── DemoProvider.jsx               # State sesi frontend, persistensi storage, Toast global
│   │   ├── Landing.jsx                    # Komponen halaman landing publik
│   │   └── ui/                            # Primitif UI (Button, Modal, Card, Tag)
│   │
│   ├── features/                          # Tampilan dan logika per fitur
│   │   ├── auth/                          # Fitur Akun & Autentikasi (PIC: Kaisar)
│   │   ├── student/                       # Fitur Khusus Peserta & Profil (PIC: Kaisar)
│   │   ├── cbt/                           # Fitur Ujian & Pembahasan (PIC: Fauzan)
│   │   ├── payment/                       # Fitur Akses & Transaksi (PIC: Fityah)
│   │   ├── questions/                     # Fitur Bank Soal, Paket & Impor (PIC: Farrel & Hilmy)
│   │   └── admin-management/              # Fitur Administrasi & Pengguna (PIC: Rayazka)
│   │
│   ├── data/
│   │   └── mock.js                        # Sumber data contoh frontend UTS (tryout, soal, user, kelas)
│   │
│   └── lib/                               # Fungsi utilitas pembantu (formatter, date, currency)
│
├── tests/
│   └── frontend-skeleton.test.mjs         # Pengujian otomatis aturan fungsi frontend
├── package.json
└── jsconfig.json
```

---

## 3. Matriks 27 Layar & Penanggung Jawab

| No | Kategori | Layar | Rute URL | PIC | Fokus UTS (UI/UX) |
|---|---|---|---|---|---|
| 01 | Publik | Landing Page | `/` | Kaisar Rayfa | Profil Bimbel Titik Terampil, promo try out gratis, tombol aksi login/daftar. |
| 02 | Publik | Sign In | `/login` | Kaisar Rayfa | Form login, show/hide password mata, validasi email/sandi, pengalihan 2FA. |
| 03 | Publik | Sign Up | `/register` | Kaisar Rayfa | Form pendaftaran, WhatsApp wajib, validasi sandi 8+simbol, opsi jenjang baru. |
| 04 | Publik | Verifikasi 2FA | `/verify-2fa` | Kaisar Rayfa | Input 6 digit OTP email, timer kirim ulang 60 detik, simulasi validasi kode. |
| 05 | Peserta | Personalisasi Awal | `/student/onboarding` | Kaisar Rayfa | Pemilihan jenjang, kelas, rumpun belajar, kesiapan, dan target 3 prodi PTN. |
| 06 | Peserta | Dashboard Peserta | `/student/dashboard` | Kaisar Rayfa | Filter eksklusif jenjang, kartu profil, status Member, Widget Leaderboard. |
| 07 | Peserta | Katalog Try Out | `/student/tryouts` | Fauzan Zulfa | Daftar paket sesuai jenjang (atau lintas jenjang jika Member), badge status akses. |
| 08 | Peserta | Detail Paket | `/student/tryouts/[id]` | Fauzan Zulfa | Info durasi/subtes/harga, form redeem voucher gratis, tombol beli/mulai. |
| 09 | Peserta | Checkout Pembayaran | `/student/checkout/[id]` | Fityah Bayoediansyah | Ringkasan pesanan, simulasi bayar, status menunggu/berhasil/gagal. |
| 10 | Peserta | Petunjuk Ujian | `/student/exam/[id]/instructions` | Fauzan Zulfa | Konfirmasi aturan waktu, ketentuan subtes, dan tombol mulai percobaan. |
| 11 | Peserta | Ruang Ujian CBT | `/student/exam/[id]` | Fauzan Zulfa | 5 tipe soal, timer subtes, autosave jawaban, navigasi nomor, dialog selesai. |
| 12 | Peserta | Hasil & Pembahasan | `/student/results/[id]` | Fauzan Zulfa | Skor pilihan ganda, status pending esai, pembahasan lengkap per nomor soal. |
| 13 | Peserta | Riwayat Try Out | `/student/history` | Fauzan Zulfa | Tabel riwayat percobaan ujian peserta, tanggal, nilai, dan tombol review. |
| 14 | Peserta | Leaderboard Penuh | `/student/leaderboard` | Fauzan Zulfa | Halaman papan peringkat per paket dan jenjang (nilai terbaik final). |
| 15 | Peserta | Profil Peserta | `/student/profile` | Kaisar Rayfa | Form data diri, nomor WhatsApp, target prodi, kesiapan, dan status Member. |
| 16 | Pengajar | Dashboard Pengajar | `/teacher/dashboard` | Hilmy Rafi | Statistik penugasan esai, soal dibuat, dan pintasan modul pengajar. |
| 17 | Pengajar & Admin | Bank Soal | `/admin/questions` | Farrel Irham | Tabel koleksi soal, filter mapel/jenjang, tombol tambah dan impor CSV/Excel. |
| 18 | Pengajar & Admin | Form Tambah/Edit Soal | `/admin/questions/editor` | Farrel Irham | Editor 5 jenis soal, kunci jawaban, bobot nilai, upload gambar, pembahasan. |
| 19 | Pengajar | Daftar Penilaian Esai | `/teacher/grading` | Hilmy Rafi | Tabel pengumpulan esai peserta yang perlu dinilai dan yang sudah selesai. |
| 20 | Pengajar | Form Koreksi Esai | `/teacher/grading/[id]` | Hilmy Rafi | UI koreksi esai siswa, rubrik penilaian, input nilai angka, catatan evaluasi. |
| 21 | Pengajar | Pemberian Member | `/teacher/members` | Hilmy Rafi | Pencarian siswa dan tombol aktivasi/pencabutan status Member khusus bimbel. |
| 22 | Admin | Dashboard Admin | `/admin/dashboard` | Rayazka Aris | Statistik eksekutif: total peserta, member aktif, paket terbit, estimasi transaksi. |
| 23 | Admin | Manajemen Pengguna | `/admin/users` | Rayazka Aris | Tabel CRUD pengguna, pengaturan role (Siswa/Guru/Admin), status Member. |
| 24 | Admin | Manajemen Paket | `/admin/packages` | Farrel Irham | Daftar paket tryout, harga, jenjang, status penerbitan (Draf/Terbit/Arsip). |
| 25 | Admin | Form Pengaturan Paket | `/admin/packages/editor` | Farrel Irham | Builder paket: susunan subtes, alokasi waktu per subtes, batas percobaan. |
| 26 | Admin | Manajemen Voucher | `/admin/vouchers` | Fityah Bayoediansyah | Form pembuatan kode voucher gratis (kuota, masa berlaku, paket yang dibuka). |
| 27 | Admin | Daftar Transaksi | `/admin/transactions` | Fityah Bayoediansyah | Pemantauan riwayat pembayaran paket seluruh peserta beserta statusnya. |

---

## 4. Checklist Rinci per Anggota (Target UTS vs Target UAS)

---

### 1. Kaisar Rayfa Al Baihaqqi (103022400110)
**Fokus Area**: Alur Publik, Autentikasi 2FA, Onboarding & Dashboard/Profil Peserta

#### Target UTS (Frontend UI/UX):
- [ ] **Layar 01 (Landing Page)**:
  - Hero banner memperkenalkan Bimbel Titik Terampil privat & umum.
  - Promosi Try Out Online Gratis Bulanan (*Free Monthly Tryout*).
  - Tampilan jangkauan jenjang: SD (kelas 4-6), SMP, SMA/SMK (kelas 10-12, Gap Year), Umum.
- [ ] **Layar 02 (Sign In)**:
  - Form login dengan toggle ikon mata dan sanitasi pesan error.
  - Opsi tombol login via Google.
  - Pengalihan ke halaman verifikasi 2FA setelah kredensial cocok.
- [ ] **Layar 03 (Sign Up)**:
  - Input Nama, Email, Password (min 8 karakter + simbol), Konfirmasi Password.
  - Input **Nomor WhatsApp\*** wajib diisi (dengan validasi angka Indonesia).
  - Pilihan jenjang baru: SD (4-6), SMP (7-9), SMA/SMK (10-12, Gap Year), Umum.
- [ ] **Layar 04 (Verifikasi 2FA)**:
  - Antarmuka input 6 digit OTP kode email.
  - Countdown timer kirim ulang kode (60 detik) dan validasi kode demo (misal: `123456`).
- [ ] **Layar 05 (Personalisasi Awal)**:
  - Form onboarding: jenjang, kelas, rumpun belajar, kesiapan (*Masih mencari arah*, *Cukup siap*, *Sangat siap*), dan target 3 prodi PTN (khusus SMA/Gap Year).
- [ ] **Layar 06 (Dashboard Peserta)**:
  - **Filter Eksklusif**: Paket latihan tryout otomatis terkunci hanya untuk jenjang siswa aktif.
  - Badge status Member (jika akun berstatus member).
  - **Widget Leaderboard**: Menampilkan 5 besar nilai tryout terbaik pada jenjang siswa.
- [ ] **Layar 15 (Profil Peserta)**:
  - Form ubah profil: WhatsApp, jenjang/kelas, target prodi, dan kesiapan belajar.
- [ ] **Komponen Bersama**:
  - `src/components/DemoProvider.js` (Sesi, Toast global melayang, persistensi storage).
  - `src/components/DashboardShell.js` (Sidebar, topbar, pelindung hidrasi SSR).
  - `src/app/globals.css` (Tema warna resmi Turquoise #25B5A9).

#### Target UAS (Backend & Integrasi):
- [ ] Integrasi PostgreSQL untuk tabel users, profiles, dan session tokens.
- [ ] Implementasi pengiriman OTP 2FA sungguhan ke email via SMTP / Resend API.
- [ ] Integrasi OAuth Google Sign-In backend.

---

### 2. Fauzan Zulfa Muhammad (103022400032)
**Fokus Area**: Engine Ujian CBT, Pengerjaan Soal, Hasil, Pembahasan & Leaderboard

#### Target UTS (Frontend UI/UX):
- [ ] **Layar 07 (Katalog Try Out)**:
  - Filter otomatis sesuai jenjang peserta (atau lintas jenjang untuk Member).
  - Tampilan kartu paket tryout: gratis, berbayar, atau butuh voucher.
- [ ] **Layar 08 (Detail Paket Try Out)**:
  - Penjelasan aturan ujian, durasi total / per subtes, form penukaran voucher gratis.
- [ ] **Layar 10 (Petunjuk Sebelum Ujian)**:
  - Aturan pengerjaan dan tombol eksplisit konfirmasi mulai ujian.
- [ ] **Layar 11 (Ruang Ujian CBT)**:
  - Tampilan **5 tipe soal**: pilihan tunggal, jamak, benar/salah, isian singkat, esai.
  - Dukungan gambar soal.
  - Timer ujian: timer paket atau **timer per subtes** (kunci jawaban saat waktu subtes habis).
  - Autosave jawaban lokal di browser dan pemulihan jika halaman ter-reload.
  - Navigasi nomor soal (status belum dijawab, sudah dijawab, ragu-ragu).
- [ ] **Layar 12 (Hasil dan Pembahasan)**:
  - Skor instan soal pilihan ganda, status menunggu penilaian esai, pembahasan kunci per nomor.
- [ ] **Layar 13 (Riwayat Try Out)**:
  - Tabel riwayat ujian peserta beserta tanggal, nilai, dan tombol review pembahasan.
- [ ] **Layar 14 (Leaderboard Penuh)**:
  - Halaman peringkat: filter paket tryout dan jenjang, menampilkan skor terbaik final.

#### Target UAS (Backend & Integrasi):
- [ ] Endpoint server untuk validasi waktu ujian anti-manipulasi perangkat.
- [ ] Algoritma penilaian otomatis dan kalkulasi skor akhir di server.
- [ ] Query database untuk agregasi leaderboard nilai terbaik per jenjang.

---

### 3. Fityah Bayoediansyah Harahap (103022400085)
**Fokus Area**: Transaksi Pembelian Paket, Manajemen Voucher & Pembayaran

#### Target UTS (Frontend UI/UX):
- [ ] **Layar 09 (Checkout dan Status Pembayaran)**:
  - Ringkasan pembelian paket tryout, rincian harga.
  - Simulasi pembayaran dummy (tombol simulasi bayar sukses/gagal untuk demonstrasi demo).
  - Tampilan status pesanan: Menunggu Pembayaran, Berhasil, Kedaluwarsa.
- [ ] **Layar 26 (Manajemen Voucher - Admin)**:
  - Form pembuatan kode voucher: kode, kuota pemakaian, masa berlaku, paket yang dicakup.
  - Tabel daftar voucher aktif beserta statistik penukaran.
- [ ] **Layar 27 (Daftar Transaksi - Admin)**:
  - Tabel rekapitulasi transaksi seluruh peserta: nama peserta, paket, nominal, status, tanggal.

#### Target UAS (Backend & Integrasi):
- [ ] Integrasi SDK Midtrans Snap / Payment Gateway produksi.
- [ ] Endpoint backend untuk menerima webhook notifikasi pembayaran dari Midtrans.
- [ ] Validasi kuota dan masa berlaku voucher pada database secara atomik.

---

### 4. Hilmy Rafi (103022400061)
**Fokus Area**: Ruang Kerja Pengajar, Penilaian Manual Esai & Hak Akses Member

#### Target UTS (Frontend UI/UX):
- [ ] **Layar 16 (Dashboard Pengajar)**:
  - Statistik penugasan pengajar: esai menunggu koreksi, soal diampu, kelas binaan.
  - Pintasan ke halaman penilaian esai dan bank soal.
- [ ] **Layar 19 (Daftar Penilaian Esai)**:
  - Tabel daftar pengumpulan esai peserta: nama peserta, paket tryout, tanggal submit, status penilaian.
- [ ] **Layar 20 (Form Penilaian Esai Peserta)**:
  - Antarmuka koreksi: menampilkan jawaban esai siswa berdampingan dengan rubrik penilaian.
  - Form input nilai angka (0 sampai batas bobot maksimal) dan catatan umpan balik.
  - Tombol simpan nilai: mengubah status nilai siswa dari sementara menjadi final.
- [ ] **Layar 21 (Daftar Siswa & Pemberian Status Member)**:
  - Pencarian akun peserta dan tombol aktivasi/pencabutan status **Member**.

#### Target UAS (Backend & Integrasi):
- [ ] Endpoint penyimpanan nilai esai ke database PostgreSQL.
- [ ] Mutasi database untuk update status Member dan pencatatan audit log pengajar.

---

### 5. Farrel Irham Adzkaar Susanto (103022400105)
**Fokus Area**: Bank Soal, Pembuatan Paket Try Out & Impor Massal CSV/Excel

#### Target UTS (Frontend UI/UX):
- [ ] **Layar 17 (Bank Soal - Pengajar & Admin)**:
  - Tabel koleksi bank soal: filter jenjang (SD 4-6, SMP, SMA/Gap Year, Umum), mapel, tipe soal.
  - Tombol Tambah Soal Manual dan tombol **Impor CSV/Excel**.
- [ ] **Layar 18 (Form Tambah/Edit Soal)**:
  - Form penyusunan 5 tipe soal, opsi jawaban, kunci jawaban, bobot nilai, upload/preview gambar, dan teks pembahasan.
- [ ] **Layar 24 (Manajemen Paket Try Out - Admin)**:
  - Daftar paket tryout: nama paket, jenjang, kategori, status (Draf/Terbit/Arsip), harga, tombol aksi.
- [ ] **Layar 25 (Form Tambah/Edit Paket - Admin)**:
  - Builder paket: pemilihan soal dari bank soal, urutan subtes, aturan timer per subtes, batas retry.
- [ ] **Fitur Impor Soal CSV/Excel**:
  - Modal upload berkas CSV/Excel di browser.
  - Parser data tabel dengan validasi format kolom dan laporan baris yang gagal sebelum disimpan.

#### Target UAS (Backend & Integrasi):
- [ ] Parser file upload multipart di backend dan penyimpanan aset gambar ke object storage.
- [ ] Relasi database relasional antara tabel packages, subtests, dan questions.

---

### 6. Rayazka Aris (103022400096)
**Fokus Area**: Dashboard Administrator, Manajemen Pengguna & Arsitektur Data Bersama

#### Target UTS (Frontend UI/UX):
- [ ] **Layar 22 (Dashboard Admin)**:
  - Tampilan statistik eksekutif: total peserta, member aktif, paket tryout terbit, estimasi transaksi.
- [ ] **Layar 23 (Manajemen Pengguna & Member - Admin)**:
  - Tabel CRUD pengguna lengkap: filter role (Siswa/Guru/Admin), toggle status Member, detail akun, reset sandi.
- [ ] **Arsitektur Data & Model Bersama**:
  - Mengelola `src/data/mock.js` terpadu untuk menyuplai data contoh ke-27 layar.
  - Menetapkan struktur data akademik: SD (4-6), SMP (7-9), SMA/SMK (10-12, Gap Year), Umum.
  - Mengawal penerapan struktur folder `src/app/` di branch utama `dev`.

#### Target UAS (Backend & Integrasi):
- [ ] Desain skema database PostgreSQL (Drizzle ORM) dan pembuatan migration script.
- [ ] Konfigurasi Docker, Docker Compose, dan deployment server staging VPS.

---

## 5. Standar Kode & Disiplin Kerja Tim
1. **Warna Brand**: Wajib menggunakan token CSS `--brand: #25B5A9`, `--primary: #087F76`, dan `--accent-soft: #EAF8F5`.
2. **Kerapihan File**: Maksimal 500 baris per file kode. Komponen yang membesar wajib dipecah ke subkomponen.
3. **Dokumentasi Kode**: Setiap fungsi bernama wajib memiliki JSDoc bahasa Indonesia (`@param`, `@returns`).
4. **Bebas AI Slop**: Dilarang menggunakan emoji dekoratif dan teks basa-basi generik.
5. **Quality Gate**: Sebelum membuat Pull Request ke `dev`, pastikan pemeriksaan lokal lulus:
   ```bash
   npm test && npm run lint && npm run build
   ```
6. **Standar Ekstensi Berkas**:
   - Berkas yang merender antarmuka pengguna (halaman, layout, dan komponen React) menggunakan ekstensi **`.jsx`**.
   - Berkas fungsi logika murni (`actions.js`), data contoh (`mock.js`), fungsi helper (`utils.js`), dan API Route Handlers (`route.js`) tetap menggunakan ekstensi **`.js`**.
