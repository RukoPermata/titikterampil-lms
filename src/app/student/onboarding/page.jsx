/**
 * Modul: Layar 05: Halaman Personalisasi Awal / Onboarding
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: entry point rute personalisasi awal siswa baru sebelum masuk dashboard.
 */
import { OnboardingForm } from '@/src/features/student/components/OnboardingForm';

export const metadata = {
  title: 'Personalisasi Awal',
  description: 'Tentukan minat rumpun belajar dan target studi Anda.',
};

/**
 * Menampilkan halaman onboarding siswa baru.
 * @returns {React.ReactElement} Komponen OnboardingForm.
 */
export default function OnboardingPage() {
  return <OnboardingForm />;
}
