<!--
Modul: Penjelasan kerangka proyek Titik Terampil
Author: Tim Titik Terampil; penjelasan admin oleh Rayazka Aris
Tanggung jawab: membantu anggota menemukan kode halaman dan memahami batas modul.
@todo: Perbarui panduan saat integrasi backend dimulai.
-->
# Kerangka proyek dan fokus CRUD Rayazka

| Folder | Isi |
|---|---|
| app/ | Route, layout, dan implementasi halaman |
| src/components/ | Komponen bersama: login demo, sesi, sidebar/header dan pratinjau skeleton |
| src/features/ | Kerangka logika modul anggota lain dan administrasi lanjutan |
| src/config/ | Peta route, pemilik dan TODO |
| src/data/ | Data contoh bersama untuk halaman skeleton |
| src/styles/ | Token design system bersama |
| public/ | Aset statis |
| docs/ | Dokumentasi |
| tests/ | Pengujian aturan fungsi |

## Halaman CRUD Rayazka

Untuk fokus COTS saat ini, semua kode khusus Manajemen Pengguna digabung pada satu file:

```text
app/admin/users/page.js
```

Data contoh, validasi, state React, baca/simpan localStorage, handler tambah/edit/hapus, tabel, form dan styling lokal ada di sana. Tidak ada file pendukung khusus P19 yang perlu dibuka lagi. Baca komentar BAGIAN 1 sampai BAGIAN 5 dari atas ke bawah.

## Hubungan dengan aplikasi

```text
Browser membuka /admin/users
  → app/layout.js menyediakan sesi demo dan CSS bersama
    → app/admin/layout.js memakai DashboardShell admin
      → app/admin/users/page.js menampilkan form dan tabel CRUD
```

Layout/shell merupakan fondasi bersama, bukan file tambahan yang perlu dibangun ulang untuk latihan CRUD. Folder dengan page.js menentukan URL; file seperti layout.js membungkus route di bawahnya. Student, teacher dan admin mengelompokkan halaman berdasarkan peran.

## Flow kode

Input form → handleChange → state form → handleSubmit → validateUser → tambah dengan spread / ubah dengan map → saveUsers → localStorage → state pengguna → tabel melalui map.

Hapus: klik Hapus → handleDelete → konfirmasi browser → filter ID → saveUsers → tabel diperbarui.

## Hal teknis yang perlu diketahui

- File .js dapat berisi JSX dalam proyek Next.js ini. Belum ada migrasi ke .jsx.
- Page P19 memakai use client agar bisa mengelola state, event, effect dan browser storage.
- Effect membaca localStorage setelah mount sehingga tidak mengakses window ketika server membuat HTML awal.
- CSS khusus P19 ditulis dalam style jsx pada file halaman; warna mengacu ke token design-system.css yang sudah diimpor root layout.
- Sebagian besar halaman lain masih menggunakan ModulePage sebagai pratinjau skeleton.
- actions.js masih kerangka JavaScript biasa untuk integrasi modul berikutnya; tidak digunakan oleh CRUD latihan P19.
- Akun baru dalam direktori demo belum dapat login; storage lokal bukan backend atau autentikasi.
- node_modules dan .next dihasilkan alat, bukan source yang diedit untuk COTS.

Cara mencoba: npm run dev → /login → Administrator → Manajemen pengguna. Pemeriksaan: npm test, npm run lint dan npm run build. Panduan latihan lebih rinci: docs/P19_MANAGEMENT_GUIDE.md.
