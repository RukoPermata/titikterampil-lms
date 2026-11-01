/**
 * Modul: Route Handler API Mock Leaderboard
 * @author Tim Titik Terampil
 * Tanggung jawab: menyediakan endpoint data leaderboard dinamis yang di-fetch oleh frontend (Kriteria UTS Poin 2.2).
 */
import { NextResponse } from 'next/server';
import { leaderboards } from '@/src/data/mock';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level') || 'SMA';

  const ranking = leaderboards[level] || leaderboards.SMA || [];

  return NextResponse.json({
    status: 'success',
    level,
    data: ranking,
  });
}
