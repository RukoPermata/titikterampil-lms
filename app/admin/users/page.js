/**
 * Modul: P19 — Manajemen Pengguna
 * @author Rayazka Aris (103022400096)
 * Tanggung jawab: menyediakan entry route dan metadata halaman pengguna admin.
 * @todo Hubungkan autentikasi server ketika backend dikembangkan.
 */
import { UserManagement } from '@/src/features/academic/components/UserManagement';

export const metadata = { title: 'Manajemen Pengguna' };

/**
 * Memasang komponen interaktif pada route /admin/users.
 * @returns {React.ReactElement} Direktori pengguna di dalam layout admin.
 * @remarks Page tetap server component; state dan event berada di UserManagement.
 */
export default function UsersPage() {
  // Batas server/client dipisah agar page tetap bisa mengekspor metadata Next.js.
  return <UserManagement />;
}
