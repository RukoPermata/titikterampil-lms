'use client';
/**
 * Modul: Manajemen Transaksi Admin (Layar 27)
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: pemantauan transaksi pembelian tryout, verifikasi status, dan metrik pendapatan.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/src/components/DemoProvider';
import { formatRupiah } from '@/src/lib/utils';
import { paymentApi, transactionsQuery } from '../api.js';
import { formatTransactionDate } from '../actions.js';
import { TransactionsTable } from './TransactionsTable';
import styles from '../payment.module.css';

/**
 * Komponen utama pemantauan daftar transaksi seluruh peserta (Layar 27).
 * @returns {React.ReactElement} Tampilan rekapitulasi transaksi.
 */
export function TransactionsManagement() {
  const showToast = useToast();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({ q: '', status: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const abortControllerRef = useRef(null);

  // Debounce input pencarian
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(filters.q);
    }, 250);
    return () => clearTimeout(timer);
  }, [filters.q]);

  /**
   * Mengambil data transaksi dari server mock API sesuai filter aktif.
   */
  const loadTransactions = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError('');

    try {
      const queryStr = transactionsQuery({
        q: searchQuery,
        status: filters.status || undefined,
      });

      const data = await paymentApi.transactions(queryStr, controller.signal);
      if (!controller.signal.aborted) {
        setTransactions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Gagal memuat riwayat transaksi.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [searchQuery, filters.status]);

  useEffect(() => {
    loadTransactions();
    return () => abortControllerRef.current?.abort();
  }, [loadTransactions]);

  /**
   * Menangani pengubahan status transaksi simulasi oleh admin.
   * @param {string} newStatus - Status baru ('Berhasil' | 'Menunggu' | 'Gagal' | 'Kedaluwarsa').
   */
  async function handleUpdateStatus(newStatus) {
    if (!selectedTransaction) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await paymentApi.saveTransaction(
        { status: newStatus },
        selectedTransaction.id
      );
      showToast(
        `Status transaksi ${selectedTransaction.id} berhasil diubah menjadi "${newStatus}".`,
        'success'
      );
      setSelectedTransaction(updated);
      loadTransactions();
    } catch (err) {
      showToast(err.message || 'Gagal memperbarui status transaksi.', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  // Perhitungan ringkasan statistik
  const totalTransactions = transactions.length;
  const successfulTransactions = transactions.filter((t) => t.status === 'Berhasil');
  const pendingCount = transactions.filter((t) => t.status === 'Menunggu').length;
  const totalRevenue = successfulTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <section className={styles.container} aria-labelledby="transactions-page-title">
      <div className={styles.header}>
        <div>
          <p className="eyebrow">TITIK TERAMPIL / ADMIN / P27</p>
          <h1 id="transactions-page-title" className={styles.title}>
            Daftar Transaksi
          </h1>
          <p className={styles.subtitle}>
            Pantau seluruh riwayat transaksi pembayaran paket tryout, status verifikasi bank, dan omset platform.
          </p>
        </div>
      </div>

      {/* Ringkasan Metrik Finansial */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Transaksi</div>
          <div className={styles.metricValue}>{totalTransactions}</div>
          <div className={styles.metricDesc}>Riwayat tercatat dalam sistem</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Pembayaran Berhasil</div>
          <div className={styles.metricValue}>{successfulTransactions.length}</div>
          <div className={styles.metricDesc}>Akses paket aktif</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Menunggu Bayar</div>
          <div className={styles.metricValue}>{pendingCount}</div>
          <div className={styles.metricDesc}>Menunggu konfirmasi gateway</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Estimasi Omset</div>
          <div className={styles.metricValue}>{formatRupiah(totalRevenue)}</div>
          <div className={styles.metricDesc}>Dari transaksi berhasil</div>
        </div>
      </div>

      {/* Toolbar Filter dan Pencarian */}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Cari peserta, paket, atau metode bayar..."
            value={filters.q}
            onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
          />
          <select
            className={styles.selectInput}
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            aria-label="Filter status transaksi"
          >
            <option value="">Semua Status Transaksi</option>
            <option value="Berhasil">Berhasil</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Gagal">Gagal</option>
            <option value="Kedaluwarsa">Kedaluwarsa</option>
          </select>
          {(filters.q || filters.status) && (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
              onClick={() => setFilters({ q: '', status: '' })}
            >
              Reset Filter
            </button>
          )}
        </div>
        <div>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
            onClick={loadTransactions}
            disabled={loading}
          >
            {loading ? 'Memuat...' : 'Muat Ulang'}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            background: '#FEF3F2',
            border: '1px solid #F8B4B4',
            color: 'var(--tt-danger, #B42318)',
            padding: '14px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{error}</span>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
            onClick={loadTransactions}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Tabel Data Transaksi */}
      <TransactionsTable
        transactions={transactions}
        onSelectTransaction={(trx) => setSelectedTransaction(trx)}
        isLoading={loading}
      />

      {/* Modal Detail & Tindakan Admin */}
      {selectedTransaction && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="trx-detail-title"
        >
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 id="trx-detail-title">Rincian Transaksi</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setSelectedTransaction(null)}
                aria-label="Tutup detail transaksi"
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div className={styles.priceRow}>
                <span>ID Transaksi</span>
                <strong style={{ fontFamily: 'monospace' }}>
                  {selectedTransaction.id}
                </strong>
              </div>
              <div className={styles.priceRow}>
                <span>Nama Peserta</span>
                <strong>{selectedTransaction.studentName}</strong>
              </div>
              <div className={styles.priceRow}>
                <span>Paket Try Out</span>
                <strong>{selectedTransaction.packageTitle}</strong>
              </div>
              <div className={styles.priceRow}>
                <span>Nominal Pembayaran</span>
                <strong style={{ color: 'var(--tt-primary, #087F76)' }}>
                  {formatRupiah(selectedTransaction.amount)}
                </strong>
              </div>
              <div className={styles.priceRow}>
                <span>Metode Pembayaran</span>
                <span>{selectedTransaction.paymentMethod}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Waktu Transaksi</span>
                <span>{formatTransactionDate(selectedTransaction.date)}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Status Saat Ini</span>
                <span className={`${styles.badge} ${
                  selectedTransaction.status === 'Berhasil' ? styles.badgeSuccess :
                  selectedTransaction.status === 'Menunggu' ? styles.badgeWarning :
                  selectedTransaction.status === 'Gagal' ? styles.badgeDanger : styles.badgeMuted
                }`}>
                  {selectedTransaction.status}
                </span>
              </div>
            </div>

            {/* Simulasi Admin untuk Demo Testing */}
            <div className={styles.simulationBox}>
              <div className={styles.simulationHeader}>
                Simulasi Status Demo (Aksi Admin)
              </div>
              <div className={styles.simulationDesc}>
                Ubah status transaksi secara manual untuk keperluan demonstrasi pengujian alur verifikasi pembayaran.
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
                  disabled={isUpdatingStatus || selectedTransaction.status === 'Berhasil'}
                  onClick={() => handleUpdateStatus('Berhasil')}
                >
                  Tandai Berhasil
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                  disabled={isUpdatingStatus || selectedTransaction.status === 'Menunggu'}
                  onClick={() => handleUpdateStatus('Menunggu')}
                >
                  Tandai Menunggu
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                  disabled={isUpdatingStatus || selectedTransaction.status === 'Gagal'}
                  onClick={() => handleUpdateStatus('Gagal')}
                >
                  Tandai Gagal
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                  disabled={isUpdatingStatus || selectedTransaction.status === 'Kedaluwarsa'}
                  onClick={() => handleUpdateStatus('Kedaluwarsa')}
                >
                  Tandai Kedaluwarsa
                </button>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setSelectedTransaction(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
