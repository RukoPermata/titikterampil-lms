/**
 * Modul: Navigasi dan pembatasan UI peran
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Tambahkan autentikasi sungguhan; guard UI bukan jaminan keamanan.
 */
'use client';
import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { pages, demoHref } from '@/src/config/pages';
import { useDemo } from './DemoProvider';

/**
 * Membungkus halaman peran dengan guard demo dan navigasi bersama.
 * @param {Object} props - Konfigurasi shell.
 * @param {string} props.role - Peran yang diizinkan membuka halaman.
 * @param {React.ReactNode} props.children - Halaman milik peran tersebut.
 * @returns {React.ReactElement} Shell atau petunjuk memilih sesi yang benar.
 */
export function DashboardShell({ role, children }) {
  // 1. Baca sesi dan alamat aktif untuk status menu.
  const { user, signOut } = useDemo();
  const pathname = usePathname();
  // Hindari perbedaan render SSR dan hidrasi client dengan useSyncExternalStore
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!isMounted) {
    return (
      <main id="main" className="auth-page" style={{ opacity: 0 }}>
        <section className="panel" />
      </main>
    );
  }
  // 2. Tampilkan petunjuk bila sesi kosong atau perannya tidak cocok.
  // TODO: Proteksi data di server ketika backend tersedia; guard ini hanya membatasi UI.
  if (!user || user.role !== role) {
    return (
      <main id="main" className="auth-page">
        <section className="panel">
          <p className="eyebrow">AKSES DEMO</p>
          <h1>Pilih peran yang sesuai</h1>
          <p>Halaman ini memerlukan sesi demo {role}. Sesi hilang saat halaman dimuat ulang.</p>
          <Link className="button" href="/login">Pilih peran</Link>
        </section>
      </main>
    );
  }

  // 3. Hanya halaman utama yang menjadi menu; detail dibuka melalui modulnya.
  const navigation = pages.filter((page) => page.role === role && !page.route.includes('[id]'));
  const roleLabel = { student: 'SISWA', teacher: 'PENGAJAR', admin: 'ADMIN' }[role];

  // 4. TODO: Tentukan penyorotan menu induk saat halaman detail sedang aktif.
  // 5. Render navigasi dan satu area konten utama yang konsisten.
  return (
    <div className="app-shell">
      <aside className="sidebar" style={{ minWidth: 0 }}>
        <Link className="brand" href="/">titik<span>terampil.</span></Link>
        <p className="eyebrow">RUANG {roleLabel}</p>
        <nav aria-label="Menu utama">
          {navigation.map((page) => (
            <Link
              aria-current={pathname === page.route ? 'page' : undefined}
              className={pathname === page.route ? 'active' : ''}
              key={page.id}
              href={demoHref(page.route)}
            >
              {page.title}
            </Link>
          ))}
        </nav>
        <button className="secondary" onClick={signOut}>Keluar dari demo</button>
        <small>Frontend MVP · Data contoh</small>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>Tahun ajaran 2026/2027</span>
          <span>{user.name} · {role}</span>
        </header>
        <main id="main">{children}</main>
      </div>
    </div>
  );
}
