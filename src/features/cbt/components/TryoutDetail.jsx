'use client';

/**
 * Modul: Detail paket tryout peserta (P06)
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menampilkan aturan paket, subtes, harga, dan penukaran voucher.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDemo } from '@/src/components/DemoProvider';
import { tryouts as fallbackTryouts, vouchers as fallbackVouchers } from '@/src/data/mock';
import { formatPrice, validateVoucher } from '../actions';
import { isTryoutUnlocked, unlockTryout } from '../attempt-store';
import styles from '../cbt.module.css';

/**
 * Menampilkan informasi satu paket dan gerbang akses sebelum ujian.
 * @param {Object} props - Properti komponen.
 * @param {string} props.tryoutId - ID paket dari route dinamis.
 * @returns {React.ReactElement} Halaman detail paket.
 */
export function TryoutDetail({ tryoutId }) {
  const { user } = useDemo();
  const initialTryout = fallbackTryouts.find((item) => item.id === tryoutId) ?? null;
  const [tryout, setTryout] = useState(initialTryout);
  const [loading, setLoading] = useState(!initialTryout);
  const [error, setError] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherState, setVoucherState] = useState({ tone: '', message: '' });
  const [redeeming, setRedeeming] = useState(false);
  const [purchaseNotice, setPurchaseNotice] = useState('');
  const [unlocked, setUnlocked] = useState(() => Boolean(
    user?.id && isTryoutUnlocked(user.id, tryoutId)
  ));

  // 1. Ambil detail terbaru dari API, lalu gunakan fixture bila offline.
  useEffect(() => {
    let active = true;
    async function loadTryout() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/tryouts/${encodeURIComponent(tryoutId)}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Detail tidak ditemukan.');
        const payload = await response.json();
        if (active && payload.data) setTryout(payload.data);
      } catch {
        if (active) setError('Detail terbaru tidak dapat dimuat. Menampilkan data contoh.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadTryout();
    return () => {
      active = false;
    };
  }, [tryoutId]);

  if (!tryout && !loading) {
    return (
      <section className={`page-content ${styles.screenStack}`}>
        <h1>Paket tryout tidak ditemukan</h1>
        <p>ID paket <strong>{tryoutId}</strong> belum tersedia dalam data demo.</p>
        <Link className="button" href="/student/tryouts">Kembali ke katalog</Link>
      </section>
    );
  }

  if (!tryout) {
    return (
      <section className={`page-content ${styles.screenStack}`}>
        <p className="eyebrow">TITIK TERAMPIL / P06 / DETAIL PAKET</p>
        <h1>Memuat detail paket…</h1>
      </section>
    );
  }

  const isMember = Boolean(user?.isMember);
  const hasAccess = Boolean(tryout.isFree) || isMember || unlocked;

  /**
   * Memvalidasi dan menukar kode voucher untuk membuka paket.
   * @param {React.FormEvent<HTMLFormElement>} event - Event submit form.
   * @returns {Promise<void>}
   */
  async function handleRedeem(event) {
    event.preventDefault();
    const code = voucherCode.trim().toUpperCase();
    if (!code) {
      setVoucherState({ tone: 'error', message: 'Masukkan kode voucher terlebih dahulu.' });
      return;
    }

    setRedeeming(true);
    setVoucherState({ tone: '', message: '' });
    try {
      let voucher = null;
      try {
        const response = await fetch(
          `/api/vouchers?code=${encodeURIComponent(code)}&tryoutId=${encodeURIComponent(tryout.id)}`,
          { cache: 'no-store' }
        );
        if (!response.ok) throw new Error('Voucher tidak ditemukan.');
        const payload = await response.json();
        voucher = Array.isArray(payload.data) ? payload.data[0] : null;
      } catch {
        voucher = fallbackVouchers.find((item) => item.code === code) ?? null;
      }

      const result = validateVoucher(voucher, tryout.id);
      if (result.status !== 'success') {
        setVoucherState({ tone: 'error', message: result.message });
        return;
      }

      const saved = user?.id ? unlockTryout(user.id, tryout.id) : false;
      if (!saved) {
        setVoucherState({
          tone: 'error',
          message: 'Akses voucher valid, tetapi penyimpanan browser tidak tersedia.',
        });
        return;
      }
      setUnlocked(true);
      setVoucherState({ tone: 'success', message: result.message });
      setVoucherCode(code);
    } finally {
      setRedeeming(false);
    }
  }

  return (
    <section className={`page-content ${styles.screenStack}`}>
      <p className="eyebrow">TITIK TERAMPIL / P06 / DETAIL PAKET</p>
      <Link href="/student/tryouts">← Kembali ke katalog</Link>
      <header className={styles.detailHeader}>
        <div>
          <h1>{tryout.title}</h1>
          <p className="lead">
            {tryout.subject} untuk {tryout.level} kelas {tryout.grade}.
          </p>
        </div>
        <span className={`${styles.statusBadge} ${hasAccess ? styles.statusFree : styles.statusPaid}`}>
          {hasAccess
            ? (tryout.isFree ? 'Gratis' : isMember ? 'Akses Member' : 'Voucher aktif')
            : formatPrice(tryout.price)}
        </span>
      </header>

      {error && <p className={styles.warningText} role="status">{error}</p>}
      {loading && <p className={styles.helperText}>Memuat detail terbaru…</p>}

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}><small>Jenjang</small><strong>{tryout.level}</strong></div>
        <div className={styles.metaItem}><small>Tingkat kelas</small><strong>Kelas {tryout.grade}</strong></div>
        <div className={styles.metaItem}><small>Mata pelajaran</small><strong>{tryout.subject}</strong></div>
        <div className={styles.metaItem}><small>Durasi</small><strong>{tryout.durationMinutes} menit</strong></div>
        <div className={styles.metaItem}><small>Jumlah soal</small><strong>{tryout.questionCount ?? 0} soal</strong></div>
        <div className={styles.metaItem}><small>Biaya</small><strong>{formatPrice(tryout.price)}</strong></div>
      </div>

      {Array.isArray(tryout.subtests) && tryout.subtests.length > 0 && (
        <article className="panel">
          <h2>Susunan subtes</h2>
          <div className={styles.subtestList}>
            {tryout.subtests.map((subtest) => (
              <div className={styles.subtestItem} key={subtest.id}>
                <div>
                  <strong>{subtest.title}</strong>
                  <p className={styles.cardMeta}>{subtest.questionCount} soal</p>
                </div>
                <span>{subtest.durationMinutes} menit</span>
              </div>
            ))}
          </div>
        </article>
      )}

      <article className="panel">
        <h2>Aturan pengerjaan</h2>
        <ul>
          <li>Timer berjalan sejak tombol mulai ditekan dan tidak berhenti saat halaman dimuat ulang.</li>
          <li>Jawaban tersimpan otomatis di browser; gunakan tombol simpan manual bila ingin memastikan.</li>
          <li>Soal dapat ditandai untuk ditinjau kembali sebelum dikumpulkan.</li>
          <li>Nilai objektif tampil setelah dikumpulkan; esai menunggu penilaian pengajar.</li>
        </ul>

        {hasAccess ? (
          <div className={styles.actionRow}>
            <Link className="button" href={`/student/exams/${tryout.id}/instructions`}>
              {unlocked ? 'Buka petunjuk ujian →' : 'Mulai tryout →'}
            </Link>
            {isMember && <span className={styles.helperText}>Akses dibuka oleh status Member.</span>}
          </div>
        ) : (
          <div className={styles.accessPanel}>
            <div>
              <h3>Paket berbayar</h3>
              <p className={styles.cardMeta}>
                Harga paket {formatPrice(tryout.price)}. Tukar voucher di bawah atau lanjutkan pembayaran.
              </p>
            </div>
            <div className={styles.actionRow}>
              <button
                type="button"
                onClick={() => setPurchaseNotice(
                  'Halaman checkout pembayaran (Layar 09) belum tersedia pada build frontend ini.'
                )}
              >
                Beli paket
              </button>
            </div>
            {purchaseNotice && <p className={styles.warningText} role="status">{purchaseNotice}</p>}
          </div>
        )}

        {!hasAccess && (
          <form className={styles.voucherForm} onSubmit={handleRedeem}>
            <label className={styles.filterField}>
              <span>Punya kode voucher?</span>
              <input
                type="text"
                value={voucherCode}
                onChange={(event) => setVoucherCode(event.target.value.toUpperCase())}
                placeholder="Contoh: TRYOUTGRATIS"
                autoComplete="off"
              />
            </label>
            <button type="submit" className="button secondary" disabled={redeeming}>
              {redeeming ? 'Memeriksa…' : 'Tukar voucher'}
            </button>
            {voucherState.message && (
              <p
                className={voucherState.tone === 'success' ? styles.successText : styles.errorText}
                role={voucherState.tone === 'success' ? 'status' : 'alert'}
              >
                {voucherState.message}
              </p>
            )}
          </form>
        )}
      </article>
    </section>
  );
}
