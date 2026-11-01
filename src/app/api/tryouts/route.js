/**
 * Modul: Route Handler API Mock Tryout
 * @author Tim Titik Terampil
 * Tanggung jawab: menyediakan endpoint data tryout dinamis yang di-fetch oleh frontend (Kriteria UTS Poin 2.2).
 */
import { NextResponse } from 'next/server';
import { tryouts } from '@/src/data/mock';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');

  const filtered = level
    ? tryouts.filter((t) => t.level === level)
    : tryouts;

  return NextResponse.json({
    status: 'success',
    count: filtered.length,
    data: filtered,
  });
}
