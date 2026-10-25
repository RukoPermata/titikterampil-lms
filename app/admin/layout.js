/**
 * Modul: Layout admin
 * @author Rayazka Aris (103022400096)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Lengkapi state kosong dan indikator navigasi.
 */
import { DashboardShell } from '@/src/components/DashboardShell';

/**
 * Menyediakan layout bersama untuk halaman admin.
 * @param {Object} props - Properti layout dari Next.js.
 * @param {React.ReactNode} props.children - Halaman peran yang sedang dibuka.
 * @returns {React.ReactElement} Halaman dalam shell dengan guard sesi demo.
 */
export default function AdminLayout({ children }) {
  // 1. Tetapkan peran yang dipersyaratkan oleh seluruh route di folder ini.
  const requiredRole = 'admin';
  // 2. TODO: Koordinasikan tambahan menu dengan pemilik halaman dan konfigurasi pages.
  // 3. Serahkan pembacaan sesi, guard tampilan dan navigasi ke shell bersama.
  return <DashboardShell role={requiredRole}>{children}</DashboardShell>;
}
