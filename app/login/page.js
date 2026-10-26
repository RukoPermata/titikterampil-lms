/**
 * Modul: P02 — Masuk
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Tambahkan validasi kredensial dan hubungkan autentikasi saat backend tersedia.
 */
import { LoginForm } from '@/src/features/auth/components/LoginForm';

/**
 * Menampilkan halaman masuk (P02).
 * Menyediakan form login email/password serta akses cepat demo.
 * @returns {React.ReactElement} Komponen LoginForm.
 */
export default function LoginPage() {
  return <LoginForm />;
}
