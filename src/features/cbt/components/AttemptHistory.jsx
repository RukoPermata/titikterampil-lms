'use client';

/**
 * Modul: Riwayat tryout peserta (P09)
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menampilkan attempt selesai dan aktif beserta tautan hasil.
 */
import { useState } from 'react';
import Link from 'next/link';
import { useDemo } from '@/src/components/DemoProvider';
import { getStudentHistory } from '../actions';
import { getStudentAttempts } from '../attempt-store';
import styles from '../cbt.module.css';

/**
 * Memformat tanggal attempt untuk tabel riwayat.
 * @param {string} value - Tanggal ISO.
 * @returns {string} Tanggal yang mudah dibaca.
 */
function formatDate(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '—';
  return date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

/**
 * Menampilkan riwayat percobaan CBT siswa aktif.
 * @returns {React.ReactElement} Halaman riwayat tryout.
 */
export function AttemptHistory() {
  const { user } = useDemo();
  const [tryoutFilter, setTryoutFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const history = getStudentHistory(
    user?.id ? getStudentAttempts(user.id) : [],
    user?.id ?? ''
  );
  const attempts = history.status === 'success' ? history.attempts : [];

  const packageMap = new Map();
  attempts.forEach((attempt) => {
    if (!packageMap.has(attempt.tryoutId)) {
      packageMap.set(attempt.tryoutId, attempt.tryoutTitle ?? attempt.tryoutId);
    }
  });
  const packages = [...packageMap.entries()].map(([id, title]) => ({ id, title }));

  const visibleAttempts = attempts.filter((attempt) => {
    if (tryoutFilter !== 'all' && attempt.tryoutId !== tryoutFilter) return false;
    if (statusFilter === 'active' && attempt.submittedAt) return false;
    if (statusFilter === 'submitted' && !attempt.submittedAt) return false;
    return true;
  });

  return (
    <section className={`page-content ${styles.screenStack}`}>
      <p className="eyebrow">TITIK TERAMPIL / P09 / RIWAYAT TRYOUT</p>
      <h1>Riwayat tryout</h1>
      <p className="lead">
        Pantau percobaan yang masih berjalan dan buka pembahasan hasil ujian yang sudah dikumpulkan.
      </p>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}><small>Total percobaan</small><strong>{attempts.length}</strong></div>
        <div className={styles.metaItem}><small>Selesai</small><strong>{attempts.filter((item) => item.submittedAt).length}</strong></div>
        <div className={styles.metaItem}><small>Masih berjalan</small><strong>{attempts.filter((item) => !item.submittedAt).length}</strong></div>
        <div className={styles.metaItem}>
          <small>Nilai terbaik</small>
          <strong>
            {attempts.some((item) => typeof item.score === 'number')
              ? Math.max(...attempts.filter((item) => typeof item.score === 'number').map((item) => item.score))
              : '—'}
          </strong>
        </div>
      </div>

      {attempts.length > 0 && (
        <div className={styles.historyControls}>
          <label className={styles.filterField}>
            <span>Filter paket</span>
            <select value={tryoutFilter} onChange={(event) => setTryoutFilter(event.target.value)}>
              <option value="all">Semua paket</option>
              {packages.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
          </label>
          <label className={styles.filterField}>
            <span>Status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">Semua status</option>
              <option value="submitted">Sudah dikumpulkan</option>
              <option value="active">Masih berjalan</option>
            </select>
          </label>
          <button type="button" className="secondary" onClick={() => {
            setTryoutFilter('all');
            setStatusFilter('all');
          }}>
            Reset filter
          </button>
        </div>
      )}

      {attempts.length === 0 ? (
        <div className={`panel ${styles.emptyState}`}>
          <h2>Belum ada riwayat tryout</h2>
          <p>Kerjakan paket pertama Anda untuk melihat nilai dan pembahasan di halaman ini.</p>
          <Link className="button" href="/student/tryouts">Buka katalog tryout</Link>
        </div>
      ) : visibleAttempts.length === 0 ? (
        <div className={`panel ${styles.emptyState}`}>
          <h2>Tidak ada hasil pada filter ini</h2>
          <p>Ubah filter paket atau status untuk melihat riwayat lainnya.</p>
        </div>
      ) : (
        <div className={styles.tableScroll}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Paket</th>
                <th>Tanggal</th>
                <th>Nilai</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {visibleAttempts.map((attempt) => {
                const submitted = Boolean(attempt.submittedAt);
                return (
                  <tr key={attempt.id}>
                    <td>
                      <strong>{attempt.tryoutTitle ?? attempt.tryoutId}</strong>
                      <div className={styles.cardMeta}>
                        {attempt.tryoutLevel} · Kelas {attempt.tryoutGrade} · {attempt.durationMinutes} menit
                      </div>
                    </td>
                    <td>{formatDate(attempt.submittedAt ?? attempt.startedAt)}</td>
                    <td>
                      <strong>{typeof attempt.score === 'number' ? attempt.score : '—'}</strong>
                      {attempt.gradingStatus === 'pending' && (
                        <div className={styles.cardMeta}>Esai pending</div>
                      )}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${submitted ? styles.statusFree : styles.statusPaid}`}>
                        {submitted ? 'Dikumpulkan' : 'Berjalan'}
                      </span>
                    </td>
                    <td>
                      <Link
                        className={styles.tableAction}
                        href={submitted
                          ? `/student/results/${attempt.id}`
                          : `/student/exams/${attempt.tryoutId}`}
                      >
                        {submitted ? 'Lihat hasil' : 'Lanjutkan'}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
