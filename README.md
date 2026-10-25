<!--
Modul: Panduan pengembangan frontend MVP Titik Terampil
Author: Tim Titik Terampil; koordinator integrasi Kaisar dan Rayazka
Tanggung jawab: menjaga petunjuk menjalankan, batas MVP dan alur kerja tim.
@todo: Perbarui status implementasi serta bukti kontribusi menjelang COTS.
-->
# Titik Terampil — Kerangka Frontend MVP

Platform CBT dan LMS untuk SD, SMP, SMA. Menggunakan **Next.js App Router + React (JavaScript)**, melanjutkan stack repo. Styling memakai CSS biasa agar fondasinya mudah dipahami dan dipulihkan saat COTS.

## Menjalankan

Butuh Node.js 20.9 atau lebih baru dan npm.

```sh
npm install
npm run dev
```

Buka http://localhost:3000. Pemeriksaan:

```sh
npm run lint
npm run build
npm start
```

Gunakan `npm ci` setelah package-lock.json tersedia. Gunakan npm secara konsisten; bun.lock bawaan repo bukan lockfile aktif untuk alur ini.

## Status yang sebenarnya

Ini **kerangka yang dapat dijalankan**, bukan implementasi lengkap 31 fitur MVP. Tersedia 24 route, layout responsif, navigasi per peran, sesi demo sementara, data contoh, dan fungsi pengembangan bertanda TODO. Landing page dan pemilihan peran demo sudah berjalan. Halaman fitur menampilkan kerangka, data contoh dan petunjuk implementasinya.

Buka `/login`, pilih Siswa, Pengajar atau Administrator. Sesi hanya ada dalam memori dan hilang saat refresh. Guard membatasi tampilan berdasarkan peran demo; ini bukan autentikasi atau otorisasi yang aman. Tidak ada API, database, password, unggah berkas, CRUD persisten, timer aktif atau penilaian sungguhan. Fungsi dengan `status: "not_implemented"` tidak boleh ditampilkan sebagai operasi berhasil.

File database dan Docker bawaan repo masih disimpan sebagai referensi, tetapi tidak diimpor frontend. Tidak perlu DATABASE_URL atau Docker untuk menjalankan kerangka ini. Pembayaran, AI, proctoring, ranking dan ekspor laporan berada di luar prioritas MVP.

## Struktur

```text
app/                     Route publik dan halaman per peran
  student/               10 halaman siswa
  teacher/               4 halaman pengajar
  admin/                 7 halaman admin
src/
  components/            Shell, sesi demo, landing dan pratinjau halaman
  config/pages.js        Peta lengkap 24 route, pemilik dan TODO
  data/mock.js           Data contoh dan ID kontrak antarmodul
  features/
    auth/                Kaisar
    cbt/                 Fauzan
    learning/            Fityah
    academic/            Rayazka
    tryout-management/   Farrel
    evaluation/          Hilmy
```

Setiap halaman memiliki fungsi bernama sendiri dan header bahasa Indonesia: modul, author, tanggung jawab, serta `@todo`. Fungsi di `src/features/*/actions.js` merupakan fungsi JavaScript frontend biasa, **bukan Next.js Server Actions**. Komponen halaman saat ini menggunakan `ModulePage` sebagai pratinjau; pemilik mengganti isi fungsi halaman dengan implementasi modulnya sendiri. Jangan memasukkan seluruh logika semua halaman ke komponen pratinjau bersama.

## Pembagian final

Mengikuti revisi terbaru pengguna: hasil/riwayat tryout menjadi bagian CBT Fauzan, dashboard pengajar menjadi bagian Kaisar. Pembagian ini menjadi baseline kerja dan tetap perlu validasi kompleksitas CRUD untuk COTS.

| Anggota | NIM | Halaman |
|---|---|---|
| Kaisar Rayfa Al Baihaqqi | 103022400110 | P01–P04, P13–P14 |
| Fauzan Zulfa Muhammad | 103022400032 | P05–P09 |
| Fityah Bayoediansyah Harahap | 103022400085 | P10–P12, P15 |
| Rayazka Aris | 103022400096 | P18–P21 |
| Farrel Irham Adzkaar Susanto | 103022400105 | P22–P24 |
| Hilmy Rafi | 103022400061 | P16–P17 |

File bersama dikelola tim dengan koordinator integrasi Kaisar dan Rayazka. Author menunjukkan penanggung jawab pengembangan, bukan klaim kode sudah dikerjakan anggota tersebut.

## Cara mengembangkan

1. Cari ID halaman di `src/config/pages.js`, lalu buka route `app/.../page.js` milikmu.
2. Ganti komponen pratinjau dengan UI sebenarnya. Tambahkan `"use client"` hanya pada komponen yang membutuhkan state, event atau browser API.
3. Kembangkan fungsi bernama di `src/features` dan kontrak `src/data/mock.js`. Awali dari data contoh; persistence lokal dapat ditambahkan setelah kontraknya disepakati.
4. Tambahkan loading, empty state, validasi dan error. Pakai `status: "not_implemented"` untuk fitur yang belum ada, jangan memberikan konfirmasi sukses palsu.
5. Uji alur pada desktop dan mobile; periksa lint dan build sebelum integrasi.

Daftar halaman, kontrak data dan prioritas: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Pengumpulan COTS

Kumpulkan source tanpa `node_modules`, `.next`, `dist`, `out`, rahasia `.env` dan folder `.git`. Sertakan package.json, package-lock.json, source dan dokumentasi. Setiap anggota mencatat halaman, fungsi, screenshot, commit dan skenario uji miliknya untuk PDF kontribusi individu. PDF kontribusi dan plotting kelompok belum dibuat oleh kerangka ini.

## Skeleton fungsi yang diperbarui

Seluruh fungsi bernama frontend memiliki komentar tujuan, parameter dan keluaran, serta tahapan pengembangan. Fungsi modul memiliki validasi awal dan kandidat data; aturan lanjutan serta persistence tetap TODO. Baca docs/SKELETON_GUIDE.md untuk kontrak status dan cara melengkapi halaman. Jalankan npm test, npm run lint dan npm run build sebelum integrasi.
