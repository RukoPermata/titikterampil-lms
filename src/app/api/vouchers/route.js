/**
 * Modul: Route Handler API Mock Vouchers
 * @author Tim Titik Terampil
 * Tanggung jawab: menyediakan data kode voucher gratis untuk diambil via Fetch API (Kriteria UTS Poin 2.2).
 */
import { NextResponse } from 'next/server';
import { vouchers } from '@/src/data/mock';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    count: vouchers.length,
    data: vouchers,
  });
}
