/**
 * Modul: Route Handler API Mock Questions
 * @author Tim Titik Terampil
 * Tanggung jawab: menyediakan data soal CBT 5 tipe soal untuk diambil via Fetch API (Kriteria UTS Poin 2.2).
 */
import { NextResponse } from 'next/server';
import { questions } from '@/src/data/mock';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tryoutId = searchParams.get('tryoutId');

  const filtered = tryoutId
    ? questions.filter((q) => q.tryoutId === tryoutId)
    : questions;

  return NextResponse.json({
    status: 'success',
    count: filtered.length,
    data: filtered,
  });
}
