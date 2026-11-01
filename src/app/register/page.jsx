/**
 * Modul: P03 — Daftar
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Buat form nama, email, sandi, jenjang dan tingkat kelas beserta validasinya.
 */
import { RegisterForm } from '@/src/features/auth/components/RegisterForm';

/**
 * Menampilkan pendaftaran siswa baru (P03).
 * @returns {React.ReactElement} Komponen RegisterForm.
 */
export default function RegisterPage() {
  return <RegisterForm />;
}
