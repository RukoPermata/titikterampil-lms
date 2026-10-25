<!--
Modul: Kontrak integrasi dan rencana pengembangan MVP
Author: Tim Titik Terampil; koordinator Kaisar dan Rayazka
Tanggung jawab: menyelaraskan ID, data dan dependensi antarmodul.
@todo: Sepakati kontrak final bersama enam pemilik modul.
-->
# Panduan integrasi frontend

Scope dibaca dari Titik_Terampil_Project_Scope.md versi 1.0 dan revisi pembagian tugas terbaru dari pengguna. Dokumen tersebut adalah referensi kebutuhan; permintaan frontend-only saat ini membatasi implementasi database/API menjadi pekerjaan berikutnya. Rekomendasi React + Vite dalam scope belum merupakan keputusan final; repo menggunakan Next.js sehingga stack tersebut dipertahankan.

## Kontrak data awal

ID berupa string dan relasi memakai ID, bukan judul. Lihat data contoh di `src/data/mock.js`.

| Entitas | Field yang disepakati sebagai awal |
|---|---|
| User | id, name, role; siswa memiliki level, grade |
| Academic | level (SD/SMP/SMA), grades (1–6/7–9/10–12) |
| Class | id, title, level, grade, teacherId; TODO studentIds |
| Tryout | id, title, level, grade, subject, durationMinutes; TODO questionIds, opensAt, closesAt |
| Question | id, tryoutId, prompt, options, correctIndex, weight, explanation |
| Assignment | id, classId, title, instructions; TODO dueAt |
| Attempt (belum diimplementasikan) | id, studentId, tryoutId, deadline, answers, flaggedQuestionIds, submittedAt, score |
| Submission (belum diimplementasikan) | id, assignmentId, studentId, answer, submittedAt, score, feedback |

`correctIndex` berbasis nol. Rencana skor MVP: jumlah bobot jawaban benar / jumlah bobot seluruh soal × 100, dengan penanganan total bobot nol. Jadwal menggunakan ISO 8601 dan ditampilkan dalam Asia/Jakarta. Aturan ini masih perlu validasi klien. Kunci jawaban frontend hanya layak untuk demo; nanti scoring harus pindah server.

## Urutan implementasi

1. Kaisar menyelesaikan form, profil, sesi demo dan dashboard siswa/pengajar; Rayazka menyepakati data akademik.
2. Farrel membuat CRUD soal dan paket; Fauzan menggunakan kontraknya untuk CBT.
3. Fauzan membuat deadline yang bertahan refresh, autosave lokal per attempt, navigasi dan submit sekali. Jika persistence ditambahkan, validasi skema dan tangani JSON rusak/storage tidak tersedia.
4. Fauzan melanjutkan hasil submit untuk nilai, pembahasan dan riwayat dalam modul CBT. Laporan agregat tetap milik Farrel.
5. Fityah membuat kelas, pembaca materi, pengumpulan tugas dan CRUD materi; Hilmy melanjutkan CRUD tugas dan penilaian.
6. Rayazka menyelesaikan penempatan akun/kelas; Farrel menyusun rekap dari hasil yang sudah ada.

Prioritaskan satu alur lengkap siswa: masuk → katalog → detail → CBT → hasil → riwayat. Berikutnya kelas → materi → tugas → nilai. Semua fungsi placeholder saat ini harus dikembangkan sebelum alur tersebut dapat dinyatakan selesai.

## Checklist penerimaan saat fitur dikembangkan

- Registrasi memvalidasi input dan konsistensi jenjang/kelas.
- Pergantian role mengubah navigasi; UI salah role tidak memperlihatkan halaman modul.
- Filter data membedakan SD/SMP/SMA dan tingkat kelas.
- Refresh CBT tidak mengulang durasi atau menghilangkan jawaban setelah autosave diimplementasikan.
- Timer habis dan submit manual menghasilkan satu hasil; jawaban kosong, salah dan benar dihitung konsisten.
- Tugas tanpa jawaban ditolak; nilai di luar rentang ditolak.
- CRUD yang sukses benar-benar mengubah sumber data dan terlihat di modul terkait.
- ID tidak dikenal menampilkan kondisi tidak ditemukan.
- Layout dapat digunakan dengan keyboard dan layar 360px tanpa navigasi terpotong.
- `npm run lint` dan `npm run build` lulus.

## Referensi halaman

Semua 24 halaman beserta route, pemilik dan TODO tersedia pada `src/config/pages.js`; halaman dinamis menerima `[id]` melalui `await params`. Link demo menggunakan ID `demo`. Halaman detail selain data contoh yang tersedia akan menampilkan pesan tidak ditemukan.

Situs https://almahyraeducation.com/ adalah referensi klien untuk pengalaman belajar/tryout. Situs belum berhasil diakses lewat alat web saat penyusunan sehingga kerangka ini tidak mengklaim meniru fitur atau tampilannya.

## Skeleton fungsi yang diperbarui

Seluruh fungsi bernama frontend memiliki komentar tujuan, parameter dan keluaran, serta tahapan pengembangan. Fungsi modul memiliki validasi awal dan kandidat data; aturan lanjutan serta persistence tetap TODO. Baca docs/SKELETON_GUIDE.md untuk kontrak status dan cara melengkapi halaman. Jalankan npm test, npm run lint dan npm run build sebelum integrasi.
