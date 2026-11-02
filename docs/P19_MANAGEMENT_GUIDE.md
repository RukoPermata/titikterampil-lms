<!--
Modul: Panduan latihan COTS CRUD Pengguna P19
Author: Rayazka Aris (103022400096)
Tanggung jawab: menjelaskan cara membangun ulang halaman dan CRUD dari satu file.
@todo: Tambahkan API dan otorisasi server setelah tahap frontend/COTS.
-->
# P19 — Satu file untuk latihan CRUD

Semua kode khusus halaman berada di src/app/admin/users/page.jsx. File ini hanya mengimpor useState, useEffect dan useRef dari React. Data awal, state, validasi, penyimpanan, handler CRUD, form, tabel serta CSS lokal berada di file yang sama.

Layout admin, sesi demo dan token design system tetap memakai fondasi bersama yang sudah ada. Halaman ini tidak perlu lagi UserForm.js, users.module.css, file repository, utilitas pengguna atau file data contoh terpisah.

## Bagian file yang perlu dibaca

| Bagian | Isi |
|---|---|
| BAGIAN 1 | Key localStorage, pilihan peran/jenjang, data contoh dan validasi |
| BAGIAN 2 | State pengguna/form/mode edit, dan effect pembacaan awal |
| BAGIAN 3 | saveUsers, resetForm, handleChange, handleSubmit, handleEdit, handleDelete, restoreExamples |
| BAGIAN 4 | Judul, notifikasi, form dan tabel dengan users.map |
| BAGIAN 5 | CSS lokal sederhana pada style jsx |

## Flow membangun ulang saat latihan

1. Buat data contoh dan state users terlebih dahulu, lalu tampilkan dengan map (READ).
2. Buat state form dan controlled input: value membaca state, onChange mengubah state.
3. Buat onSubmit: preventDefault, normalisasi, validasi dan tambah record dengan spread array (CREATE).
4. Tambahkan editingId dan tombol Edit: masukkan record lama ke form, ganti record dengan map berdasarkan ID (UPDATE).
5. Tambahkan tombol Hapus, confirm, lalu filter berdasarkan ID (DELETE).
6. Lengkapi saveUsers: JSON.stringify ke localStorage, baru perbarui state jika berhasil.
7. Lengkapi effect pembacaan awal: getItem, JSON.parse dan validasi bentuk data.
8. Uji satu operasi sampai berjalan sebelum menambah operasi berikutnya.

## Fungsi inti

- handleSubmit membedakan CREATE dan UPDATE melalui editingId. Tambah memakai [...users, newUser]; edit memakai users.map.
- handleEdit menyalin isi baris ke form. ID dan tanggal bergabung dipertahankan saat menyimpan perubahan.
- handleDelete memakai window.confirm bawaan browser dan users.filter.
- saveUsers mengembalikan true hanya bila localStorage berhasil ditulis. Form tidak dikosongkan jika penyimpanan gagal.
- validateUser memeriksa nama, email, keunikan email, peran, status, jenjang/kelas dan administrator aktif terakhir.
- isValidStoredUsers memeriksa JSON hasil penyimpanan sebelum ditampilkan. Data rusak tidak ditimpa diam-diam; pemulihan contoh memerlukan konfirmasi.

## Batas latihan

Pencarian, filter, pagination, kartu statistik dan modal kustom sengaja dikeluarkan dari fokus halaman. Form selalu terlihat di atas/sebelah tabel. Tampilan cukup untuk membaca dan mengoperasikan CRUD, belum menjadi desain final klien.

Storage key tetap titik-terampil:user-directory:v1 agar direktori yang telah disimpan tetap terbaca. Data contoh awal kini tiga pengguna fiktif; daftar lama tidak dihapus. Sesi login demo masih hilang saat refresh: masuk lagi melalui /login → Administrator → Manajemen pengguna.

Halaman membaca data sekali saat dipasang. Sinkronisasi langsung antartab tidak menjadi bagian latihan ini; pakai satu tab ketika mencoba CRUD. Data P19 tidak membuat kredensial login, mengirim email atau mengubah relasi kelas pada modul lain. API, database dan otorisasi server belum diimplementasikan.

## Pengujian

npm test memeriksa aturan validasi dari blok fungsi murni pada page.js tanpa menduplikasi source produksi. npm run lint dan npm run build memeriksa React/Next.js. Uji browser: tampilkan data, tambah, tolak email duplikat, edit, batalkan hapus, konfirmasi hapus, tolak admin terakhir, lalu refresh dan masuk kembali.
