'use client';
/**
 * Modul: Manajemen Voucher Admin (Layar 26)
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: rekapitulasi kode voucher, pemantauan kuota, dan pembuatan voucher promo.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/src/components/DemoProvider';
import { paymentApi, vouchersQuery } from '../api.js';
import { VoucherForm } from './VoucherForm';
import { VouchersTable } from './VouchersTable';
import styles from '../payment.module.css';

/**
 * Komponen utama manajemen kode voucher admin (Layar 26).
 * @returns {React.ReactElement} Tampilan manajemen voucher.
 */
export function VouchersManagement() {
  const showToast = useToast();

  const [vouchers, setVouchers] = useState([]);
  const [tryouts, setTryouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({ q: '', status: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const abortControllerRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(filters.q);
    }, 250);
    return () => clearTimeout(timer);
  }, [filters.q]);

  /**
   * Mengambil daftar voucher dan data paket tryout dari server mock API.
   */
  const loadData = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError('');

    try {
      const queryStr = vouchersQuery({
        q: searchQuery,
        status: filters.status || undefined,
      });

      const [vouchersData, tryoutsData] = await Promise.all([
        paymentApi.vouchers(queryStr, controller.signal),
        paymentApi.tryouts(controller.signal).catch(() => []),
      ]);

      if (!controller.signal.aborted) {
        setVouchers(Array.isArray(vouchersData) ? vouchersData : []);
        setTryouts(Array.isArray(tryoutsData) ? tryoutsData : []);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Gagal memuat daftar voucher.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [searchQuery, filters.status]);

  useEffect(() => {
    loadData();
    return () => abortControllerRef.current?.abort();
  }, [loadData]);

  /**
   * Menangani penyimpanan voucher baru atau update voucher.
   * @param {Object} payload - Data voucher yang sudah divalidasi.
   * @param {string|null} id - ID voucher jika sedang mengedit.
   */
  async function handleSaveVoucher(payload, id = null) {
    setIsSaving(true);
    try {
      await paymentApi.saveVoucher(payload, id);
      showToast(
        id
          ? `Voucher "${payload.code}" berhasil diperbarui.`
          : `Voucher "${payload.code}" berhasil ditambahkan.`,
        'success'
      );
      setIsModalOpen(false);
      setEditingVoucher(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan voucher.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  /**
   * Menangani toggle aktif / nonaktif voucher.
   * @param {Object} voucher - Record voucher yang statusnya akan diubah.
   */
  async function handleToggleStatus(voucher) {
    const nextStatus = voucher.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    try {
      await paymentApi.saveVoucher({ status: nextStatus }, voucher.id);
      showToast(`Status voucher "${voucher.code}" diubah menjadi ${nextStatus}.`, 'info');
      loadData();
    } catch (err) {
      showToast(err.message || 'Gagal mengubah status voucher.', 'error');
    }
  }

  /**
   * Menangani penghapusan voucher dengan konfirmasi.
   * @param {string} voucherId - ID voucher yang dihapus.
   */
  async function handleDeleteVoucher(voucherId) {
    const target = vouchers.find((v) => v.id === voucherId);
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus voucher "${target?.code || voucherId}"?`
    );
    if (!confirmDelete) return;

    try {
      await paymentApi.deleteVoucher(voucherId);
      showToast('Voucher berhasil dihapus.', 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Gagal menghapus voucher.', 'error');
    }
  }

  // Ringkasan metrik statistik
  const totalVouchers = vouchers.length;
  const activeVouchers = vouchers.filter((v) => v.status === 'Aktif').length;
  const totalUsedCount = vouchers.reduce((sum, v) => sum + (v.usedCount || 0), 0);
  const totalQuota = vouchers.reduce((sum, v) => sum + (v.quota || 0), 0);

  return (
    <section className={styles.container} aria-labelledby="vouchers-page-title">
      <div className={styles.header}>
        <div>
          <p className="eyebrow">TITIK TERAMPIL / ADMIN / P26</p>
          <h1 id="vouchers-page-title" className={styles.title}>
            Manajemen Voucher
          </h1>
          <p className={styles.subtitle}>
            Kelola kode promo try out gratis, alokasi kuota pemakaian, dan masa berlaku akses belajar peserta.
          </p>
        </div>
        <div>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => {
              setEditingVoucher(null);
              setIsModalOpen(true);
            }}
          >
            + Buat Voucher Baru
          </button>
        </div>
      </div>

      {/* Ringkasan Metrik Statistik */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Kode Voucher</div>
          <div className={styles.metricValue}>{totalVouchers}</div>
          <div className={styles.metricDesc}>Terdaftar di sistem demo</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Voucher Aktif</div>
          <div className={styles.metricValue}>{activeVouchers}</div>
          <div className={styles.metricDesc}>Dapat ditukarkan siswa</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Penukaran</div>
          <div className={styles.metricValue}>{totalUsedCount}</div>
          <div className={styles.metricDesc}>Dari total {totalQuota} kuota</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Tingkat Klaim</div>
          <div className={styles.metricValue}>
            {totalQuota > 0 ? Math.round((totalUsedCount / totalQuota) * 100) : 0}%
          </div>
          <div className={styles.metricDesc}>Rasio pemakaian kuota</div>
        </div>
      </div>

      {/* Toolbar Filter dan Pencarian */}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Cari kode atau judul voucher..."
            value={filters.q}
            onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
          />
          <select
            className={styles.selectInput}
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            aria-label="Filter status voucher"
          >
            <option value="">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Habis">Habis</option>
            <option value="Nonaktif">Nonaktif</option>
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
            onClick={loadData}
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
            onClick={loadData}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Tabel Data Voucher */}
      <VouchersTable
        vouchers={vouchers}
        tryouts={tryouts}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteVoucher}
        onEdit={(voucher) => {
          setEditingVoucher(voucher);
          setIsModalOpen(true);
        }}
        isLoading={loading}
      />

      {/* Modal Form Tambah/Edit Voucher */}
      {isModalOpen && (
        <VoucherForm
          initialData={editingVoucher}
          tryouts={tryouts}
          onSave={handleSaveVoucher}
          onClose={() => {
            setIsModalOpen(false);
            setEditingVoucher(null);
          }}
          isSaving={isSaving}
        />
      )}
    </section>
  );
}
