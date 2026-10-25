/**
 * Modul: P01 — Presentasi layanan publik
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Validasi konten komersial dan CTA bersama klien.
 */
import Link from 'next/link';

/**
 * Menampilkan pengenalan program dan akses menuju demo aplikasi.
 * @returns {React.ReactElement} Landing page responsif dengan pilihan jenjang.
 */
export function Landing() {
  // 1. Susun navigasi publik dan CTA menuju login demo.
  // 2. Tampilkan manfaat belajar, tahapan kegiatan dan pilihan jenjang.
  // 3. TODO: Ganti konten contoh dengan program, kontak dan aset resmi Titik Terampil.
  // 4. TODO: Verifikasi informasi program dan tautan sebelum dipublikasikan.
  return <main id="main" className="landing"><header className="landing-nav"><Link className="brand" href="/">titik<span>terampil.</span></Link><nav aria-label="Menu beranda"><a href="#program">Program belajar</a><Link className="button" href="/login">Masuk →</Link></nav></header><section className="hero"><div><p className="eyebrow">SATU LANGKAH LEBIH SIAP</p><h1>Belajar terarah.<br/>Berani melangkah<span>.</span></h1><p>Ruang belajar dan latihan tryout untuk menemukan potensi terbaikmu. Dari SD, SMP, hingga SMA.</p><div className="actions"><Link className="button" href="/login">Jelajahi demo →</Link><a href="#program">Kenali program kami ↗</a></div><p className="muted">Prototipe frontend · Seluruh konten masih berupa contoh</p></div><div className="hero-board"><p className="eyebrow">PETA BELAJARMU</p><div className="board-number">01<span> / mulai dari sini</span></div><h2>Langkah kecil.<br/>Kemajuan berarti.</h2><div className="board-row"><span>Pelajari materi</span><b>01 ↗</b></div><div className="board-row"><span>Latihan & tryout</span><b>02 ↗</b></div><div className="board-row"><span>Evaluasi hasilmu</span><b>03 ↗</b></div></div></section><section id="program"><p className="eyebrow">UNTUK SETIAP TAHAP BELAJAR</p><h2>Temukan titik awalmu.</h2><div className="grid">{[['SD','Kelas 1–6','Bangun fondasi dan rasa ingin tahu.'],['SMP','Kelas 7–9','Kuatkan pemahaman, asah kemampuan.'],['SMA','Kelas 10–12','Siapkan langkah menuju tujuan berikutnya.']].map(([level,grade,description]) => <article className="panel" key={level}><p className="eyebrow">{grade}</p><h3>{level}</h3><p>{description}</p><Link href="/login">Jelajahi ruang belajar →</Link></article>)}</div></section><footer>Titik Terampil · Kerangka MVP CBT & LMS · Kelompok PENGWEB</footer></main>;
}
