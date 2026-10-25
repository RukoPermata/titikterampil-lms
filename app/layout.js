/**
 * Modul: Layout utama dan metadata
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Gunakan identitas visual resmi setelah disepakati.
 */
import './globals.css';
import { DemoProvider } from '@/src/components/DemoProvider';

export const metadata = {
  title: { default: 'Titik Terampil', template: '%s | Titik Terampil' },
  description: 'Kerangka frontend MVP CBT dan LMS untuk SD, SMP, SMA.',
};

/**
 * Menyusun dokumen utama dan menyediakan sesi demo lintas route.
 * @param {Object} props - Properti root layout.
 * @param {React.ReactNode} props.children - Halaman aktif dari App Router.
 * @returns {React.ReactElement} Dokumen HTML berbahasa Indonesia.
 */
export default function RootLayout({ children }) {
  // 1. Gunakan metadata dan stylesheet bersama agar identitas konsisten.
  // 2. TODO: Tambahkan ikon resmi dan metadata halaman saat aset klien tersedia.
  // 3. Pasang skip link, area body dan provider sesi di satu tempat.
  return (
    <html lang="id">
      <body>
        <a className="skip-link" href="#main">Lewati navigasi</a>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
