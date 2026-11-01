/**
 * Modul: Route Handler API Mock Transactions
 * @author Tim Titik Terampil
 * Tanggung jawab: menyediakan data transaksi pembayaran paket untuk diambil via Fetch API (Kriteria UTS Poin 2.2).
 */
import { NextResponse } from 'next/server';
import { transactions } from '@/src/data/mock';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    count: transactions.length,
    data: transactions,
  });
}
