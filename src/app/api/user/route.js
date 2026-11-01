/**
 * Modul: Route Handler API Mock User Profile
 * @author Tim Titik Terampil
 * Tanggung jawab: menyediakan endpoint data profil siswa dinamis untuk konsumsi Fetch API (Kriteria UTS Poin 2.2).
 */
import { NextResponse } from 'next/server';
import { users } from '@/src/data/mock';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || 'student-demo';

  const user = users.find((u) => u.id === id) || users[0];

  return NextResponse.json({
    status: 'success',
    data: user,
  });
}
