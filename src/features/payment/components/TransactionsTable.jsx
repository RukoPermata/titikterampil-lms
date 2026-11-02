'use client';
/**
 * Modul: Tabel rekapitulasi transaksi seluruh peserta untuk dashboard admin
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: menampilkan riwayat pembayaran, badge status transaksi, dan detail invoice.
 */
import { formatRupiah } from '@/src/lib/utils';
import { formatTransactionDate } from '../actions.js';
import styles from '../payment.module.css';

/**
 * Komponen tabel daftar transaksi dengan status pembayaran dan tombol detail.
 * @param {Object} props - Properti komponen.
 * @param {Array<Object>} props.transactions - Daftar record transaksi.
 * @param {Function} props.onSelectTransaction - Callback ketika baris atau tombol detail diklik.
 * @param {boolean} props.isLoading - Status pemuatan data.
 * @returns {React.ReactElement} Tabel transaksi admin.
 */
export function TransactionsTable({
  transactions = [],
  onSelectTransaction,
  isLoading = false,
}) {
  /**
   * Mendapatkan class CSS badge berdasarkan status transaksi.
   * @param {string} status - Status transaksi.
   * @returns {string} Nama kelas CSS.
   */
  function getStatusBadgeClass(status) {
    switch (status) {
      case 'Berhasil':
        return styles.badgeSuccess;
      case 'Menunggu':
        return styles.badgeWarning;
      case 'Gagal':
        return styles.badgeDanger;
      case 'Kedaluwarsa':
      default:
        return styles.badgeMuted;
    }
  }

  if (isLoading) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyStateTitle}>Memuat daftar transaksi...</p>
        <p>Mengambil data transaksi terkini dari server demo.</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyStateTitle}>Tidak ada transaksi ditemukan</p>
        <p>Belum ada riwayat transaksi yang cocok dengan kriteria pencarian.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '15%' }}>ID & Tanggal</th>
              <th style={{ width: '22%' }}>Nama Peserta</th>
              <th style={{ width: '25%' }}>Paket Try Out</th>
              <th style={{ width: '13%' }}>Nominal</th>
              <th style={{ width: '13%' }}>Metode Bayar</th>
              <th style={{ width: '12%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx) => (
              <tr
                key={trx.id}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectTransaction(trx)}
              >
                <td>
                  <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '13px' }}>
                    {trx.id}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--tt-muted, #526862)', marginTop: '2px' }}>
                    {formatTransactionDate(trx.date)}
                  </div>
                </td>
                <td>
                  <strong style={{ color: 'var(--tt-ink, #16332F)' }}>
                    {trx.studentName || 'Peserta Anonim'}
                  </strong>
                  {trx.studentId && (
                    <div style={{ fontSize: '11px', color: 'var(--tt-muted, #526862)' }}>
                      ID: {trx.studentId}
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{trx.packageTitle}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {formatRupiah(trx.amount)}
                  </div>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.badgeMuted}`}>
                    {trx.paymentMethod || 'Manual Transfer'}
                  </span>
                </td>
                <td>
                  <span className={`${styles.badge} ${getStatusBadgeClass(trx.status)}`}>
                    {trx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
