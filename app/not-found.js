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
    <main id="main" className="auth-page">
      <h1>Halaman tidak ditemukan</h1>
      <Link href={homeHref}>Kembali ke beranda</Link>
    </main>
  );
}
