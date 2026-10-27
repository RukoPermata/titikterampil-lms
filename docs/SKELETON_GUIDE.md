<!--
Modul: Standar komentar dan skeleton frontend
Author: Tim Titik Terampil; koordinator Kaisar dan Rayazka
Tanggung jawab: menjaga pola pengembangan yang mudah dibaca untuk kerja kelompok dan COTS.
@todo: Perbarui contoh ketika kontrak fungsi disepakati bersama.
-->
# Panduan komentar dan skeleton fungsi

Setiap fungsi bernama di source frontend memiliki JSDoc bahasa Indonesia: tujuan, parameter bila ada, nilai keluaran, dan kondisi penting. Callback pendek untuk map/filter dijelaskan oleh komentar tahap di fungsi induknya. Header file tetap memuat modul, penanggung jawab, tanggung jawab, dan TODO.

## Pola fungsi modul

1. Validasi awal input dan hentikan proses bila bentuk data salah.
2. Normalisasi atau siapkan kandidat data tanpa mengubah input pemanggil.
3. Lengkapi aturan bisnis yang masih ditandai TODO.
4. Hubungkan sumber data atau penyimpanan frontend dan tangani kegagalannya.
5. Kembalikan hasil sesuai kontrak; tampilkan sukses hanya setelah operasi selesai.

Validasi awal belum mencakup seluruh aturan bisnis. Kandidat data pada keluaran skeleton belum disimpan. Jangan merender atau mencatat seluruh input form secara sembarangan; data pendaftaran tidak mengembalikan password.

## Arti status

| Status | Arti | Perlakuan UI |
|---|---|---|
| error | Input awal ditolak | Tampilkan pesan dan izinkan koreksi |
| not_implemented | Tahap validasi awal lewat, tetapi operasi lengkap belum ada | Tampilkan informasi belum tersedia; jangan menampilkan sukses atau menavigasi seolah tersimpan |

Fungsi pembaca data contoh dan filter yang sudah berjalan mengembalikan hasil langsung sesuai JSDoc. validateRegistration mengembalikan valid false selama validasi lengkap belum tersedia. Nilai null pada statistik atau skor berarti belum dihitung, bukan nilai nol.

## Pola halaman dan komponen

Setiap page.js memiliki urutan khusus sesuai fitur, bukan salinan TODO yang sama. Page masih merender komponen pratinjau agar aplikasi dapat dijalankan. Komponen yang memakai useState, event form, timer atau storage harus dipisahkan menjadi komponen client di folder fitur; jangan menambahkan hook ke page server tanpa menentukan batas client terlebih dahulu.

Untuk halaman dinamis, await params tetap dipakai. P08 saat ini masih menerima ID paket demo sebagai pratinjau; implementasi hasil sebenarnya harus memakai attemptId. Integrasi Fauzan wajib memperbarui sumber detail dan tautan hasil secara bersamaan.

Komponen bersama yang sudah bekerja mempunyai komentar tahapan dan TODO lanjutan. Tidak perlu menambahkan operasi palsu pada fungsi yang sudah selesai hanya supaya tampak seperti skeleton.

## Cakupan perubahan

Komentar dan skeleton diterapkan pada seluruh fungsi bernama di app (halaman/layout frontend) dan src. File CSS/config tanpa fungsi diberi petunjuk pada bagian konfigurasinya. JSON, lockfile dan aset biner tidak diberi komentar karena formatnya tidak mendukungnya. File database serta Docker bawaan tetap sebagai referensi tahap backend dan tidak diaktifkan.

## Verifikasi

Jalankan npm test untuk batas input utama: submit ganda, soal kosong, bobot soal, pemetaan jenjang, nilai tugas dan pendaftaran. Jalankan npm run lint serta npm run build untuk pemeriksaan aplikasi. Pengujian ini belum membuktikan fitur CRUD, timer atau penyimpanan telah diimplementasikan.

Pengecualian implementasi: P19 Manajemen Pengguna sudah memakai komponen nyata, bukan ModulePage. CRUD lokal dan validasinya dijelaskan pada docs/P19_MANAGEMENT_GUIDE.md. Halaman modul lain tetap mengikuti skeleton di atas.
