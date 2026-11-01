/**
 * Modul: P02 — Pemilihan sesi demo
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Implementasikan form login yang sesungguhnya pada tahap berikutnya.
 */
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from './DemoProvider';

/**
 * Menampilkan pemilihan peran untuk mencoba aplikasi frontend.
 * @returns {React.ReactElement} Halaman masuk demo tanpa kredensial sungguhan.
 */
export function DemoLogin() {
  // 1. Baca operasi sesi dan router di komponen client.
  const { signIn } = useDemo();
  const router = useRouter();
  const roles = [['student', 'Siswa'], ['teacher', 'Pengajar'], ['admin', 'Administrator']];

  /**
   * Mengaktifkan sesi demo kemudian membuka dashboard peran.
   * @param {string} role - Peran yang dipilih pada tombol.
   * @returns {void} Menavigasi hanya jika signIn menerima peran.
   */
  function handleLogin(role) {
    // 1. Minta provider memvalidasi pilihan dan memperbarui sesi.
    const accepted = signIn(role);
    if (!accepted) return;
    // 2. TODO: Untuk login sebenarnya, tangani validasi form, loading dan error.
    // 3. Buka dashboard yang sesuai dengan sesi demo yang baru dibuat.
    router.push('/' + role + '/dashboard');
  }

  // 2. TODO: Ganti tombol demo dengan form identitas ketika autentikasi dikembangkan.
  // 3. Tetap jelaskan keterbatasan demo agar tidak dimaknai sebagai login produksi.
  return (
    <main id="main" className="auth-page">
      <Link className="brand" href="/">titik<span>terampil.</span></Link>
      <section className="panel">
        <p className="eyebrow">DEMO FRONTEND</p>
        <h1>Mulai dari peranmu.</h1>
        <p>Pilih ruang yang ingin dijelajahi. Belum menggunakan akun atau sandi sungguhan.</p>
        <div className="stack">
          {roles.map(([role, label]) => (
            <button key={role} onClick={() => handleLogin(role)}>Masuk sebagai {label} →</button>
          ))}
        </div>
        <Link href="/register">Lihat kerangka pendaftaran</Link>
      </section>
    </main>
  );
}
