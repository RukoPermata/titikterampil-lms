'use client';

/**
 * Modul: Leaderboard penuh peserta (P14b)
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menampilkan papan peringkat per jenjang dan skor terbaik siswa aktif.
 */
import { useEffect, useState } from 'react';
import { useDemo } from '@/src/components/DemoProvider';
import { getStudentAttempts } from '../attempt-store';
import styles from '../cbt.module.css';

const LEVELS = ['SD', 'SMP', 'SMA', 'Umum'];

/**
 * Menampilkan papan peringkat lengkap per jenjang.
 * @returns {React.ReactElement} Halaman leaderboard.
 */
export function LeaderboardBoard() {
  const { user } = useDemo();
  const [level, setLevel] = useState(user?.level && LEVELS.includes(user.level) ? user.level : 'SMA');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  // 1. Ambil leaderboard jenjang terpilih dari mock API.
  useEffect(() => {
    let active = true;
    async function loadLeaderboard() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/leaderboard?level=${encodeURIComponent(level)}`, {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Leaderboard tidak dapat dimuat.');
        const payload = await response.json();
        if (active && Array.isArray(payload.data)) setEntries(payload.data);
      } catch {
        if (active) {
          setEntries([]);
          setError('Leaderboard tidak dapat dimuat. Periksa koneksi lalu coba lagi.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadLeaderboard();
    return () => {
      active = false;
    };
  }, [level, reloadKey]);

  // 2. Hitung skor terbaik siswa aktif dari attempt lokal pada jenjang ini.
  const personalScores = user?.id
    ? getStudentAttempts(user.id)
      .filter((attempt) => attempt.submittedAt &&
        attempt.tryoutLevel === level &&
        typeof attempt.score === 'number')
      .map((attempt) => attempt.score)
    : [];
  const personalBest = personalScores.length ? Math.max(...personalScores) : null;

  const needle = query.trim().toLowerCase();
  const visibleEntries = needle
    ? entries.filter((entry) => `${entry.name} ${entry.school}`.toLowerCase().includes(needle))
    : entries;

  const podium = entries.slice(0, 3);
  const studentName = user?.name ?? '';

  return (
    <section className="page-content">
      <p className="eyebrow">TITIK TERAMPIL / P14 / LEADERBOARD</p>
      <h1>Papan peringkat</h1>
      <p className="lead">
        Nilai terbaik final peserta per jenjang. Gunakan tab jenjang untuk melihat peringkat lainnya.
      </p>

      <div className={styles.levelTabs} role="group" aria-label="Pilih jenjang leaderboard">
        {LEVELS.map((item) => (
          <button
            key={item}
            type="button"
            className={`${styles.levelTab} ${level === item ? styles.levelTabActive : ''}`}
            onClick={() => setLevel(item)}
            aria-pressed={level === item}
          >
            {item}
          </button>
        ))}
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}><small>Jenjang</small><strong>{level}</strong></div>
        <div className={styles.metaItem}><small>Peserta terdaftar</small><strong>{entries.length}</strong></div>
        <div className={styles.metaItem}><small>Skor teratas</small><strong>{entries[0]?.score ?? '—'}</strong></div>
        <div className={styles.metaItem}><small>Skor terbaik Anda</small><strong>{personalBest ?? '—'}</strong></div>
      </div>

      {error && (
        <div className={styles.warningText} role="status">
          {error}{' '}
          <button type="button" className="secondary" onClick={() => setReloadKey((key) => key + 1)}>
            Coba lagi
          </button>
        </div>
      )}
      {loading && <p className={styles.helperText}>Memuat leaderboard {level}…</p>}

      {podium.length > 0 && (
        <div className={styles.podium}>
          {podium.map((entry, index) => (
            <article
              className={`${styles.podiumCard} ${index === 0 ? styles.podiumCardFirst : ''}`}
              key={`${entry.rank}-${entry.name}`}
            >
              <span className={styles.podiumRank}>Peringkat {entry.rank}</span>
              <strong>{entry.name}</strong>
              <span className={styles.podiumScore}>{entry.score}</span>
              <span className={styles.cardMeta}>{entry.school}</span>
            </article>
          ))}
        </div>
      )}

      <div className={styles.leaderboardControls}>
        <label className={styles.filterField}>
          <span>Cari peserta</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nama atau asal sekolah"
          />
        </label>
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Rank</th>
              <th>Nama peserta</th>
              <th>Asal sekolah / kategori</th>
              <th style={{ textAlign: 'right' }}>Skor terbaik</th>
            </tr>
          </thead>
          <tbody>
            {loading && visibleEntries.length === 0 ? (
              <tr><td colSpan="4" className={styles.emptyCell}>Memuat data peringkat…</td></tr>
            ) : visibleEntries.length === 0 ? (
              <tr><td colSpan="4" className={styles.emptyCell}>Tidak ada peserta pada filter ini.</td></tr>
            ) : (
              visibleEntries.map((entry) => (
                <tr key={`${entry.rank}-${entry.name}`} className={entry.name === studentName ? styles.currentRow : ''}>
                  <td><strong>{entry.rank}</strong></td>
                  <td>
                    <strong>{entry.name}</strong>
                    {entry.name === studentName && <span className={styles.helperText}> · Anda</span>}
                  </td>
                  <td>{entry.school}</td>
                  <td style={{ textAlign: 'right' }}><strong>{entry.score}</strong></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className={styles.helperText}>
        Skor terbaik Anda dihitung dari attempt yang sudah dikumpulkan pada browser ini.
      </p>
    </section>
  );
}
