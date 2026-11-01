/**
 * Modul: P01: Presentasi layanan publik
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 */
import Link from 'next/link';

/**
 * Menampilkan landing page publik Bimbel Titik Terampil dan promosi tryout CBT gratis.
 * @returns {React.ReactElement} Antarmuka landing page publik responsif.
 */
export function Landing() {
  const levels = [
    {
      level: 'Sekolah Dasar',
      code: 'SD',
      grade: 'Kelas 4, 5, dan 6',
      description: 'Pemantapan konsep dasar berhitung, literasi sains, dan persiapan ujian sekolah dasar.',
    },
    {
      level: 'Sekolah Menengah Pertama',
      code: 'SMP',
      grade: 'Kelas 7, 8, dan 9',
      description: 'Latihan asesmen akademik berkala dan persiapan seleksi masuk SMA/SMK unggulan.',
    },
    {
      level: 'SMA dan SMK',
      code: 'SMA',
      grade: 'Kelas 10, 11, dan 12',
      description: 'Latihan soal formatif mata pelajaran, ujian sekolah, dan persiapan dini seleksi kampus.',
    },
    {
      level: 'Kategori Umum',
      code: 'Umum',
      grade: 'Alumni dan Gap Year',
      description: 'Simulasi intensif UTBK-SNBT, tes potensi skolastik, dan seleksi kedinasan.',
    },
  ];

  return (
    <main id="main" className="landing">
      {/* 1. Navigasi Publik */}
      <header className="landing-nav">
        <Link className="brand" href="/">
          titik<span>terampil.</span>
        </Link>
        <nav aria-label="Menu beranda">
          <a href="#promosi">Try Out Gratis</a>
          <a href="#jenjang">Jenjang Pendidikan</a>
          <a href="#keunggulan">Keunggulan CBT</a>
          <Link className="button" href="/login">
            Masuk
          </Link>
        </nav>
      </header>

      {/* 2. Hero Section */}
      <section className="hero">
        <div>
          <p className="eyebrow">BIMBINGAN BELAJAR PRIVAT DAN UMUM</p>
          <h1>
            Raih Prestasi Terbaik dengan Latihan Try Out Terarah<span>.</span>
          </h1>
          <p>
            Platform try out online berbasis CBT dari Bimbel Titik Terampil. Dapatkan akses try out gratis setiap bulan untuk menguji kesiapan belajar siswa SD, SMP, SMA/SMK, hingga Gap Year.
          </p>
          <div className="actions">
            <Link className="button" href="/register">
              Ikuti Try Out Gratis
            </Link>
            <Link className="button secondary" href="/login">
              Masuk ke Portal Ujian
            </Link>
          </div>
          <p className="muted" style={{ fontSize: '13px' }}>
            Akses terbuka untuk siswa Titik Terampil maupun peserta umum.
          </p>
        </div>

        {/* Hero Board / Kartu Promosi Bulanan */}
        <div className="hero-board" id="promosi">
          <p className="eyebrow">PROGRAM PROMOSI BIMBEL</p>
          <div className="board-number">
            FREE<span> / Try Out Bulanan</span>
          </div>
          <h2>Uji Kemampuan Akademik Setiap Bulan Tanpa Biaya</h2>
          <div className="board-row">
            <span>Akses Terbuka untuk Siswa dan Umum</span>
            <b>01</b>
          </div>
          <div className="board-row">
            <span>Analisis Hasil dan Pembahasan Mendalam</span>
            <b>02</b>
          </div>
          <div className="board-row">
            <span>Papan Peringkat / Leaderboard Nasional</span>
            <b>03</b>
          </div>
        </div>
      </section>

      {/* 3. Section Jenjang Pendidikan */}
      <section id="jenjang" style={{ margin: '60px 0' }}>
        <p className="eyebrow">PILIHAN JENJANG PENDIDIKAN</p>
        <h2>Disusun Khusus Sesuai Tingkat Belajar Siswa</h2>
        <div className="grid">
          {levels.map((item) => (
            <article className="panel" key={item.code} style={{ display: 'flex', flexDirection: 'column' }}>
              <p className="eyebrow">{item.grade}</p>
              <h3>{item.level}</h3>
              <p style={{ flex: 1 }}>{item.description}</p>
              <div style={{ marginTop: '20px' }}>
                <Link
                  href="/register"
                  className="button secondary"
                  style={{ width: '100%', whiteSpace: 'nowrap', padding: '11px 8px', fontSize: '13px' }}
                >
                  Daftar Try Out {item.code}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Section Keunggulan CBT */}
      <section id="keunggulan" style={{ margin: '60px 0 80px' }}>
        <p className="eyebrow">KEUNGGULAN PLATFORM CBT</p>
        <h2>Pengalaman Ujian Standar Nasional</h2>
        <div className="grid">
          <article className="panel">
            <p className="eyebrow">FITUR EVALUASI</p>
            <h3>Pembahasan Langsung</h3>
            <p className="muted">
              Kunci jawaban dan analisis langkah penyelesaian tersedia langsung setelah peserta menyelesaikan ujian, membantu evaluasi mandiri secara cepat.
            </p>
          </article>
          <article className="panel">
            <p className="eyebrow">ENGINE CBT</p>
            <h3>Timer dan Multi-Subtes</h3>
            <p className="muted">
              Mendukung simulasi timer per subtes dan 5 tipe soal sesuai standar asesmen nasional serta format UTBK-SNBT.
            </p>
          </article>
          <article className="panel">
            <p className="eyebrow">KOMPETISI SEHAT</p>
            <h3>Leaderboard Transparan</h3>
            <p className="muted">
              Pantau peringkat dan capaian skor terbaik Anda di antara sesama peserta pada jenjang yang sama secara transparan.
            </p>
          </article>
        </div>
      </section>

      {/* 5. Footer dan Kontak Bimbel */}
      <footer>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '28px', paddingBottom: '24px' }}>
          <div>
            <strong style={{ fontSize: '18px' }}>titikterampil.</strong>
            <p className="muted" style={{ margin: '8px 0 0', fontSize: '13px' }}>
              Lembaga Bimbingan Belajar Privat dan Umum untuk pendampingan akademik SD, SMP, SMA/SMK, hingga simulasi UTBK dan Ujian Mandiri.
            </p>
          </div>
          <div>
            <span className="eyebrow">PROGRAM BIMBEL</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0', fontSize: '13px', display: 'grid', gap: '6px' }}>
              <li>Bimbel Privat Guru ke Rumah</li>
              <li>Kelas Intensif Persiapan Ujian</li>
              <li>Program Try Out Online Bulanan</li>
              <li>Konsultasi Jurusan dan Kampus</li>
            </ul>
          </div>
          <div>
            <span className="eyebrow">KONTAK DAN KONSULTASI</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0', fontSize: '13px', display: 'grid', gap: '6px' }}>
              <li>WhatsApp: <b>0812-3456-7890</b></li>
              <li>Email: <b>kontak@titikterampil.id</b></li>
              <li>Operasional: Senin - Sabtu, 08.00 - 17.00 WIB</li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
          <small className="muted">
            Hak Cipta 2026/2027 Titik Terampil. Seluruh hak cipta dilindungi undang-undang.
          </small>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/login" className="button secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
              Masuk
            </Link>
            <Link href="/register" className="button" style={{ fontSize: '12px', padding: '6px 12px' }}>
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
