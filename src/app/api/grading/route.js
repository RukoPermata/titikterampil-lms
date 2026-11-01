/**
 * Modul: Route Handler API Mock Essay Submissions
 * @author Tim Titik Terampil
 * Tanggung jawab: menyediakan data pengumpulan esai untuk modul penilaian pengajar via Fetch API (Kriteria UTS Poin 2.2).
 */
import { NextResponse } from 'next/server';
import { submissions } from '@/src/data/mock';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const item = submissions.find((s) => s.id === id) || null;
    return NextResponse.json({
      status: item ? 'success' : 'not_found',
      data: item,
    });
  }

  return NextResponse.json({
    status: 'success',
    count: submissions.length,
    data: submissions,
  });
}
