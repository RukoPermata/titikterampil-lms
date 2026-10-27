<!--
Modul: Panduan belajar kode halaman Manajemen Pengguna P19
Author: Rayazka Aris (103022400096)
Tanggung jawab: menjelaskan batas komponen, alur data dan pengujian halaman.
@todo: Perbarui panduan ketika repository diganti dengan API.
-->
# P19 — Manajemen Pengguna

Halaman ini memakai token dari src/styles/design-system.css. File token milik tim tetap dipertahankan. Root layout hanya mengimpor token; styling halaman dan penyesuaian shell P19 berada dalam CSS Module. Font mengikuti token, dengan fallback system-ui bila Inter dan Plus Jakarta Sans belum dimuat tim.

## Cara mencoba

1. Jalankan npm run dev.
2. Buka /login dan pilih Masuk sebagai Administrator.
3. Pilih menu Manajemen pengguna.
4. Coba tambah, edit, hapus, pencarian, filter peran/status, urutan, dan pagination.
5. Untuk menguji refresh, masuk kembali sebagai Administrator setelah refresh. Sesi demo lama memang hanya di memori, tetapi data direktori disimpan lokal dan tetap ada.

## File dan urutan belajar

| Urutan | File | Yang dipelajari |
|---|---|---|
| 1 | app/admin/users/page.js | Entry route server, metadata dan batas komponen client |
| 2 | src/features/academic/components/UserManagement.js | State UI, data turunan, handler simpan/hapus, render tabel dan pagination |
| 3 | src/features/academic/components/UserForm.js | Controlled input, perubahan peran/jenjang, validasi dan fokus field salah |
| 4 | src/features/academic/components/UserModal.js | Ref, effect, showModal, Escape dan pengembalian fokus native |
| 5 | src/features/academic/user-management.js | Aturan bisnis murni yang dapat diuji tanpa browser |
| 6 | src/features/academic/user-directory-store.js | Repository localStorage, snapshot stabil dan sinkronisasi antartab |
| 7 | src/features/academic/data/demo-users.js | Data fiktif dan kontrak record pengguna |
| 8 | src/features/academic/components/UserManagement.module.css | Styling halaman, dialog dan breakpoint |
| 9 | src/features/academic/components/UserShell.module.css | Integrasi shell khusus P19 tanpa mengubah halaman lain |
| 10 | src/features/academic/components/UserIcon.js | Ikon SVG dekoratif; label aksi tetap berada pada tombol |

## Alur data

Input form → validateUserForm → candidate yang dinormalisasi → handleSave → persistUsers → localStorage → notifikasi perubahan → useUserDirectory → tabel dan ringkasan diperbarui.

State query, role, status, sort, page, dan pageSize hanya mengubah tampilan. Hasil filter, jumlah halaman dan ringkasan dihitung dari users, bukan disimpan sebagai state duplikat. Saat filter berubah, page kembali ke 1. Saat baris terakhir pada suatu halaman dihapus, nomor halaman efektif dibatasi agar tidak menampilkan daftar kosong palsu.

Form memvalidasi saat submit. Jika salah, field diberi aria-invalid dan aria-describedby lalu fokus diarahkan ke field salah pertama. noValidate menonaktifkan popup validasi bawaan browser agar pesan Indonesia yang dikendalikan React konsisten. Status operasi diumumkan lewat role=status; error memakai role=alert.

## Peraturan yang sudah berjalan

- Nama 2–80 karakter dan format email valid; email unik tanpa membedakan kapitalisasi.
- Peran siswa, pengajar atau administrator; status aktif/nonaktif.
- Siswa harus memiliki pasangan jenjang/kelas valid: SD 1–6, SMP 7–9, SMA 10–12.
- Berganti jenjang mengosongkan pilihan kelas; berganti peran mengosongkan data akademik.
- Edit mempertahankan ID dan createdAt. Tambah memakai UUID dan waktu saat disimpan.
- Minimal satu administrator aktif dipertahankan saat hapus, perubahan status atau peran.
- Hapus membutuhkan konfirmasi. Tombol hapus admin terakhir ditolak dalam dialog.
- Data lokal divalidasi sebelum dipakai. JSON rusak atau storage diblokir menampilkan pesan pemulihan.
- Data rusak tidak ditimpa diam-diam. Pulihkan data contoh membutuhkan konfirmasi.
- Kegagalan menyimpan tidak menutup form atau menampilkan pesan sukses.
- Tabel memakai region scroll berlabel pada mobile; halaman sendiri tidak perlu bergeser horizontal.

## Batas frontend

Direktori ini merupakan demo P19 yang terpisah dari autentikasi dan modul akademik lain. Akun baru belum dapat dipakai login; status nonaktif belum mencabut sesi. Tidak ada password atau pengiriman email. Label aktif/nonaktif hanya atribut direktori lokal. Penghapusan belum menyentuh relasi siswa/kelas atau materi pada modul lain.

Sumber P19 ada pada repository khusus di atas; saveUser pada actions.js masih merupakan skeleton integrasi modul akademik berikutnya. Aturan P19 telah dipisahkan dalam user-management.js agar ketika tim menyatukan modul, tidak perlu menulis ulang validasinya. Nantinya repository API menggantikan persistUsers/useUserDirectory, dan otorisasi serta validasi wajib diterapkan server.

## Pengujian

npm test memeriksa keunikan email, konsistensi jenjang, admin terakhir, data storage rusak, kombinasi filter dan pengurutan. npm run lint dan npm run build memeriksa source dan integrasi Next.js.

Skenario browser: cari nama/email, kosongkan hasil pencarian, pindah halaman, tambah siswa, tolak email duplikat, edit status, hapus dengan konfirmasi, batalkan dialog menggunakan Escape, serta masuk kembali setelah refresh untuk memeriksa persistence. Periksa juga layout desktop dan mobile.
