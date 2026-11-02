# Manajemen pengguna dan dashboard admin

PIC: Rayazka Aris (103022400096). Implementasi frontend UTS menggunakan mock API.

## Urutan membaca kode

1. `src/app/admin/users/page.jsx`: pintu masuk halaman dan metadata.
2. `src/features/admin-management/components/UsersManagement.jsx`: pengatur form,
   filter, pembacaan detail, dan tindakan pengguna.
3. `hooks/useUsers.js`: pembacaan daftar dan akademik, pembatalan request lama,
   status loading, serta siklus penyimpanan dan pemuatan ulang daftar.
4. `api.js`: pemanggilan fetch, pengecekan HTTP/JSON, serta kontrak respons.
5. `validation.js`: normalisasi form, validasi per field, dan pembentukan payload.
6. `components/UserForm.jsx`, `UserFilters.jsx`, `UsersTable.jsx`: tampilan tugas
   masing-masing; styling memakai utilitas Tailwind dan `admin.module.css`.
7. `src/app/admin/dashboard/page.jsx` dan `components/AdminDashboard.jsx`:
   ringkasan administrasi dari `/api/admin/summary`.

Semua path pada poin 3–7 yang tidak diawali `src/` relatif terhadap
`src/features/admin-management/`.

## Sumber data

```text
Input pengguna → validasi form → fetch → Route Handler
→ validasi API dalam lock → state demo → respons → pemuatan ulang daftar
```

Daftar pengguna memakai `GET /api/users`. Jenjang/kelas dari `/api/academics`.
Sebelum edit, halaman mengambil `/api/users/[id]` agar form memakai detail terbaru.
POST menambah, PATCH mengedit/member, dan DELETE menghapus setelah konfirmasi.
Detail kontrak: [MOCK_API.md](./MOCK_API.md), ringkasan URL: [API_ENDPOINTS.md](./API_ENDPOINTS.md).

Direktori pengguna lama di localStorage tidak dibaca atau dihapus oleh halaman baru.
Tidak ada impor otomatis data lama. State API tersimpan di `.next/cache/mock-api/state.json`;
refresh browser maupun restart server tetap membaca state yang sama selama cache ada.
SessionStorage tetap dipakai oleh sesi demo bersama aplikasi, bukan sebagai direktori pengguna.

## Aturan pengguna

- Nama 2–80 karakter, email valid maksimal 254 karakter dan unik, WhatsApp Indonesia.
- Peran: peserta (`student`), pengajar (`teacher`), admin (`admin`).
- Peserta memilih jenjang/kelas yang disediakan endpoint akademik. Kelas numerik
  dikirim sebagai angka; Gap Year dan Umum tetap string.
- Member adalah status peserta, bukan status aktif/nonaktif akun.
- Form tidak mengirim field `status`, `createdAt`, `id`, atau password.
- API menjaga minimal satu administrator, termasuk saat penghapusan/perubahan peran paralel.
- UI mencegah penghapusan atau perubahan peran akun yang sedang digunakan.
- API menolak penghapusan atau perubahan peran jika hubungan kelas/transaksi menghalangi.
- Pembatasan UI dan sesi demo belum merupakan autentikasi/otorisasi produksi.

## Perilaku antarmuka

Pencarian nama/email memakai jeda 300 ms. Filter peran dan member digabung dengan AND.
Pencarian sebelumnya dibatalkan; versi request memastikan respons lama tidak menimpa
hasil baru. Filter member dibersihkan ketika memilih peran nonpeserta.

Form memiliki error per field dan mengarahkan fokus ke field pertama yang salah.
Error API tidak mengosongkan input. Tombol terkait dinonaktifkan selama operasi;
guard sinkron pada hook mencegah submit ganda sebelum React memperbarui UI.

Pesan sukses hanya ditampilkan setelah respons API mengakui perubahan. Jika penulisan
sukses tetapi daftar gagal dimuat ulang, pesan menyatakan perubahan tersimpan dan
meminta muat ulang daftar; form tidak perlu dikirim lagi. Jika koneksi terputus saat
mutasi, pesan menjelaskan bahwa hasil belum dapat dipastikan.

Referensi akademik dan daftar dimuat terpisah. Gagal memuat pilihan akademik
menonaktifkan form, tetapi daftar masih dapat dibaca. Gagal memuat daftar memberi
pesan dan tombol coba lagi. Data lama yang masih ditampilkan diberi keterangan dan
aksi tabel dinonaktifkan sampai daftar berhasil diperbarui.

## Dashboard admin

Statistik seluruhnya berasal dari `/api/admin/summary`: peserta, member, paket,
pendapatan transaksi berhasil, jumlah pengguna per peran, transaksi menunggu, dan esai
menunggu penilaian. Paket tanpa status belum dihitung terbit. Angka lama tidak
berubah menjadi nol saat refresh gagal; error ditampilkan dengan tombol pemulihan.
Ringkasan diperbarui saat halaman dipasang, tombol ditekan, atau jendela kembali fokus.

Pintasan membuka manajemen pengguna, paket, dan bank soal yang sudah tersedia.
Pengintegrasian modul pengajar/pembayaran lainnya tetap mengikuti pemilik modul.

## Pengujian

```sh
npm test
npm run lint
npm run build
```

Tes form tidak lagi mengekstrak fungsi dari JSX satu file. Validasi form diuji dari
modul fitur; aturan penyimpanan, relasi, dan administrator terakhir diuji melalui API.
`tests/admin-client.test.mjs` menguji HTTP, JSON rusak, bentuk respons, jaringan,
dan pembatalan permintaan.

Pengujian browser opsional menggunakan Chrome lokal dan Playwright Core di cache:

```powershell
npm install --prefix .next/cache/admin-e2e --ignore-scripts --no-audit --no-fund playwright-core
npm run build
$env:TITIKTERAMPIL_MOCK_DATA_FILE = Join-Path $PWD '.next/cache/admin-ui-state.json'
npm run start -- --port 3157
```

Di terminal kedua pada proyek yang sama:

```powershell
$env:ADMIN_E2E_ALLOW_WRITES = 'true'
npm run test:admin-ui
```

Gunakan state uji terpisah seperti di atas. Skrip mensimulasikan sesi demo admin,
menambah/mengedit/member/menghapus pengguna uji, memeriksa error/konfirmasi/pencarian,
dan menguji lebar 360/768/1280 piksel. Screenshot serta laporan tersimpan di
`.next/cache/admin-ui-check/`; data browser harian tidak dipakai oleh server uji.
