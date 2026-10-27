<!--
Modul: Panduan belajar halaman Manajemen Pengguna P19
Author: Rayazka Aris (103022400096)
Tanggung jawab: menjelaskan lima file inti, alur data dan cara menguji halaman.
@todo: Ganti penyimpanan lokal dengan API ketika backend tersedia.
-->
# P19 — Manajemen Pengguna: lima file inti

Halaman memakai design system tim. Fitur tetap mencakup tambah, edit, hapus, pencarian, filter peran/status, pengurutan, pagination dan persistence lokal. Penyederhanaan menggabungkan kode yang berhubungan; tidak mengganti skema data atau menghapus direktori yang sudah tersimpan.

## Struktur dan urutan belajar

```text
app/admin/users/
├── page.js                 Halaman, state, handler, tabel, pagination dan ikon kecil
├── UserForm.js             Form tambah/edit dan pembungkus dialog native
└── users.module.css        Semua styling halaman, dialog dan penyesuaian shell

src/features/academic/
├── user-management.js      Validasi, filter dan operasi localStorage
└── data/demo-users.js      Data awal fiktif
```

| Urutan | File | Isi yang dipelajari |
|---|---|---|
| 1 | app/admin/users/page.js | Seluruh tampilan utama; ikuti komentar BAGIAN 1 sampai BAGIAN 3 |
| 2 | app/admin/users/users.module.css | Aturan halaman, kontrol, tabel, dialog, mobile dan shell |
| 3 | app/admin/users/UserForm.js | Controlled input, validasi, perubahan jenjang, fokus field salah, dan dialog |
| 4 | src/features/academic/user-management.js | Bagian 1 aturan data; bagian 2 penyimpanan browser |
| 5 | src/features/academic/data/demo-users.js | Bentuk record dan contoh siswa/pengajar/admin |

UserModal tetap ada sebagai fungsi di dalam UserForm.js dan diekspor untuk dialog konfirmasi pada page.js. Ikon kecil merupakan fungsi lokal page.js; tombol tutup dialog memakai SVG langsung. Tidak ada file UserManagement.js, UserModal.js, UserIcon.js, stylesheet shell terpisah, atau repository terpisah lagi.

## Alur data

Input UserForm → validateUserForm → handleSave pada page.js → persistUsers pada user-management.js → localStorage → notifikasi perubahan → useSyncExternalStore pada page.js → tabel dan ringkasan diperbarui.

State pencarian, filter, urutan dan halaman berada di page.js. Daftar hasil filter, ringkasan dan nomor halaman efektif dihitung dari sumber pengguna, bukan disimpan sebagai state duplikat. Form hanya ditutup setelah penyimpanan berhasil.

page.js kini komponen client karena menangani state dan event secara langsung. Judul tab diperbarui lewat effect; HTML awal memakai metadata root. Server snapshot yang stabil dipakai untuk hidrasi, sehingga window dan localStorage tidak diakses saat render server. Snapshot browser dan fungsi langganannya tetap dipertahankan untuk sinkronisasi antartab.

## Styling bersama

DashboardShell tetap komponen bersama yang sudah ada. Komponen tersebut sekarang mengimpor class usersShell dari users.module.css hanya untuk P19. Root layout tetap mengimpor design-system.css; tidak perlu menyalin sidebar atau token ke setiap halaman.

## Aturan yang tetap berjalan

- Nama 2–80 karakter; email valid dan unik tanpa membedakan kapitalisasi.
- Jenjang sesuai kelas: SD 1–6, SMP 7–9, SMA 10–12.
- Pergantian jenjang mereset kelas; perubahan peran membersihkan data akademik.
- Edit mempertahankan ID/tanggal; tambah mendapat UUID dan tanggal baru.
- Administrator aktif terakhir tidak dapat dihapus, dinonaktifkan atau diganti peran.
- Hapus dan pemulihan data membutuhkan konfirmasi.
- JSON lokal yang rusak tidak ditimpa diam-diam; kegagalan simpan tidak menghasilkan sukses palsu.
- Dialog memiliki label, focus trap native, Escape dan pemulihan fokus pemicu.
- Tabel bergeser dalam region berlabel pada mobile; key storage tetap titik-terampil:user-directory:v1.

## Cara mencoba dan batas integrasi

Jalankan npm run dev → /login → Administrator → Manajemen pengguna. Sesi demo masih hilang pada refresh; masuk lagi untuk melihat data direktori yang tetap tersimpan. Akun baru belum dapat dipakai login, tidak ada password atau undangan email, dan data P19 belum mengubah relasi kelas/materi pada modul lain.

saveUser dalam academic/actions.js masih skeleton untuk integrasi modul berikutnya. Implementasi P19 sekarang memakai aturan dan operasi simpan pada user-management.js. File actions.js bukan salah satu dari lima file inti P19.

Jalankan npm test, npm run lint dan npm run build. Saat mencoba lewat browser, periksa tambah/edit/hapus, email duplikat, filter, pagination, Escape dan persistence setelah refresh. Selanjutnya saat backend tersedia, terapkan otorisasi server serta ganti fungsi persistence pada file aturan/storage.
