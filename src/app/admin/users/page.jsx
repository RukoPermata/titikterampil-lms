/** Modul: Manajemen pengguna. PIC: Rayazka Aris (103022400096). */
import { UsersManagement } from '@/src/features/admin-management/components/UsersManagement';

export const metadata = { title: 'Manajemen pengguna' };

/** @returns {React.ReactElement} Pengelolaan pengguna berbasis mock API. */
export default function UsersPage() {
  return <UsersManagement />;
}
