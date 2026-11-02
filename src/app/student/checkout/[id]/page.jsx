/**
 * Modul: Halaman Checkout dan Status Pembayaran (Layar 09)
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: ringkasan pesanan, penukaran voucher, dan simulasi pembayaran dummy.
 */
import { CheckoutView } from '@/src/features/payment/components/CheckoutView';

export const metadata = {
  title: 'Checkout Paket Try Out',
  description: 'Ringkasan pesanan dan simulasi pembayaran paket tryout Titik Terampil.',
};

/**
 * Merender halaman checkout berdasarkan ID paket tryout.
 * @param {Object} props - Properti rute Next.js.
 * @param {Promise<{ id: string }>} props.params - Parameter dinamis URL.
 * @returns {Promise<React.ReactElement>} Halaman checkout.
 */
export default async function StudentCheckoutPage({ params }) {
  const { id } = await params;
  return <CheckoutView tryoutId={id} />;
}
