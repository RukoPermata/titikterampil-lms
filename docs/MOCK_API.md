# Panduan mock API Titik Terampil

Mock API ini mengambil data awal dari `src/data/mock.js`. Tujuannya menyediakan
kontrak HTTP untuk pengerjaan frontend UTS. Pengiriman OTP, autentikasi server,
pembayaran Midtrans, pengerjaan CBT, dan scoring otomatis UAS belum diimplementasikan.

## 1. Alur data

```text
Komponen frontend → fetch('/api/...') → route.js
→ handler bersama → filter / validasi → state demo → respons JSON
```

- `src/app/api/`: menentukan URL serta metode HTTP yang tersedia.
- `src/lib/mock-api/handlers.js`: membaca permintaan dan membentuk respons.
- `queries.js`: mengolah pencarian dan filter URL.
- `validation.js`: memeriksa data sebelum disimpan.
- `resources.js`: menjalankan tambah, edit, hapus, dan pemeriksaan relasi.
- `store.js`: membaca serta menyimpan perubahan demo.
- `overview.js`: referensi akademik, leaderboard, dan statistik admin.

Handler menggunakan `Response.json()`, API respons standar yang dapat dikembalikan
oleh Route Handler Next.js. Semua respons memakai `Cache-Control: no-store`.

## 2. Menjalankan dan mencoba

Jalankan `npm run dev`, lalu buka URL di bawah menggunakan alamat server yang tampil.
Contoh menggunakan `http://localhost:3000`.

| Resource | Daftar | Detail | Tambah | Edit sebagian | Hapus |
|---|---|---|---|---|---|
| Pengguna | `GET /api/users` | `GET /api/users/[id]` | `POST /api/users` | `PATCH /api/users/[id]` | `DELETE /api/users/[id]` |
| Paket | `GET /api/tryouts` | `GET /api/tryouts/[id]` | `POST /api/tryouts` | `PATCH /api/tryouts/[id]` | `DELETE /api/tryouts/[id]` |
| Soal | `GET /api/questions` | `GET /api/questions/[id]` | `POST /api/questions` | `PATCH /api/questions/[id]` | `DELETE /api/questions/[id]` |
| Voucher | `GET /api/vouchers` | `GET /api/vouchers/[id]` | `POST /api/vouchers` | `PATCH /api/vouchers/[id]` | `DELETE /api/vouchers/[id]` |
| Transaksi demo | `GET /api/transactions` | `GET /api/transactions/[id]` | `POST /api/transactions` | `PATCH /api/transactions/[id]` | — |
| Esai | `GET /api/grading` | `GET /api/grading/[id]` | — | `PATCH /api/grading/[id]` | — |
| Kelas lama | `GET /api/classes` | `GET /api/classes/[id]` | — | — | — |
| Tugas lama | `GET /api/assignments` | `GET /api/assignments/[id]` | — | — | — |

Kelas dan tugas hanya menyediakan pembacaan data lama yang sudah ada pada fixture;
bukan penambahan scope LMS ke MVP tryout. Metode yang tidak terdaftar menghasilkan
HTTP 405 dari Next.js; format body 405 mengikuti framework.

Endpoint pendukung:

- `GET /api/academics`: pilihan jenjang dan kelas; filter `level` opsional.
- `GET /api/leaderboard?level=SMA&limit=5`: peringkat fixture per jenjang, default SMA.
- `GET /api/admin/summary`: statistik dari state API terkini.
- `GET /api/user?id=student-demo`: kompatibilitas profil tunggal lama; tanpa `id`
  memakai `student-demo`. ID salah menghasilkan 404, bukan profil pengganti.
- `GET /api/grading?id=sub-01`: kompatibilitas detail esai lewat query lama.

## 3. Pencarian dan filter

Semua daftar resource mendukung `q`. Parameter ini mencari teks pada nama/judul
atau field relevan resource; nama dan email pengguna diperiksa bersamaan.

| Resource | Filter tambahan |
|---|---|
| users | `role`, `level`, `grade`, `isMember` |
| tryouts | `level`, `grade`, `subject`, `status`, `isFree` |
| questions | `tryoutId`, `type` |
| vouchers | `status`, `code`, `tryoutId` |
| transactions | `status`, `studentId`, `tryoutId` |
| grading | `status` |
| classes | `level`, `grade`, `teacherId` |
| assignments | `classId` |

Contoh:

```text
/api/users?role=teacher&q=nadia       → hasil kosong
/api/users?role=student&isMember=true
/api/tryouts?level=SMP&grade=9
/api/questions?tryoutId=demo&type=essay
/api/vouchers?tryoutId=demo
/api/grading?status=Perlu%20Dinilai
/api/academics?level=SD
```

Filter digabung dengan AND. Pencarian mengabaikan besar/kecil huruf. ID resource
peka huruf besar/kecil. Boolean memakai `true` atau `false`. Parameter tidak dikenal
(misalnya `query` sebagai pengganti `q`), parameter berulang, serta pilihan enum
tidak valid menghasilkan 400. Parameter kosong berarti tidak memfilter.

## 4. Bentuk respons

Daftar sukses memakai HTTP 200:

```json
{ "status": "success", "count": 0, "data": [] }
```

Detail/edit sukses memakai `{ "status": "success", "data": { ... } }`.
Pembuatan sukses memakai HTTP 201 dan menghasilkan ID baru otomatis.
Penghapusan sukses memakai HTTP 200 dengan `data: { "id": "..." }`.

Error dari handler memakai bentuk berikut:

```json
{ "status": "error", "message": "Data tidak ditemukan." }
```

| HTTP | Arti |
|---|---|
| 400 | Parameter, body JSON, atau nilai field tidak valid |
| 404 | ID tidak tersedia |
| 409 | Email/kode duplikat atau record masih dirujuk |
| 415 | Body mutasi tidak memakai `Content-Type: application/json` |
| 500 | Data demo tidak dapat dibaca/disimpan |
| 503 | Lock penyimpanan demo belum tersedia; coba kembali |

## 5. Mencoba tambah dan edit pengguna

Jalankan contoh ini di console browser yang membuka aplikasi, atau adaptasikan
menjadi pemanggilan dalam komponen frontend:

```js
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Peserta Baru',
    email: 'peserta.baru@example.test',
    whatsapp: '081234567891',
    role: 'student',
    level: 'SMA',
    grade: 12,
    isMember: false,
  }),
});
const result = await response.json();
if (!response.ok) throw new Error(result.message);
console.log(result.data);
```

Gunakan ID pada `result.data.id` untuk PATCH atau DELETE. Contoh body PATCH:

```json
{ "isMember": true }
```

POST/PATCH hanya menerima field yang didukung resource. `id` tidak dapat dikirim
untuk diganti, dan endpoint pengguna tidak menerima `password`. Login demo tetap
menggunakan mekanisme frontend yang sudah ada. Email harus unik. Role pengguna
adalah `student`, `teacher`, atau `admin`; member merupakan status peserta.
Siswa wajib memiliki pasangan jenjang/kelas yang tersedia pada `/api/academics`.

## 6. Body resource lain

- **Paket:** wajib `title`, `level`, `grade`, `subject`, `durationMinutes`.
  Default pembuatan: `price: 0`, `isFree: true`, `questionCount: 0`, `status: "Draf"`.
  Jika berbayar, kirim `price` positif dan `isFree: false`.
  `subtests` opsional berupa array `{ id, title, durationMinutes, questionCount }`;
  total durasi/jumlah soal harus sama dengan paket. Field pengaturan opsional:
  `maxAttempts` (bilangan bulat minimal 1), `autoAdvance`, dan `noReturn` (boolean).
- **Soal:** wajib `tryoutId`, `prompt`, `explanation`; default `type: "single_choice"`
  dan `weight: 1`. Pilihan tunggal/benar-salah memakai `options` dan `correctIndex`;
  pilihan jamak memakai `options` dan `correctIndices`; isian memakai `correctAnswer`;
  esai memakai `maxScore` dan opsional `rubric`. Indeks dimulai dari nol.
  Jenis: `single_choice`, `multiple_choice`, `true_false`, `short_answer`, `essay`.
- **Voucher:** wajib `code`, `title`, `quota`, `validUntil` (`YYYY-MM-DD`),
  `applicablePackages` (array ID paket atau `["all"]`). Default `usedCount: 0`,
  `status: "Aktif"`. Status tersedia: `Aktif`, `Habis`, `Nonaktif`.
  Kode dinormalkan menjadi huruf besar dan harus unik. Kuota tidak boleh lebih
  kecil daripada `usedCount`. Ini manajemen data voucher, belum proses redeem akses.
- **Transaksi:** wajib `studentName`, `packageTitle`, `amount`, `paymentMethod`;
  default `status: "Menunggu"` dan tanggal saat dibuat. `studentId`, `tryoutId`, dan
  `date` opsional; jika ID diberikan, record rujukan harus tersedia.
  Status: `Menunggu`, `Berhasil`, `Gagal`, `Kedaluwarsa`. PATCH status hanya simulasi,
  tidak menghubungi Midtrans atau membuka akses ujian otomatis.
- **Penilaian esai:** PATCH `{ "score": 18, "feedback": "Langkah sudah jelas." }`.
  Score berupa angka dari 0 sampai `maxScore` submission. Saat nilai disimpan,
  status menjadi `Selesai`. Data jawaban tetap memakai `essayAnswer` dari fixture.
  Ini nilai submission demo, belum agregasi skor percobaan CBT.

Paket hanya dapat diubah menjadi `Terbit` jika jumlah soal aktual cocok dengan
`questionCount` dan minimal satu soal. Bank soal paket terbit harus diarsipkan
dahulu sebelum diubah. Penghapusan paket yang masih dipakai soal/voucher/transaksi
ditolak dengan 409. Penghapusan pengguna yang masih dirujuk kelas/transaksi juga ditolak.

## 7. Penyimpanan dan keterbatasan fixture

Sebelum ada mutasi, GET membaca salinan fixture. Setelah POST/PATCH/DELETE pertama,
state tersimpan di `.next/cache/mock-api/state.json`. Semua endpoint memakai state
yang sama. Perubahan bertahan ketika browser dimuat ulang dan server direstart,
selama direktori cache tersebut tidak dibersihkan. Fixture `mock.js` tidak diubah.
Penulisan memakai lock file dan penggantian file atomik untuk menghindari perubahan
paralel saling menimpa.

Untuk mengulang demo dari data awal, hentikan server lalu hapus hanya
`.next/cache/mock-api/state.json`. Jika proses sebelumnya berhenti saat menulis dan
meninggalkan `state.json.lock`, hapus lock tersebut setelah semua server dihentikan.
Cache ini untuk demo lokal; tidak menggantikan database atau pemeriksaan hak akses.

Hal yang sengaja mengikuti batas data saat ini:

- Paket fixture belum mempunyai `status`. Ringkasan menampilkan
  `unclassifiedPackages` terpisah; `publishedPackages` hanya menghitung `Terbit`.
- `estimatedRevenue` hanya menjumlahkan transaksi berstatus `Berhasil`.
- Leaderboard adalah fixture per jenjang. Belum ada attempt final dan relasi paket,
  sehingga parameter `tryoutId` ditolak dan perubahan nilai esai tidak mengubahnya.
- Transaksi/penilaian fixture lama banyak memakai nama, belum ID peserta/paket.
  Filter ID transaksi hanya berlaku untuk record yang benar-benar memiliki ID itu.
- Komponen yang masih membaca `mock.js` atau localStorage secara langsung belum
  otomatis memakai perubahan API. Ganti pembacaan komponen menjadi `fetch` pada
  tahap integrasi UI; implementasi ini tidak mengubah tampilan atau penyimpanan lama.

## 8. Pemeriksaan

```sh
node --test tests/mock-api.test.mjs
node node_modules/eslint/bin/eslint.js src/app/api src/lib/mock-api tests/mock-api.test.mjs
```

Pengujian menggunakan direktori cache sementara terpisah dan membersihkannya
setelah selesai. Data demo yang sedang dipakai browser tidak diubah oleh tes.
Pengujian mencakup filter AND, detail 404, CRUD, validasi lima jenis soal, batas nilai,
ringkasan, persistensi lintas proses, dan penulisan paralel.

Build keseluruhan tetap memerlukan penyelesaian konflik merge dan referensi modul
aplikasi yang belum lengkap. Kelulusan tes API tidak berarti semua halaman sudah siap.
