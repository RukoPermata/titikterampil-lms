# Product Requirements Document — Titik Terampil

## 1. Tujuan dan dasar penyusunan

Titik Terampil adalah bimbingan belajar privat dan umum untuk peserta mulai kelas 4 SD sampai SMA/SMK serta gap year. Website menyediakan try out bagi peserta bimbel maupun masyarakat umum, sekaligus menjadi media promosi melalui kegiatan seperti try out gratis bulanan. Fase berikutnya akan mencakup LMS; fase pertama berfokus pada try out.

Almahyra Education digunakan sebagai referensi alur peserta.

### Hasil produk yang dituju

1. Peserta dapat menemukan try out sesuai jenjang, memperoleh akses, mengerjakan, dan memahami hasilnya.
2. Pengajar dapat menyusun soal, menilai esai, dan memberikan status member tanpa mengelola transaksi.
3. Admin dapat mengelola paket, member, voucher, dan pembayaran.
4. Titik Terampil dapat membuka try out promosi bagi masyarakat umum.

## 2. Ruang lingkup MVP

- Halaman publik promosi bimbel dan try out, dengan identitas warna #25B5A9.
- Registrasi/login email dan kata sandi atau Google, serta nomor WhatsApp. Semua peran wajib kode email sebagai 2FA setiap login email/kata sandi; login Google tidak memerlukan kode email tambahan.
- Personalisasi awal serta pengelolaan profil.
- Jenjang SD, SMP, SMA/SMK, umum; gap year berada di SMA/SMK.
- Latihan mata pelajaran per kelas, persiapan ujian sekolah, dan UTBK.
- Akses per paket melalui pembayaran, voucher gratis, atau status member.
- Pengelolaan soal, gambar, pembahasan, dan impor CSV/Excel.
- Lima jenis soal, bobot yang dapat diatur, serta pilihan metode nilai sebagian dan penalti.
- Timer paket/subtes, pengulangan, penyimpanan jawaban dan kelanjutan ujian.
- Hasil sementara/final, penilaian esai, pembahasan, leaderboard.
- Antarmuka peserta, pengajar, dan admin yang responsif.

### Di luar baseline MVP

LMS, kelas video, presensi, tugas pembelajaran, live teaching, rekomendasi otomatis, estimasi peluang kampus, kuis harian, grafik perkembangan mendalam, forum, tiket bantuan internal, proctoring, dan penilaian IRT UTBK belum dimasukkan. Sebagian fitur ditemukan pada referensi, tetapi tidak dipilih pengguna untuk MVP. Jika dibutuhkan, perubahan harus dicatat beserta pengaruhnya pada waktu pengerjaan.

Pembayaran bukan langganan. Target kampus dan kesiapan disimpan untuk profil/dashboard; MVP tidak menjanjikan rekomendasi berbasis data tersebut.

## 3. Pengguna dan kewenangan

| Kemampuan                                                   | Peserta | Pengajar                        | Admin                                  |
| ----------------------------------------------------------- | ------- | ------------------------------- | -------------------------------------- |
| Mengelola profil sendiri                                    | Ya      | Turunan: identitas akun sendiri | Turunan: identitas akun sendiri        |
| Melihat katalog, membeli/menukar voucher, mengerjakan ujian | Ya      | Tidak ditetapkan                | Tidak ditetapkan                       |
| Membuat soal dan pembahasan                                 | Tidak   | Ya                              | Ya                                     |
| Mengimpor soal                                              | Tidak   | Usulan: soal yang dikelolanya   | Ya                                     |
| Membuat, mengatur, menerbitkan paket                        | Tidak   | Tidak dalam baseline terbaru    | Ya                                     |
| Menilai esai                                                | Tidak   | Ya, sesuai penugasan            | Hak koreksi nilai belum ditetapkan     |
| Mengelola pengguna                                          | Tidak   | Tidak                           | Ya                                     |
| Memberikan status member                                    | Tidak   | Ya                              | Ya                                     |
| Mencabut status member                                      | Tidak   | Belum ditetapkan                | Ya, sebagai turunan pengelolaan member |
| Mengelola voucher dan memantau pembayaran                   | Tidak   | Tidak                           | Ya                                     |

Keputusan terbaru “paket oleh admin” digunakan sebagai baseline bahwa admin membuat dan menerbitkan paket. Ini menggantikan rencana awal pengajar membuat paket. Pengajar tetap membuat soal dan menilai esai. Batas akses pengajar pada soal milik pengajar lain serta cara penugasan penilaian masih terbuka.

Member adalah status peserta, bukan peran keempat. Admin maupun pengajar dapat memberikan status tersebut. Member otomatis memperoleh akses semua paket, dapat melihat paket lintas jenjang, dan memiliki pengulangan tanpa batas. Masa berlaku member serta hak pengajar untuk mencabut status masih terbuka pada O-02.

## 4. Alur pengguna utama

### Pendaftaran dan personalisasi

Halaman publik → daftar dengan email atau Google → lengkapi nama/WhatsApp dan verifikasi yang diperlukan → pilih jenjang → pilih kelas yang sesuai → pilih rumpun belajar → isi maksimal tiga target studi bila memenuhi jenjang → pilih kesiapan → dashboard.

Target studi opsional dan dapat dilewati. Akun Google yang belum memiliki WhatsApp tetap perlu melengkapi data tersebut. Setiap login email/kata sandi peserta, pengajar, dan admin dilanjutkan dengan kode email; sesi baru diberikan setelah kode valid. Login Google tidak meminta kode email tambahan.

### Akses dan ujian

Dashboard/katalog sesuai jenjang untuk nonmember, atau lintas jenjang untuk member → detail paket → pemeriksaan akses member/pembelian/voucher → petunjuk dan aturan → mulai percobaan → jawab soal dengan timer → konfirmasi selesai atau batas waktu tercapai → hasil dan pembahasan.

Untuk timer per subtes, saat waktunya habis jawaban subtes tersebut dikunci. Jika perpindahan otomatis nonaktif, peserta menekan “Lanjut ke subtes berikutnya”; jika aktif, sistem memindahkan peserta secara otomatis. Durasi subtes berikutnya mulai dihitung saat subtes itu dimulai; tidak ada tambahan waktu untuk subtes yang habis. Larangan kembali default nonaktif, tetapi kembali ke subtes yang waktunya habis tidak membuka kembali pengubahan jawaban. Pada subtes terakhir, kehabisan waktu menyelesaikan percobaan; tidak menunggu tombol lanjut ke subtes yang tidak ada. Perilaku memulai timer berikutnya dan penyelesaian subtes terakhir merupakan turunan yang perlu diuji.

Kelanjutan: buka kembali percobaan yang belum selesai → pulihkan jawaban → hitung sisa waktu dari batas waktu yang sama. Membuka ulang halaman tidak memulai percobaan atau timer baru.

### Pengelolaan dan penilaian

Pengajar menyusun atau mengimpor soal → admin merangkai paket, mengatur nilai/waktu/akses, menerbitkan → peserta mengerjakan → soal otomatis dinilai → pengajar menilai esai → hasil menjadi final → leaderboard diperbarui.

## 5. Functional Requirements (FR)

Prioritas **P0** berarti wajib untuk penerimaan MVP UAS. **P1-usulan** berarti pendukung yang belum menjadi komitmen MVP. Seluruh FR di bawah adalah P0 kecuali dinyatakan lain. UTS hanya mencakup representasi tampilannya, bukan bukti integrasi berfungsi.

### 5.1 Akun, personalisasi, dan katalog

| ID    | Kebutuhan dan penerimaan                                                                                                                                                                                                                          | Dasar                                       |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| FR-01 | Halaman publik memperkenalkan Titik Terampil, manfaat try out, dan pintu masuk daftar/login serta katalog; informasi promosi dapat ditampilkan tanpa akun. Isi promosi disediakan client.                                                         | Disepakati; rincian turunan                 |
| FR-02 | Peserta dapat mendaftar dengan email/kata sandi atau Google. Registrasi meminta nama dan WhatsApp; email tidak boleh membentuk akun ganda tanpa penanganan yang jelas. Kebijakan penggabungan akun mengikuti O-01.                                | Disepakati; validasi turunan                |
| FR-03 | Login email/kata sandi dan Google tersedia; logout mengakhiri sesi pengguna. Reset kata sandi melalui email menjadi usulan pendukung pemulihan akun.                                                                                              | Disepakati; logout turunan; reset P1-usulan |
| FR-04 | Peserta, pengajar, dan admin wajib memasukkan kode email setiap login email/kata sandi; sesi login tidak diberikan sebelum kode valid. Login Google tidak memerlukan kode email tambahan. Kode salah, kedaluwarsa, dan sudah terpakai ditolak.    | Disepakati; validasi turunan                |
| FR-05 | Personalisasi meminta jenjang terlebih dahulu; pilihan kelas berubah sesuai jenjang. SD dimulai kelas 4, SMP kelas 7–9, SMA/SMK kelas 10–12 dan gap year. Pilihan kategori umum masih terbuka.                                                  | Disepakati; pemetaan kelas turunan          |
| FR-06 | Peserta memilih rumpun belajar dan kesiapan. Kesiapan: Masih mencari arah, Cukup siap, Sangat siap. Daftar rumpun serta kewajiban pengisian mengikuti O-07.                                                                                       | Disepakati                                  |
| FR-07 | SMA/SMK dan gap year dapat menyimpan 0–3 pasangan kampus/program studi berurutan. Pilihan pertama menjadi target utama; empat pilihan ditolak; target dapat diubah dari profil.                                                                  | Disepakati                                  |
| FR-08 | Dashboard/profil menampilkan jenjang, kelas, rumpun, kesiapan dan target utama yang tersedia. Kondisi belum ada target/hasil ditampilkan jelas tanpa skor atau rekomendasi buatan.                                                                | Disepakati; kondisi kosong turunan          |
| FR-09 | Setelah login, katalog nonmember hanya menampilkan jenjang peserta, termasuk pembatasan tautan langsung. Member dapat melihat dan mengakses paket lintas jenjang. Jenjang profil tetap dipakai untuk personalisasi dan pengelompokan leaderboard. | Disepakati; pemeriksaan akses turunan       |
| FR-10 | Detail paket menampilkan nama, jenis latihan, jenjang/kelas yang relevan, jumlah soal/subtes, durasi, harga, akses, batas pengulangan, dan aturan penilaian sebelum mulai. Pencarian/filter mata pelajaran adalah P1-usulan.                      | Turunan                                     |

### 5.2 Akses, member, voucher, pembayaran

| ID    | Kebutuhan dan penerimaan                                                                                                                                                                                                                                                                              | Dasar                                |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| FR-11 | Peserta nonmember dapat memperoleh akses per paket melalui pembelian atau voucher. Sistem mengecek akses pada awal ujian, bukan hanya menyembunyikan tombol.                                                                                                                                          | Disepakati; pemeriksaan turunan      |
| FR-12 | Admin dan pengajar dapat memberikan status member. Saat aktif, peserta otomatis memperoleh akses semua paket lintas jenjang dan pengulangan tanpa batas. Admin dapat mencabut status sebagai turunan pengelolaan member; hak pencabutan pengajar, masa berlaku, dan dampak pencabutan mengikuti O-02. | Disepakati; pencabutan admin turunan |
| FR-13 | Admin membuat voucher pembuka akses gratis dan menentukan paket yang dicakup. Aturan masa berlaku, kuota, pemakaian per akun dan distribusi mengikuti O-03. Voucher bukan diskon dalam MVP.                                                                                                           | Disepakati                           |
| FR-14 | Penukaran voucher valid membuka akses paket dan mencatat pemakaiannya. Voucher tidak valid ditolak dengan pesan yang membantu; kirim ulang permintaan tidak menggandakan pemakaian yang sama.                                                                                                         | Turunan                              |
| FR-15 | Pembelian per paket direncanakan melalui Midtrans dan harus dapat menerima pembayaran produksi. Tim mahasiswa menyiapkan integrasi/merchant dengan data serta kepemilikan operasional yang disepakati bersama client.                                                                                 | Disepakati; kepemilikan terbuka      |
| FR-16 | Peserta melihat status pesanan: menunggu, berhasil, gagal/kedaluwarsa, serta tautan melanjutkan pembayaran bila masih berlaku. Pemetaan status provider dan kanal pembayaran ditetapkan saat integrasi.                                                                                               | Turunan                              |
| FR-17 | Akses berbayar hanya aktif setelah backend memverifikasi transaksi berhasil, kecocokan pesanan dan nominal. Halaman kembali dari pembayaran tidak menjadi satu-satunya bukti keberhasilan. Notifikasi transaksi berulang tidak membuat akses/pembayaran ganda.                                        | Turunan                              |
| FR-18 | Admin dapat melihat pesanan beserta peserta, paket, nominal, status, waktu, dan referensi transaksi. Peserta hanya dapat melihat transaksi miliknya. Refund/dispute belum termasuk alur mandiri MVP.                                                                                                  | Disepakati; rincian turunan          |
| FR-19 | Admin mengatur jumlah percobaan peserta nonmember pada paket. Sistem menolak mulai ulang jika jatah habis, sedangkan member tidak terkena batas tersebut. Kapan jatah dianggap terpakai mengikuti O-03.                                                                                               | Disepakati                           |

### 5.3 Soal dan paket

| ID    | Kebutuhan dan penerimaan                                                                                                                                                                                                                                                                                                                                                                                                         | Dasar                                            |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| FR-20 | Pengajar/admin dapat menyusun soal dengan jenjang, kelas/mata pelajaran yang relevan, tipe, isi, pilihan/kunci, bobot, gambar, dan pembahasan. Hak akses antar pengajar mengikuti O-08.                                                                                                                                                                                                                                          | Disepakati; metadata turunan                     |
| FR-21 | Mendukung pilihan tunggal, pilihan beberapa jawaban, benar/salah, isian singkat, dan esai. Input peserta serta validasi kunci mengikuti tipe soal; esai tidak dipaksa memiliki kunci otomatis.                                                                                                                                                                                                                                   | Disepakati                                       |
| FR-22 | Bobot setiap soal sama secara default dan dapat diubah. Besaran bobot default, validasi rentang, dan skala skor akhir mengikuti O-04.                                                                                                                                                                                                                                                                                            | Disepakati                                       |
| FR-23 | Soal pilihan beberapa jawaban memiliki opsi harus tepat seluruhnya atau memperoleh nilai sebagian. Tersedia opsi pengurangan nilai untuk pilihan salah. Rumus, besaran penalti, dan nilai minimum mengikuti O-04.                                                                                                                                                                                                                | Disepakati                                       |
| FR-24 | Gambar dapat diunggah dan ditampilkan pada soal. Dukungan gambar dalam opsi/pembahasan, format dan ukuran mengikuti O-08; kegagalan unggah tidak boleh menghapus teks yang telah diisi.                                                                                                                                                                                                                                          | Disepakati; penanganan gagal turunan             |
| FR-25 | Admin dapat mengimpor CSV/Excel melalui template terdokumentasi. Sebelum simpan, tampilkan jumlah valid dan kesalahan per baris; impor tidak boleh diam-diam mengubah tipe/kunci. Format gambar, duplikasi dan kebijakan impor sebagian mengikuti O-08.                                                                                                                                                                          | Disepakati; validasi turunan                     |
| FR-26 | Admin membuat, mengubah, menyusun soal/subtes, mengatur harga/akses, serta menerbitkan paket. Paket belum lengkap tidak dapat diterbitkan. Usulan status: draf, terbit, arsip.                                                                                                                                                                                                                                                   | Disepakati; siklus status usulan                 |
| FR-27 | Paket mendukung timer keseluruhan atau timer per subtes. Durasi, urutan, serta aturan penilaian ditentukan sebelum diterbitkan dan terlihat sebelum ujian.                                                                                                                                                                                                                                                                       | Disepakati                                       |
| FR-28 | Tersedia dua opsi terpisah: pindah subtes otomatis saat waktunya habis dan larangan kembali ke subtes sebelumnya. Keduanya default nonaktif. Ketika waktu habis, jawaban subtes dikunci; bila perpindahan otomatis nonaktif peserta menekan “Lanjut ke subtes berikutnya”, bila aktif sistem langsung berpindah. Kembali ke subtes yang habis tidak mengizinkan perubahan jawaban. Detail maju lebih awal/jeda mengikuti O-05. | Disepakati; penguncian dan alur manual disetujui |
| FR-29 | Setiap percobaan menyimpan versi soal, bobot, dan aturan yang digunakan agar perubahan paket tidak mengubah hasil lama tanpa proses yang disetujui. Kebijakan revisi paket berpengaruh leaderboard mengikuti O-10.                                                                                                                                                                                                               | Turunan                                          |

### 5.4 Pengerjaan dan pemulihan

| ID    | Kebutuhan dan penerimaan                                                                                                                                                                                                                             | Dasar                        |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| FR-30 | Ujian dimulai setelah aksi eksplisit peserta; waktu akhir ditetapkan server. Akses dan jatah dicek ulang untuk mencegah percobaan ganda karena klik berulang.                                                                                        | Turunan                      |
| FR-31 | Peserta dapat menjawab sesuai tipe soal dan berpindah nomor yang diizinkan. Nomor soal menampilkan status belum dijawab/terjawab; tanda ragu dan hapus jawaban adalah P1-usulan dari referensi.                                                      | Disepakati; navigasi turunan |
| FR-32 | Jawaban disimpan selama pengerjaan; antarmuka membedakan tersimpan di perangkat, menunggu sinkron, dan tersimpan di server. Saat koneksi pulih, perubahan yang masih sah disinkronkan tanpa menimpa jawaban lebih baru secara diam-diam.             | Disepakati; rincian turunan  |
| FR-33 | Saat halaman tertutup atau dimuat ulang, percobaan dapat dilanjutkan dengan jawaban tersimpan dan batas waktu semula. Timer tidak direset/ditunda. Dukungan lintas perangkat belum disepakati.                                                       | Disepakati                   |
| FR-34 | Batas waktu berlaku meskipun peserta offline. Sistem tidak menerima jawaban baru setelah batas waktu yang sah. Saat batas waktu habis, hasil difinalisasi dari jawaban yang diterima sesuai kebijakan O-06; tidak bergantung pada tab tetap terbuka. | Turunan                      |
| FR-35 | Pengiriman manual menampilkan ringkasan jawaban dan konfirmasi. Pengiriman ulang akibat gangguan jaringan menghasilkan percobaan selesai yang sama, bukan hasil ganda. Setelah selesai, jawaban tidak dapat diedit.                                  | Turunan                      |

### 5.5 Hasil, esai, leaderboard

| ID    | Kebutuhan dan penerimaan                                                                                                                                                                                                     | Dasar                                   |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| FR-36 | Setelah selesai, sistem menampilkan skor otomatis dan rekap benar/salah/kosong. Jika ada esai belum dinilai, tampilkan status sementara dan jumlah menunggu penilaian; jangan menganggapnya salah tanpa aturan.              | Disepakati; kejelasan status turunan    |
| FR-37 | Pengajar melihat esai sesuai penugasan dan memasukkan nilai dalam batas bobot soal. Setelah seluruh esai selesai dinilai, skor total diperbarui menjadi final. Rubrik, komentar dan perubahan nilai mengikuti O-08.          | Disepakati; batas nilai turunan         |
| FR-38 | Pembahasan langsung tersedia setelah peserta menyelesaikan percobaan, termasuk paket yang esainya masih dinilai. Review menampilkan soal, jawaban peserta, kunci yang relevan, dan pembahasan.                               | Disepakati                              |
| FR-39 | Peserta dapat melihat riwayat percobaan dan membuka kembali hasil/pembahasannya. Percobaan lama tidak hilang ketika peserta mengulang.                                                                                       | Turunan                                 |
| FR-40 | Leaderboard dipisah per paket dan jenjang, menggunakan nilai terbaik setiap peserta dari percobaan final. Peserta memiliki satu entri per leaderboard.                                                                       | Disepakati; satu entri turunan          |
| FR-41 | Percobaan dengan esai belum dinilai tidak masuk leaderboard. Jika ada percobaan sebelumnya yang sudah final, nilai terbaik final tersebut tetap menjadi kandidat. Setelah esai selesai, hitung ulang kandidat nilai terbaik. | Disepakati; kandidat sebelumnya turunan |
| FR-42 | Skor seri, tampilan identitas peserta, dan akibat perubahan jenjang/versi soal ditetapkan sebelum leaderboard diterima. Sampai keputusan tersedia, tidak mengklaim aturan seri tertentu.                                     | Terbuka O-10                            |

## 6. Aturan bisnis dan pengaturan

| Aturan                     | Nilai/ketentuan                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| Segmentasi                 | SD, SMP, SMA/SMK, umum; gap year di SMA/SMK; katalog nonmember sesuai jenjang, member lintas jenjang |
| Model pembelian            | Per paket, bukan langganan                                                                           |
| Status member              | Dapat diberikan admin dan pengajar; akses semua paket lintas jenjang; pengulangan tidak terbatas     |
| Peserta nonmember          | Batas pengulangan diatur admin                                                                       |
| Target studi               | Opsional, maksimal tiga berurutan; hanya SMA/SMK/gap year                                            |
| Penggunaan personalisasi   | Disimpan/ditampilkan; belum menjadi mesin rekomendasi                                                |
| Bobot soal                 | Sama secara default; dapat berbeda per soal; angka belum dipilih                                     |
| Nilai sebagian             | Opsi tersedia; rumus belum ditentukan                                                                |
| Penalti salah              | Opsi tersedia; default dan besaran belum ditentukan                                                  |
| Timer                      | Seluruh paket atau per subtes                                                                        |
| Pindah subtes otomatis     | Default nonaktif                                                                                     |
| Waktu subtes habis         | Jawaban subtes dikunci; jika tidak otomatis, peserta menekan tombol lanjut                           |
| Larangan kembali ke subtes | Default nonaktif                                                                                     |
| 2FA kode email             | Wajib semua peran setiap login email/kata sandi; login Google dikecualikan                           |
| Pembahasan                 | Langsung setelah selesai                                                                             |
| Skor esai                  | Manual; skor sementara menjadi final setelah penilaian lengkap                                       |
| Leaderboard                | Nilai terbaik final, per paket dan jenjang                                                           |
| Infrastruktur              | VPS, Docker, Next.js, PostgreSQL                                                                     |

Pemakaian kata “mengikuti UTBK” merujuk kemampuan mengatur subtes/waktu, bukan janji kesetaraan metode penilaian atau format resmi. Struktur UTBK yang digunakan pada konten perlu ditetapkan client sebelum paket dibuat.

## 7. Model status dan data konseptual

Status percobaan yang diusulkan: belum mulai → berlangsung → selesai menunggu esai → final. Paket tanpa esai dapat langsung final. “Waktu habis” menjadi alasan penyelesaian, bukan percobaan baru. “Putus koneksi” merupakan kondisi sinkronisasi, bukan jeda timer.

Data minimum yang diperlukan:

| Kelompok       | Data utama                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------- |
| Akun           | Nama, email, metode login, WhatsApp, peran, status member, identitas verifikasi                    |
| Profil belajar | Jenjang, kelas, rumpun, kesiapan, target studi berurutan                                           |
| Konten         | Soal, tipe, opsi/kunci, bobot, pembahasan, gambar, pemilik/penugasan                               |
| Paket          | Nama, jenjang/kelas, kategori, susunan soal/subtes, harga, waktu, aturan nilai, pengulangan, versi |
| Akses          | Sumber akses: member, voucher, atau pembayaran; paket, peserta, masa berlaku bila dipakai          |
| Voucher        | Kode, cakupan, aturan pemakaian, catatan penukaran                                                 |
| Transaksi      | Peserta, paket, nominal, referensi provider, status, waktu                                         |
| Percobaan      | Peserta, paket/versi, waktu mulai/akhir, jawaban tersimpan, nilai otomatis/esai, status final      |
| Penilaian      | Penilai, soal esai, nilai, waktu, riwayat perubahan yang diperlukan                                |

Ini model konseptual untuk kebutuhan produk; bukan keputusan skema tabel database.

## 8. Non-Functional Requirements (NFR)

NFR berkategori **usulan angka** harus ditinjau sebelum menjadi target kontraktual. Angka tersebut bukan hasil pengukuran VPS yang belum dipilih. Target 100 akun tidak berarti 100 peserta bersamaan.

| ID     | Kebutuhan               | Kriteria verifikasi                                                                                                                                                                                                                                                                                                                                   | Status                                    |
| ------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| NFR-01 | Kapasitas akun          | Sistem menampung minimal 100 akun dengan pemisahan data tiap pengguna.                                                                                                                                                                                                                                                                                | Disepakati                                |
| NFR-02 | Beban bersamaan         | Uji beban dengan C peserta aktif, termasuk penyimpanan jawaban dan pengiriman serentak; C ditetapkan pada O-09.                                                                                                                                                                                                                                       | Terbuka                                   |
| NFR-03 | Kecepatan halaman       | Usulan: dashboard/katalog dapat digunakan dalam ≤3 detik pada ponsel dan kondisi jaringan uji yang dicatat.                                                                                                                                                                                                                                          | Usulan angka                              |
| NFR-04 | Respons simpan jawaban  | Usulan: 95% permintaan simpan mendapat respons ≤2 detik pada beban C yang disepakati, tanpa kehilangan jawaban yang diakui server.                                                                                                                                                                                                                   | Usulan angka                              |
| NFR-05 | Keandalan jawaban       | Jawaban yang telah diakui server tetap ada setelah reload/restart aplikasi; draf lokal dan antrean sinkron diuji dengan putus-sambung koneksi.                                                                                                                                                                                                        | Turunan                                   |
| NFR-06 | Integritas waktu        | Timer mengacu server; perubahan jam perangkat/reload tidak menambah durasi. Batas waktu sama sebelum dan sesudah pemulihan.                                                                                                                                                                                                                           | Turunan                                   |
| NFR-07 | Keamanan akses          | Setiap operasi memeriksa peran dan kepemilikan data di server; peserta tidak dapat mengakses kunci sebelum selesai atau hasil orang lain melalui URL.                                                                                                                                                                                                 | Turunan                                   |
| NFR-08 | Keamanan autentikasi    | Kata sandi tidak disimpan sebagai teks biasa; login email/kata sandi semua peran belum menghasilkan sesi penuh sebelum kode email valid, sedangkan login Google dikecualikan. Kode hanya sekali pakai dan dibatasi masa berlaku, pengiriman, serta percobaan. Usulan: berlaku 5 menit, jeda kirim ulang 60 detik, maksimal 5 percobaan per tantangan. | Disepakati; kontrol turunan; angka usulan |
| NFR-09 | Keamanan pembayaran     | Rahasia pembayaran berada di server; verifikasi transaksi dan pengiriman notifikasi berulang diuji; data pembayaran sensitif tidak dicatat dalam log aplikasi.                                                                                                                                                                                        | Turunan                                   |
| NFR-10 | Keamanan unggahan/impor | Batasi ukuran/format; file tidak dieksekusi sebagai kode; teks soal/pembahasan tidak dapat menyisipkan skrip aktif. Batas file diputuskan pada O-08.                                                                                                                                                                                                  | Turunan                                   |
| NFR-11 | Responsivitas           | Alur inti dapat dipakai pada lebar 360, 768, dan 1280 piksel tanpa tombol tertutup atau gulir horizontal halaman; tabel kompleks memiliki perilaku yang disengaja.                                                                                                                                                                                    | Disepakati; ukuran uji usulan             |
| NFR-12 | Aksesibilitas dasar     | Form memiliki label; fokus keyboard terlihat; jawaban/timer dapat dipahami tanpa mengandalkan warna saja; teks serta kontrol terbaca dengan pembesaran.                                                                                                                                                                                               | Usulan                                    |
| NFR-13 | Konsistensi nilai       | Konfigurasi dan jawaban sama menghasilkan nilai sama; pengiriman atau notifikasi ulang tidak menggandakan hasil/akses.                                                                                                                                                                                                                                | Turunan                                   |
| NFR-14 | Keterlacakan            | Catat perubahan member, penerbitan paket, transaksi, dan penilaian esai dengan pelaku/waktu, tanpa menyimpan kata sandi/kode 2FA dalam log.                                                                                                                                                                                                           | Turunan                                   |
| NFR-15 | Pencadangan/pemulihan   | Usulan: cadangan database harian dan uji pemulihan ke lingkungan terpisah; target kehilangan data ≤24 jam dan pulih ≤4 jam perlu disetujui.                                                                                                                                                                                                         | Usulan angka                              |
| NFR-16 | Ketersediaan            | Usulan: target bulanan 99% di luar pemeliharaan terjadwal; metode pemantauan dan kesiapan operasional perlu disepakati.                                                                                                                                                                                                                               | Usulan angka                              |
| NFR-17 | Privasi                 | WhatsApp/email tidak muncul pada leaderboard; akses data dibatasi peran. Kebijakan pengumpulan, penyimpanan dan penghapusan data ditetapkan bersama client.                                                                                                                                                                                           | Turunan; kebijakan terbuka                |
| NFR-18 | Kemudahan pemeliharaan  | Proyek mempunyai petunjuk menjalankan Docker, konfigurasi lingkungan, migrasi PostgreSQL, backup/restore, serta deploy ke VPS.                                                                                                                                                                                                                        | Turunan dari stack                        |
| NFR-19 | Lingkungan terpisah     | Pengujian menggunakan konfigurasi/data uji, pembayaran produksi memakai konfigurasi produksi; rahasia tidak dimasukkan ke repositori atau tampilan peserta.                                                                                                                                                                                           | Turunan                                   |
| NFR-20 | Kompatibilitas          | Usulan: alur inti diuji di Chrome desktop/Android dan Safari iOS yang tersedia saat penerimaan; daftar versi dicatat pada hasil uji.                                                                                                                                                                                                                  | Usulan                                    |

## 9. Struktur halaman dan pembagian enam anggota

Pembagian berikut adalah usulan area kepemilikan, bukan penugasan nama. Setiap orang menangani minimal satu halaman serta fungsi terkait. Jumlah halaman tidak harus sama karena kompleksitas ujian, pembayaran dan penilaian berbeda.

| Anggota | Halaman/area utama                                                     | Integrasi yang menjadi tanggung jawab                                |
| ------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1       | Halaman publik, daftar, login, verifikasi email                        | Akun, Google, 2FA, sesi                                              |
| 2       | Personalisasi, dashboard, profil, katalog/detail paket                 | Segmentasi jenjang, data profil, tampilan status akses               |
| 3       | Akses paket, voucher, checkout, status transaksi                       | Midtrans, akses member, catatan transaksi                            |
| 4       | Petunjuk dan ruang ujian                                               | Timer, input lima tipe soal, penyimpanan/pemulihan, pengiriman       |
| 5       | Soal/impor, penilaian esai, dan pemberian status member untuk pengajar | Validasi konten, file, daftar penilaian, pencatatan pemberian member |
| 6       | Admin pengguna/member/paket serta hasil/leaderboard                    | Publikasi paket, aturan nilai, agregasi hasil                        |

Area anggota 6 cukup besar; sebelum pengerjaan, hasil/leaderboard dapat dipindahkan ke anggota 2 atau dikerjakan bersama anggota 4. Aturan data, akun, dan penilaian perlu disepakati bersama agar pembagian halaman tidak menghasilkan enam bagian yang sulit dihubungkan.
