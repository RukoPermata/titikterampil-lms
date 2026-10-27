<!--
Modul: Panduan memahami struktur proyek Titik Terampil
Author: Tim Titik Terampil; penjelasan admin oleh Rayazka Aris
Tanggung jawab: membantu anggota menemukan file dan memahami alur halaman.
@todo: Perbarui panduan saat modul berikutnya selesai diimplementasikan.
-->
# Memahami Kerangka Proyek

Proyek menggunakan Next.js App Router dan React. Fokus masih frontend: P19 memiliki CRUD lokal; sebagian besar halaman lain tetap berupa skeleton.

## Fungsi folder

| Folder | Fungsi |
|---|---|
| app/ | Route halaman, layout dan CSS halaman |
| src/features/ | Logika modul dan data khusus fitur |
| src/components/ | Komponen bersama: sesi demo, shell, landing, login dan pratinjau skeleton |
| src/styles/ | Token warna, font, spacing dan ukuran bersama |
| src/config/ | Peta route, nama halaman dan pemilik modul |
| src/data/ | Data contoh bersama yang dipakai skeleton |
| public/ | Aset statis |
| docs/ | Panduan proyek dan pembagian tugas |
| tests/ | Pengujian aturan fungsi |

app/student, app/teacher dan app/admin mengelompokkan halaman berdasarkan peran. src/features mengelompokkan logika berdasarkan modul dan pemiliknya: auth (Kaisar), cbt (Fauzan), learning (Fityah), academic (Rayazka), tryout-management (Farrel), evaluation (Hilmy).

## Page, layout dan component

| Istilah | Contoh | Tanggung jawab |
|---|---|---|
| Page | app/admin/users/page.js | Halaman pada URL /admin/users; sekarang langsung berisi tampilan dan interaksinya |
| Layout | app/admin/layout.js | Membungkus semua halaman admin dengan DashboardShell |
| Komponen bagian | app/admin/users/UserForm.js | Form tambah/edit dan dialog |
| Komponen bersama | src/components/DashboardShell.js | Sidebar, header dan guard sesi demo untuk beberapa halaman |

Folder dengan page.js menjadi halaman. File pendukung seperti UserForm.js di dalam folder yang sama tidak membuat URL baru. Folder [id] menyatakan parameter route, misalnya app/student/classes/[id]/page.js menangani /student/classes/demo.

## Contoh P19: cukup lima file inti

```text
app/admin/users/
├── page.js                      Tampilan, state, handler dan ikon kecil
├── UserForm.js                  Form serta dialog
└── users.module.css             Seluruh styling halaman

src/features/academic/
├── user-management.js           Validasi, filter dan penyimpanan lokal
└── data/demo-users.js           Data awal fiktif
```

Urutan membaca yang disarankan: page.js → users.module.css → UserForm.js → user-management.js → demo-users.js. Komentar fungsi menjelaskan tujuan, input dan keluarannya. Komentar BAGIAN pada file menandai kelompok kode.

## Hubungan file ketika halaman dibuka

```text
Browser: /admin/users
  → app/layout.js: provider sesi dan CSS bersama
    → app/admin/layout.js: DashboardShell admin
      → app/admin/users/page.js: isi halaman dan interaksi
        → UserForm.js: form serta fungsi UserModal untuk konfirmasi
        → user-management.js: validasi, filter dan localStorage
        → users.module.css: tampilan halaman dan shell khusus P19
```

Diagram menunjukkan hubungan pembungkus, bukan urutan waktu eksekusi React yang kaku. Jika belum ada sesi demo, shell meminta pengguna memilih peran melalui /login.

## Ketika tombol Simpan ditekan

```text
Input form → validasi → handleSave pada page.js
  → persistUsers pada user-management.js
  → localStorage → notifikasi perubahan
  → React memperbarui daftar dan ringkasan
```

Filter mengubah tampilan, bukan data asal. Kegagalan storage tidak dianggap berhasil. Mengubah demo-users.js tidak menimpa data yang sudah disimpan di browser. Key data tetap titik-terampil:user-directory:v1.

## Jika ingin mengubah sesuatu

| Keinginan | Lokasi |
|---|---|
| Mengubah tabel, toolbar, ringkasan atau pagination | app/admin/users/page.js |
| Mengubah warna lokal, jarak atau responsivitas | app/admin/users/users.module.css |
| Mengubah input dan perilaku dialog | app/admin/users/UserForm.js |
| Mengubah validasi atau cara menyimpan data | src/features/academic/user-management.js |
| Mengubah data awal fiktif | src/features/academic/data/demo-users.js |
| Mengubah token visual bersama tim | src/styles/design-system.css; koordinasi tim |
| Mengubah menu dan pemilik route | src/config/pages.js dan DashboardShell.js; koordinasi pemilik |

## Hal yang perlu dikenali

- .js adalah JavaScript; Next.js juga menerima sintaks JSX di dalamnya. Repo belum dimigrasi ke .jsx.
- page.js P19 memakai use client karena mengelola state dan event. Layout root/admin tetap server component. Client component tetap dapat diprerender; akses window/localStorage dilakukan melalui pembacaan snapshot browser setelah hidrasi.
- CSS Module diimpor sebagai styles; token design-system.css baru berpengaruh ketika dipakai oleh rule CSS komponen.
- Alias @/ mengacu ke root proyek sesuai jsconfig.json.
- Sebagian besar actions.js masih skeleton fungsi JavaScript biasa, bukan Server Actions. P19 menggunakan user-management.js yang sudah diimplementasikan.
- ModulePage adalah pratinjau skeleton untuk halaman yang belum dikembangkan. P19 sudah menggunakan implementasi langsung pada page.js.
- Data P19 terpisah dari src/data/mock.js, autentikasi dan relasi kelas lain. Tidak ada akun login sungguhan atau API pengguna.
- app/index.js, app/db/schema, Drizzle dan Docker masih referensi backend bawaan.
- node_modules dan .next dihasilkan alat; tidak diedit atau dikumpulkan sebagai source.

Perintah utama: npm ci, npm run dev, npm test, npm run lint dan npm run build. Pekerjaan Rayazka berada pada branch ray. Panduan implementasi lengkap: docs/P19_MANAGEMENT_GUIDE.md; kepemilikan modul: docs/PEMBAGIAN_FILE.md.
