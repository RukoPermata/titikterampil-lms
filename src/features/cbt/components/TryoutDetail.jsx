'use client';
import Link from 'next/link';
import { useState } from 'react';
import { tryouts } from '@/src/data/mock';
import styles from '../cbt.module.css';

export function TryoutDetail({ tryoutId }) {
  const [setuju, setSetuju] = useState(false);
  const tryout = tryouts.find((item) => item.id === tryoutId) ?? null;

  if (!tryout) {
    return (
      <section className="page-content">
        <h1>Paket tryout tidak ditemukan</h1>
        <p>ID paket <strong>{tryoutId}</strong> belum tersedia dalam data demo.</p>
        <Link className="button" href="/student/tryouts">Kembali ke katalog</Link>
      </section>
    );
  }

  return (
    <section className="page-content">
      <p className="eyebrow">TITIK TERAMPIL / P06</p>
      <Link href="/student/tryouts">← Kembali ke katalog</Link>
      <h1>{tryout.title}</h1>
      <p className="lead">{tryout.subject} untuk {tryout.level} kelas {tryout.grade}.</p>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}><small>Jenjang</small><strong>{tryout.level}</strong></div>
        <div className={styles.metaItem}><small>Tingkat kelas</small><strong>Kelas {tryout.grade}</strong></div>
        <div className={styles.metaItem}><small>Mata pelajaran</small><strong>{tryout.subject}</strong></div>
        <div className={styles.metaItem}><small>Durasi</small><strong>{tryout.durationMinutes} menit</strong></div>
        <div className={styles.metaItem}><small>Biaya Akses</small><strong>{tryout.isFree ? 'Gratis' : `Rp ${Number(tryout.price).toLocaleString('id-ID')}`}</strong></div>
      </div>

      <article className="panel">
        <h2>Aturan pengerjaan</h2>
        <ul>
          <li>Baca setiap soal dengan teliti sebelum memilih jawaban.</li>
          <li>Jawaban masih dapat diubah selama ujian belum dikumpulkan.</li>
          <li>Nilai ditampilkan setelah semua jawaban dikumpulkan.</li>
        </ul>

        <label className={styles.confirm}>
          <input
            type="checkbox"
            checked={setuju}
            onChange={(event) => setSetuju(event.target.checked)}
          />
          <span>Saya sudah membaca aturan dan siap mengerjakan tryout ini.</span>
        </label>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
          {setuju ? (
            <Link className="button" href={'/student/exams/' + tryout.id}>Mulai tryout →</Link>
          ) : (
            <button type="button" disabled>Mulai tryout →</button>
          )}
          <Link
            className="button secondary"
            href={'/student/checkout/' + tryout.id}
          >
            {tryout.isFree ? 'Klaim Voucher Akses →' : 'Beli Paket (Checkout) →'}
          </Link>
        </div>
      </article>
    </section>
  );
}
