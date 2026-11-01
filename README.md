<!--
Modul: Panduan pengembangan frontend MVP Titik Terampil
Author: Tim Titik Terampil; koordinator integrasi Kaisar dan Rayazka
Tanggung jawab: menjaga petunjuk menjalankan, batas MVP dan alur kerja tim.
-->
# Titik Terampil: Platform Try Out & CBT Bimbel

Platform CBT (*Computer-Based Test*) dan Try Out untuk **Bimbingan Belajar Titik Terampil** yang mencakup jenjang mulai dari Kelas 4 SD, SMP, SMA/SMK, hingga Gap Year / Umum. Menggunakan **Next.js 16 (App Router) + React 19 (JavaScript)** dengan **Tailwind CSS v4** dan identitas warna resmi **Turquoise `#25B5A9`**.

---

## 1. Menjalankan Proyek Lokal

Dibutuhkan Node.js 20.9 atau lebih baru dan npm.

```sh
# Instalasi dependensi
npm install

# Menjalankan server pengembangan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

Pemeriksaan kualitas kode:
```sh
npm test          # Menjalankan pengujian otomatis unit test
npm run lint      # Pemeriksaan linting ESLint
npm run build     # Kompilasi produksi Next.js
```

---

## 2. Batasan Scope: UTS vs UAS

- **Fokus UTS (Sekarang)**: Murni **Frontend & UI/UX Interaktif**. Seluruh antarmuka dari 27 layar dapat dicoba secara visual menggunakan data contoh (`src/data/mock.js`) dan browser storage (`sessionStorage` / `localStorage`). Fitur pembayaran Midtrans dan 2FA dibuat dalam bentuk **simulasi interaktif / dummy** tanpa perlu backend aktif.
- **Fokus UAS (Fase Berikutnya)**: Pembuatan API endpoint backend, integrasi database relasional PostgreSQL (Drizzle ORM), integrasi SDK Midtrans produksi sungguhan, dan pengiriman email OTP via SMTP.

---

## 3. Struktur Direktori Proyek (`src/app/`)

Proyek mengadopsi struktur resmi Next.js dengan folder `src/app/`:

```text
titikterampil-lms/
├── public/                 # Aset statis (logo, ikon, gambar ilustrasi)
├── docs/                   # Dokumentasi PRD, panduan kerja, dan pembagian tugas
│
├── src/
│   ├── app/                # URL routing, halaman, dan layout
│   │   ├── globals.css     # Fondasi visual brand (#25B5A9) dan utilitas CSS
│   │   ├── layout.jsx      # Root layout & DemoProvider
│   │   ├── page.jsx        # [Layar 01] Landing Page
│   │   ├── api/            # Route Handler Mock API (Fetch API UTS Poin 2.2)
│   │   ├── (auth)/         # Halaman login, register, dan verifikasi 2FA
│   │   ├── student/        # Halaman ruang belajar peserta (dashboard, CBT, hasil)
│   │   ├── teacher/        # Halaman ruang pengajar (bank soal, penilaian esai)
│   │   └── admin/          # Halaman admin (pengguna, paket tryout, voucher)
│   │
│   ├── components/         # Komponen bersama lintas fitur
│   │   ├── ui/             # Primitif UI
│   │   ├── DashboardShell.jsx # Sidebar navigasi, topbar, dan role-guard
│   │   ├── DemoProvider.jsx # State sesi, persistensi storage, Toast global (useToast)
│   │   └── Landing.jsx     # Komponen halaman beranda publik
│   │
│   ├── features/           # Tampilan dan logika per domain fitur
│   │   ├── auth/           # Autentikasi, login, register, profil (PIC: Kaisar)
│   │   ├── student/        # Fitur khusus siswa & dashboard (PIC: Kaisar)
│   │   ├── cbt/            # Engine ujian, timer subtes, pembahasan (PIC: Fauzan)
│   │   ├── payment/        # Transaksi dummy, voucher (PIC: Fityah)
│   │   ├── questions/      # Bank soal, paket, impor CSV (PIC: Farrel & Hilmy)
│   │   └── admin-management/ # Rekapitulasi pengguna & admin (PIC: Rayazka)
│   │
│   ├── data/
│   │   └── mock.js         # Sumber data contoh frontend UTS
│   │
│   └── lib/                # Fungsi pendukung umum (formatter, helper)
│
├── tests/
│   └── frontend-skeleton.test.mjs  # Unit test native Node.js
├── package.json
└── jsconfig.json
```

---

## 4. Pembagian Tanggung Jawab Tim (27 Layar)

| Anggota | NIM | Domain & Alokasi Layar |
|---|---|---|
| **Kaisar Rayfa Al Baihaqqi** | 103022400110 | Layar 01–06, 15 (Landing, Login, Register + WhatsApp, 2FA, Onboarding, Dashboard, Profil) |
| **Fauzan Zulfa Muhammad** | 103022400032 | Layar 07–08, 10–14 (Katalog, Detail Paket, Ruang CBT 5 Tipe Soal, Hasil, Pembahasan, Riwayat, Leaderboard) |
| **Fityah Bayoediansyah Harahap** | 103022400085 | Layar 09, 26, 27 (Checkout & Status Pembayaran, Manajemen Voucher Admin, Daftar Transaksi) |
| **Hilmy Rafi** | 103022400061 | Layar 16, 19–21 (Dashboard Pengajar, Penugasan & Koreksi Esai Manual, Hak Akses Member Pengajar) |
| **Farrel Irham Adzkaar Susanto** | 103022400105 | Layar 17–18, 24–25 (Bank Soal, Form Editor Soal, Manajemen Paket Try Out, Impor CSV/Excel) |
| **Rayazka Aris** | 103022400096 | Layar 22–23 & Data Bersama (Dashboard Admin, Manajemen Pengguna & Member, Kontrak Data `mock.js`) |

Rincian spesifik checklist to-do dan kontrak antar-anggota dapat dilihat pada dokumen: **[docs/PEMBAGIAN_FILE.md](docs/PEMBAGIAN_FILE.md)**.

---

## 5. Standar Kode & Disiplin Pengembangan
1. **Warna Brand**: Wajib menggunakan token CSS `--brand: #25B5A9`, `--primary: #087F76`, dan `--accent-soft: #EAF8F5`.
2. **Kerapihan File**: Setiap file diusahakan berada di bawah batas **500 baris kode**.
3. **Dokumentasi Kode**: Setiap fungsi bernama wajib memiliki JSDoc bahasa Indonesia (`@param`, `@returns`).
4. **Bebas AI Slop**: Hindari teks generik dan emoji dekoratif pada antarmuka profesional.
5. **Quality Gate**: Sebelum membuat Pull Request ke `dev`, pastikan lulus pengujian:
   ```bash
   npm test && npm run lint && npm run build
   ```
