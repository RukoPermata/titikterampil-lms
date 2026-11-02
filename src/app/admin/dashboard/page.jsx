/** Modul: Dashboard admin. PIC: Rayazka Aris (103022400096). */
import { AdminDashboard } from '@/src/features/admin-management/components/AdminDashboard';

export const metadata = { title: 'Dashboard admin' };

/** @returns {React.ReactElement} Dashboard yang membaca statistik mock API. */
export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
