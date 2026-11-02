/**
 * Modul: Halaman Manajemen Voucher Admin (Layar 26)
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: formulir pembuatan kode voucher dan tabel daftar voucher aktif beserta statistik.
 */
import { VouchersManagement } from '@/src/features/payment/components/VouchersManagement';

export const metadata = {
  title: 'Manajemen Voucher',
  description: 'Kelola kode voucher promo try out gratis dan statistik kuota penukaran.',
};

/**
 * Merender antarmuka manajemen voucher admin.
 * @returns {React.ReactElement} Halaman manajemen voucher.
 */
export default function AdminVouchersPage() {
  return <VouchersManagement />;
}
