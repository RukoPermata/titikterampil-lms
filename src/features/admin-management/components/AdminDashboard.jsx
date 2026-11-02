'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '../api.js';
import styles from './admin.module.css';

const currency = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('id-ID');

/** @returns {React.ReactElement} Dashboard admin dari ringkasan state API terkini. */
export function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState(null);
  const controller = useRef(null);

  const fetchSummary = useCallback(() => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    return adminApi.summary(current.signal).then((data) => {
      if (!current.signal.aborted) { setSummary(data); setUpdated(new Date()); setError(''); }
    }).catch((failure) => {
      if (!current.signal.aborted) setError(failure.message);
    }).finally(() => {
      if (!current.signal.aborted) setLoading(false);
    });
  }, []);

  const reload = useCallback(() => {
    setLoading(true); setError('');
    return fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    void fetchSummary();
    window.addEventListener('focus', reload);
    return () => { controller.current?.abort(); window.removeEventListener('focus', reload); };
  }, [reload, fetchSummary]);

  const metrics = summary ? [
    ['Total peserta', number.format(summary.totalStudents), 'Pengguna dengan peran peserta'],
    ['Member aktif', number.format(summary.activeMembers), 'Peserta berstatus member'],
    ['Paket terbit', number.format(summary.publishedPackages), `Dari ${number.format(summary.totalPackages)} paket terdaftar`],
    ['Estimasi pendapatan', currency.format(summary.estimatedRevenue), 'Dari transaksi demo berstatus berhasil'],
  ] : [];

  return <section className={styles.page} aria-labelledby="admin-dashboard-title">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 id="admin-dashboard-title">Dashboard admin</h1>
        <p className={styles.intro}>Pantau pengguna, akses member, dan aktivitas tryout Titik Terampil.</p>
      </div>
      <button className={`${styles.button} ${styles.secondary}`} type="button" disabled={loading} onClick={reload}>
        {loading ? 'Memuat ringkasan…' : 'Muat ulang ringkasan'}
      </button>
    </header>
    <p className={`${styles.hint} mt-4`} role="status">{loading ? 'Mengambil ringkasan terbaru dari server…' :
      updated ? `Diperbarui ${new Intl.DateTimeFormat('id-ID', { timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(updated)} WIB.` : 'Ringkasan belum tersedia.'}</p>
    {error && <div role="alert" className={`${styles.feedback} ${styles.error}`}>
      <p>{error} {summary && 'Angka sebelumnya tetap ditampilkan.'}</p>
      <button className={`${styles.button} ${styles.secondary}`} type="button" onClick={reload} disabled={loading}>Coba muat ringkasan lagi</button>
    </div>}
    {summary && <div aria-busy={loading}>
      <dl className={styles.stats}>{metrics.map(([label, value, description]) =>
        <div className={styles.stat} key={label}><dt>{label}</dt><dd>{value}</dd><p className={styles.muted}>{description}</p></div>)}</dl>
      {summary.unclassifiedPackages > 0 && <p className={`${styles.feedback} ${styles.success}`}>
        {number.format(summary.unclassifiedPackages)} paket contoh belum memiliki status penerbitan dan belum dihitung sebagai paket terbit.
      </p>}
      <div className={styles.overview}>
        <section className={styles.panel} aria-labelledby="admin-activity-title">
          <h2 id="admin-activity-title">Ringkasan aktivitas</h2><p className={styles.muted}>Berdasarkan data yang tersimpan melalui mock API.</p>
          <dl className={styles.details}>{[
            ['Total pengguna', summary.totalUsers], ['Pengajar', summary.totalTeachers], ['Administrator', summary.totalAdmins],
            ['Transaksi menunggu pembayaran', summary.pendingTransactions], ['Esai menunggu penilaian', summary.pendingEssays],
          ].map(([label, value]) => <div className={styles.detailRow} key={label}><dt>{label}</dt><dd>{number.format(value)}</dd></div>)}</dl>
        </section>
        <nav className={styles.panel} aria-labelledby="admin-shortcuts-title">
          <h2 id="admin-shortcuts-title">Pengelolaan</h2>
          {[
            ['/admin/users', 'Manajemen pengguna', 'Tambah pengguna, ubah peran, dan kelola status member.'],
            ['/admin/tryouts', 'Manajemen tryout', 'Buka halaman pengaturan paket tryout.'],
            ['/admin/questions', 'Bank soal', 'Buka koleksi soal dan pembahasan.'],
          ].map(([href, title, description]) => <Link href={href} className={styles.quickLink} key={href}>
            <strong>{title}</strong><span className={styles.muted}>{description}</span>
          </Link>)}
        </nav>
      </div>
    </div>}
  </section>;
}
