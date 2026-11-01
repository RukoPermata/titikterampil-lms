
'use client';

import { useMemo, useState } from 'react';
import { tryouts } from '@/src/data/mock';
import { buildReport } from '@/src/features/tryout-management/actions';

const demoResults = [
  {
    id: 'result-1',
    student: 'Siswa 01',
    tryoutId: 'demo',
    score: 85,
    date: '2026-10-20',
  },
  {
    id: 'result-2',
    student: 'Siswa 02',
    tryoutId: 'demo',
    score: 72,
    date: '2026-10-21',
  },
  {
    id: 'result-3',
    student: 'Siswa 03',
    tryoutId: 'smp-demo',
    score: 65,
    date: '2026-10-22',
  },
  {
    id: 'result-4',
    student: 'Siswa 04',
    tryoutId: 'smp-demo',
    score: 90,
    date: '2026-10-23',
  },
  {
    id: 'result-5',
    student: 'Siswa 05',
    tryoutId: 'sd-demo',
    score: 78,
    date: '2026-10-24',
  },
];

export default function ReportsPage() {
  const [results] = useState(demoResults);
  const [search, setSearch] = useState('');
  const [tryoutFilter, setTryoutFilter] = useState('all');


  // Buat laporan berdasarkan paket yang dipilih.
  const report = useMemo(
    () =>
      buildReport(results, {
        tryoutId: tryoutFilter === 'all' ? undefined : tryoutFilter,
      }),
    [results, tryoutFilter]
  );

  // Terapkan pencarian siswa atau nama paket.
  const filteredResults = useMemo(() => {
    if (report.status !== 'success') return [];

    const keyword = search.toLowerCase();

    return report.rows.filter((result) => {
      const test = tryouts.find(
        (item) => item.id === result.tryoutId
      );

      return (
        result.student.toLowerCase().includes(keyword) ||
        (test?.title ?? '').toLowerCase().includes(keyword)
      );
    });
  }, [report, search]);

  // Hitung ulang ringkasan sesuai hasil yang tampil.
  const filteredReport = useMemo(
    () => buildReport(filteredResults),
    [filteredResults]
  );

  const totalResults = filteredReport.summary?.attemptCount ?? 0;
  const averageScore = Math.round(
    filteredReport.summary?.averageScore ?? 0
  );

  const passedResults = filteredResults.filter(
    (result) => result.score >= 70
  ).length;

  const passRate = totalResults
    ? Math.round((passedResults / totalResults) * 100)
    : 0;

  function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <main className="page-content reports-page">
      <header className="reports-header">
        <div>
          <h1>Laporan dan Rekap</h1>
          <p className="lead">
            Pantau ringkasan hasil pengerjaan paket tryout.
          </p>
        </div>
      </header>

      <section className="reports-summary">
        <article className="report-card">
          <span>Total Pengerjaan</span>
          <strong>{totalResults}</strong>
          <small>Data sesuai filter aktif</small>
        </article>

        <article className="report-card">
          <span>Rata-rata Nilai</span>
          <strong>{averageScore}</strong>
          <small>Dari seluruh hasil yang tampil</small>
        </article>

        <article className="report-card">
          <span>Lulus (Nilai ≥ 70)</span>
          <strong>{passedResults}</strong>
          <small>{passRate}% dari pengerjaan yang tampil</small>
        </article>
      </section>

      <section className="reports-toolbar">
        <input
          className="reports-search"
          type="search"
          placeholder="Cari siswa atau paket tryout..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Cari laporan"
        />

        <select
          className="reports-filter"
          value={tryoutFilter}
          onChange={(event) => setTryoutFilter(event.target.value)}
          aria-label="Filter paket tryout"
        >
          <option value="all">Semua paket</option>
          {tryouts.map((test) => (
            <option key={test.id} value={test.id}>
              {test.title}
            </option>
          ))}
        </select>
      </section>

      <p className="reports-count">
        Menampilkan {filteredResults.length} dari {results.length} hasil demo
      </p>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Siswa</th>
              <th>Paket Tryout</th>
              <th>Tanggal</th>
              <th>Nilai</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredResults.map((result, index) => {
              const test = tryouts.find(
                (item) => item.id === result.tryoutId
              );
              const passed = result.score >= 70;

              return (
                <tr key={result.id}>
                  <td>{index + 1}</td>
                  <td>{result.student}</td>
                  <td>{test?.title ?? 'Paket tidak ditemukan'}</td>
                  <td>{formatDate(result.date)}</td>
                  <td>
                    <strong>{result.score}</strong>
                  </td>
                  <td>
                    <span
                      className={`report-status ${passed ? 'report-status-passed' : 'report-status-failed'
                        }`}
                    >
                      {passed ? 'Lulus' : 'Belum lulus'}
                    </span>
                  </td>
                </tr>
              );
            })}

            {filteredResults.length === 0 && (
              <tr>
                <td className="reports-empty" colSpan={6}>
                  Tidak ada hasil yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="reports-note">
        Catatan: data dan ambang kelulusan pada halaman ini merupakan contoh
        untuk demonstrasi antarmuka. Sesuaikan dengan aturan penilaian dan
        sumber hasil pengerjaan yang sebenarnya.
      </p>
    </main>
  );
}
