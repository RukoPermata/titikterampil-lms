'use client';
/**
 * Modul: Tabel daftar voucher tryout untuk dashboard admin
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: menampilkan data voucher, statistik pemakaian kuota, dan aksi status.
 */
import styles from '../payment.module.css';

/**
 * Komponen tabel daftar voucher dengan status kuota dan aksi cepat.
 * @param {Object} props - Properti komponen.
 * @param {Array<Object>} props.vouchers - Daftar record voucher.
 * @param {Array<Object>} props.tryouts - Daftar seluruh paket tryout untuk pencocokan nama.
 * @param {Function} props.onToggleStatus - Callback toggle aktif/nonaktif.
 * @param {Function} props.onDelete - Callback penghapusan voucher.
 * @param {Function} props.onEdit - Callback untuk membuka edit voucher.
 * @param {boolean} props.isLoading - Status pemuatan data.
 * @returns {React.ReactElement} Tabel voucher.
 */
export function VouchersTable({
  vouchers = [],
  tryouts = [],
  onToggleStatus,
  onDelete,
  onEdit,
  isLoading = false,
}) {
  const today = new Date().toISOString().slice(0, 10);

  /**
   * Mendapatkan label representasi paket yang dicakup voucher.
   * @param {Array<string>} applicablePackages - Array ID paket atau ['all'].
   * @returns {string} Label teks ringkas.
   */
  function getPackagesLabel(applicablePackages = []) {
    if (!applicablePackages || applicablePackages.includes('all')) {
      return 'Semua Paket (All)';
    }
    if (applicablePackages.length === 1) {
      const match = tryouts.find((t) => t.id === applicablePackages[0]);
      return match ? match.title : applicablePackages[0];
    }
    return `${applicablePackages.length} Paket Spesifik`;
  }

  if (isLoading) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyStateTitle}>Memuat data voucher...</p>
        <p>Mengambil data dari server demo.</p>
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyStateTitle}>Belum ada voucher yang sesuai</p>
        <p>Gunakan tombol "Tambah Voucher Baru" atau sesuaikan filter pencarian Anda.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Kode & Judul Promo</th>
              <th style={{ width: '22%' }}>Paket Dicakup</th>
              <th style={{ width: '18%' }}>Statistik Kuota</th>
              <th style={{ width: '15%' }}>Masa Berlaku</th>
              <th style={{ width: '10%' }}>Status</th>
              <th style={{ width: '13%', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((item) => {
              const used = item.usedCount || 0;
              const quota = item.quota || 1;
              const percent = Math.min(100, Math.round((used / quota) * 100));
              const isExpired = item.validUntil < today;
              const isFull = used >= quota;

              let badgeClass = styles.badgeSuccess;
              if (item.status === 'Habis' || isFull) badgeClass = styles.badgeDanger;
              else if (item.status === 'Nonaktif') badgeClass = styles.badgeMuted;

              return (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '15px' }}>
                      {item.code}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--tt-muted, #526862)', marginTop: '2px' }}>
                      {item.title}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeBrand}`}>
                      {getPackagesLabel(item.applicablePackages)}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>
                      {used} / {quota}{' '}
                      <span style={{ fontSize: '12px', color: 'var(--tt-muted, #526862)' }}>
                        ({percent}%)
                      </span>
                    </div>
                    <div className={styles.progressBarBg}>
                      <div
                        className={`${styles.progressBarFill} ${
                          isFull ? styles.progressBarFillDanger : ''
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: isExpired ? 600 : 400, color: isExpired ? 'var(--tt-danger, #B42318)' : 'inherit' }}>
                      {item.validUntil}
                    </div>
                    {isExpired && (
                      <span style={{ fontSize: '11px', color: 'var(--tt-danger, #B42318)' }}>
                        (Kedaluwarsa)
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`${styles.badge} ${badgeClass}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                        title="Ubah status aktif atau nonaktif"
                        onClick={() => onToggleStatus(item)}
                      >
                        {item.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                        title="Hapus voucher"
                        onClick={() => onDelete(item.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
