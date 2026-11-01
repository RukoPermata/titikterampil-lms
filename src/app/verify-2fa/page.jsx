/**
 * Modul: Layar 04: Halaman Verifikasi Kode Email (2FA)
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: entry point rute verifikasi dua langkah setelah login email & kata sandi.
 */
import { TwoFactorForm } from '@/src/features/auth/components/TwoFactorForm';

export const metadata = {
  title: 'Verifikasi Dua Langkah',
  description: 'Verifikasi kode keamanan email akun Titik Terampil.',
};

/**
 * Menampilkan halaman verifikasi OTP 2FA.
 * @returns {React.ReactElement} Komponen TwoFactorForm.
 */
export default function VerifyTwoFactorPage() {
  return <TwoFactorForm />;
}
