'use client';

/**
 * Modul: Katalog tryout peserta (P05)
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menampilkan paket sesuai jenjang, filter katalog, dan status akses.
 */
import { useEffect, useMemo, useState } from 'react';
import { useDemo } from '@/src/components/DemoProvider';
import { tryouts as fallbackTryouts } from '@/src/data/mock';
import { filterTryouts } from '../actions';
import { getUnlockedTryoutIds } from '../attempt-store';
import { PackageCard } from './PackageCard';
import styles from '../cbt.module.css';

const LEVEL_ORDER = ['SD', 'SMP', 'SMA', 'Umum'];

/**
 * Menampilkan katalog paket tryout dengan filter jenjang, mapel, kelas, dan pencarian.
 * @returns {React.ReactElement} Halaman katalog CBT.
 */
export function TryoutCatalog() {
  const { user } = useDemo();
  const isMember = Boolean(user?.isMember);
  const studentLevel = user?.level || 'SMA';
  // Paket yang dibuka lewat voucher dibaca langsung dari storage agar selalu segar.
  const unlockedIds = user?.id ? getUnlockedTryoutIds(user.id) : [];

  // 1. Siapkan data awal dari fixture agar halaman langsung memiliki isi.
  const [packages, setPackages] = useState(fallbackTryouts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState(isMember ? '' : studentLevel);
  const [grade, setGrade] = useState('');

  // 2. Ambil data terbaru dari mock API dan pertahankan data contoh saat offline.
  useEffect(() => {
    let active = true;
    async function loadPackages() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/tryouts', { cache: 'no-store' });
        if (!response.ok) throw new Error('Gagal memuat katalog.');
        const payload = await response.json();
        if (!active) return;
        if (Array.isArray(payload.data)) setPackages(payload.data);
      } catch {
        if (active) setError('Koneksi API tidak tersedia. Menampilkan data contoh.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadPackages();
    return () => {
      active = false;
    };
  }, []);

  // 3. Turunkan pilihan filter dari data yang tersedia.
  const subjects = useMemo(
    () => [...new Set(packages.map((item) => item.subject).filter(Boolean))].sort(),
    [packages]
  );
  const levels = useMemo(
    () => [...new Set(packages.map((item) => item.level).filter(Boolean))]
      .sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b)),
    [packages]
  );
  const grades = useMemo(
    () => [...new Set(packages
      .filter((item) => !level || item.level === level)
      .map((item) => item.grade)
      .filter((value) => value !== undefined && value !== null))]
      .sort((a, b) => {
        const left = Number(a);
        const right = Number(b);
        if (Number.isFinite(left) && Number.isFinite(right)) return left - right;
        return String(a).localeCompare(String(b), 'id');
      }),
    [packages, level]
  );

  // 4. Terapkan filter tanpa mengubah data asal.
  const visiblePackages = useMemo(
    () => filterTryouts(packages, {
      level: isMember ? level : studentLevel,
      grade,
      subject,
      query,
    }),
    [packages, isMember, level, studentLevel, grade, subject, query]
  );

  /**
   * Mengembalikan seluruh filter ke kondisi awal sesuai jenjang siswa.
   * @returns {void}
   */
  function resetFilters() {
    setQuery('');
    setSubject('');
    setGrade('');
    setLevel(isMember ? '' : studentLevel);
  }

  const hasFilter = Boolean(query || subject || grade || (isMember && level));
  const unlockedSet = new Set(unlockedIds);

  /**
   * Menentukan label akses yang ditampilkan pada kartu paket.
   * @param {Object} item - Paket tryout.
   * @returns {string} Label akses, atau string kosong bila paket masih terkunci.
   */
  function accessLabelFor(item) {
    if (item.isFree) return 'Gratis';
    if (isMember) return 'Akses Member';
    if (unlockedSet.has(item.id)) return 'Voucher aktif';
    return '';
  }

  return (
    <section className="page-content">
      <header className={styles.pageHeader}>
        <div>
          <p className="eyebrow">TITIK TERAMPIL / P05 / KATALOG TRYOUT</p>
          <h1>Katalog tryout</h1>
          <p className="lead">
            Pilih paket latihan sesuai jenjang dan mata pelajaran, lalu buka detailnya
            untuk melihat aturan pengerjaan.
          </p>
        </div>
        <span className={styles.accessPill}>
          {isMember ? 'Member · lintas jenjang' : `Jenjang ${studentLevel}`}
        </span>
      </header>

      {error && <p className={styles.warningText} role="status">{error}</p>}

      <div className={styles.filterPanel}>
        <label className={styles.filterField}>
          <span>Cari paket</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Judul atau mata pelajaran"
          />
        </label>
        <label className={styles.filterField}>
          <span>Mata pelajaran</span>
          <select value={subject} onChange={(event) => setSubject(event.target.value)}>
            <option value="">Semua mapel</option>
            {subjects.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className={styles.filterField}>
          <span>Jenjang</span>
          <select
            value={isMember ? level : studentLevel}
            onChange={(event) => {
              setLevel(event.target.value);
              setGrade('');
            }}
            disabled={!isMember}
            aria-describedby={!isMember ? 'level-lock-note' : undefined}
          >
            {isMember && <option value="">Semua jenjang</option>}
            {levels.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className={styles.filterField}>
          <span>Kelas</span>
          <select value={grade} onChange={(event) => setGrade(event.target.value)}>
            <option value="">Semua kelas</option>
            {grades.map((item) => <option key={item} value={item}>Kelas {item}</option>)}
          </select>
        </label>
      </div>
      {!isMember && (
        <p id="level-lock-note" className={styles.helperText}>
          Filter jenjang dikunci ke {studentLevel}. Status Member membuka seluruh jenjang.
        </p>
      )}

      <div className={styles.resultRow}>
        <p className={styles.resultCount}>
          {visiblePackages.length} paket tersedia{loading ? ' · memuat data terbaru…' : ''}
        </p>
        {hasFilter && (
          <button type="button" className="secondary" onClick={resetFilters}>
            Reset filter
          </button>
        )}
      </div>

      {visiblePackages.length === 0 ? (
        <div className={`panel ${styles.emptyState}`}>
          <h2>Tidak ada paket yang cocok</h2>
          <p>Coba ubah kata pencarian atau filter mapel dan kelas.</p>
          <button type="button" className="button" onClick={resetFilters}>Tampilkan semua paket</button>
        </div>
      ) : (
        <div className={styles.catalogGrid}>
          {visiblePackages.map((item) => (
            <PackageCard
              key={item.id}
              href={`/student/tryouts/${item.id}`}
              item={item}
              accessLabel={accessLabelFor(item)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
