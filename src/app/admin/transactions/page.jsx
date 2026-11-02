/**
 * Modul: Halaman Daftar Transaksi Admin (Layar 27)
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: pemantauan transaksi seluruh peserta, nominal, status pembayaran, dan tanggal.
 */
import { TransactionsManagement } from '@/src/features/payment/components/TransactionsManagement';

export const metadata = {
  title: 'Daftar Transaksi',
  description: 'Pemantauan riwayat pembayaran paket tryout seluruh peserta dan status transaksi.',
};

/**
 * Merender antarmuka rekapitulasi transaksi seluruh peserta.
 * @returns {React.ReactElement} Halaman daftar transaksi.
 */
export default function AdminTransactionsPage() {
  return <TransactionsManagement />;
}
