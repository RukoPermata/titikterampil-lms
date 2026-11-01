/**
 * Modul: Halaman 404
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Sesuaikan pesan navigasi dengan kebutuhan pengguna.
 */
import Link from 'next/link';

/**
 * Menyediakan jalur kembali saat route tidak ditemukan.
 * @returns {React.ReactElement} Pesan tidak ditemukan dan tautan ke beranda.
 */
export default function NotFound() {
  // 1. Gunakan pesan sederhana tanpa mengasumsikan pengguna sudah login.
  const homeHref = '/';
  // 2. TODO: Tambahkan ilustrasi resmi jika tersedia; tautan tetap dapat diakses keyboard.
  // 3. Tampilkan jalur pemulihan ke halaman publik.
  return (
    <main
      id="main"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <section
        className="panel"
        style={{
          maxWidth: '480px',
          width: '100%',
          margin: '0 auto',
          textAlign: 'center',
          padding: '44px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p className="eyebrow" style={{ margin: '0 auto 8px', textAlign: 'center' }}>
          404 NOT FOUND
        </p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.3rem)', margin: '0 auto 14px', textAlign: 'center' }}>
          Halaman Tidak Ditemukan
        </h1>
        <p
          className="muted"
          style={{
            margin: '0 auto 24px',
            textAlign: 'center',
            width: '100%',
            lineHeight: 1.6,
            fontSize: '14px',
          }}
        >
          Alamat yang Anda tuju tidak tersedia atau rute halaman belum terdaftar di sistem Titik Terampil.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Link className="button" href={homeHref}>
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
}
