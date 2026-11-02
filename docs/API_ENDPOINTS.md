# Daftar Endpoint Mock API Titik Terampil

Alamat lokal: `http://localhost:3000`. Semua path di bawah menggunakan awalan `/api`.

```text
/api
├── users                       GET, POST
│   └── [id]                    GET, PATCH, DELETE
├── tryouts                     GET, POST
│   └── [id]                    GET, PATCH, DELETE
├── questions                   GET, POST
│   └── [id]                    GET, PATCH, DELETE
├── vouchers                    GET, POST
│   └── [id]                    GET, PATCH, DELETE
├── transactions                GET, POST
│   └── [id]                    GET, PATCH
├── grading                     GET
│   └── [id]                    GET, PATCH
├── academics                   GET
├── leaderboard                 GET
├── admin
│   └── summary                 GET
├── classes                     GET
│   └── [id]                    GET
├── assignments                 GET
│   └── [id]                    GET
└── user                        GET (profil tunggal lama)
```

## Arti metode

- `GET`: mengambil daftar atau detail data.
- `POST`: menambahkan data demo; ID dibuat otomatis.
- `PATCH`: memperbarui sebagian field record, member, status transaksi, atau nilai esai.
- `DELETE`: menghapus record jika hubungan data mengizinkan.

## Contoh parameter URL

```text
/api/users?role=student&isMember=true
/api/users?role=teacher&q=nadia
/api/tryouts?level=SMP&grade=9
/api/questions?tryoutId=demo&type=essay
/api/vouchers?tryoutId=demo
/api/transactions?status=Berhasil
/api/grading?status=Perlu%20Dinilai
/api/grading?id=sub-01
/api/academics?level=SD
/api/leaderboard?level=SMA&limit=5
/api/user?id=student-demo
```

POST/PATCH menggunakan `Content-Type: application/json`. Respons daftar mempunyai
`status`, `count`, dan `data`; respons detail mempunyai `status` dan `data`.
Error handler mempunyai `status: "error"` dan `message` dengan kode HTTP yang sesuai.

Data awal berasal dari `src/data/mock.js`; perubahan demo disimpan di
`.next/cache/mock-api/state.json`. Leaderboard masih merupakan fixture per jenjang.
Transaksi dan nilai esai adalah simulasi, belum integrasi pembayaran atau scoring CBT.

Daftar field, validasi, penyimpanan, dan contoh fetch lengkap:
[MOCK_API.md](./MOCK_API.md).
