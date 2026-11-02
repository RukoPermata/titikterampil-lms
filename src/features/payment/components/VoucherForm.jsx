'use client';
/**
 * Modul: Formulir pembuatan dan pengubahan voucher tryout
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: validasi input voucher, pemilihan paket yang dicakup, dan penyimpanan.
 */
import { useState } from 'react';
import { validateVoucherForm } from '../actions.js';
import styles from '../payment.module.css';

/**
 * Komponen form modal untuk membuat atau mengedit voucher.
 * @param {Object} props - Properti komponen.
 * @param {Object|null} props.initialData - Data awal voucher jika sedang diedit.
 * @param {Array<Object>} props.tryouts - Daftar seluruh paket tryout untuk opsi cakupan.
 * @param {Function} props.onSave - Callback saat form berhasil disimpan.
 * @param {Function} props.onClose - Callback saat modal ditutup atau dibatalkan.
 * @param {boolean} props.isSaving - Status sedang menyimpan data ke server.
 * @returns {React.ReactElement} Form modal pembuatan voucher.
 */
export function VoucherForm({
  initialData = null,
  tryouts = [],
  onSave,
  onClose,
  isSaving = false,
}) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    title: initialData?.title || '',
    quota: initialData?.quota ? String(initialData.quota) : '50',
    validUntil: initialData?.validUntil || '',
    scopeType: initialData?.applicablePackages?.includes('all') ? 'all' : 'custom',
    selectedPackages: initialData?.applicablePackages?.filter((p) => p !== 'all') || [],
    status: initialData?.status || 'Aktif',
  });

  const [errors, setErrors] = useState({});

  /**
   * Mengubah nilai field teks biasa pada form.
   * @param {string} field - Nama field data.
   * @param {string} value - Nilai baru.
   */
  function handleTextChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  /**
   * Menangani toggle pemilihan paket spesifik.
   * @param {string} packageId - ID paket yang dicentang atau dihapus.
   */
  function handleTogglePackage(packageId) {
    setFormData((prev) => {
      const exists = prev.selectedPackages.includes(packageId);
      const nextList = exists
        ? prev.selectedPackages.filter((id) => id !== packageId)
        : [...prev.selectedPackages, packageId];
      return { ...prev, selectedPackages: nextList };
    });
    if (errors.applicablePackages) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.applicablePackages;
        return next;
      });
    }
  }

  /**
   * Menangani pengiriman formulir voucher.
   * @param {React.FormEvent} event - Event submit form.
   */
  function handleSubmit(event) {
    event.preventDefault();

    const applicablePackages =
      formData.scopeType === 'all' ? ['all'] : formData.selectedPackages;

    const payload = {
      code: formData.code.toUpperCase(),
      title: formData.title,
      quota: formData.quota,
      validUntil: formData.validUntil,
      applicablePackages,
      status: formData.status,
    };

    const validation = validateVoucherForm(payload);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onSave(validation.candidate, initialData?.id || null);
  }

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="voucher-form-title">
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 id="voucher-form-title">
            {isEditing ? 'Ubah Kode Voucher' : 'Buat Voucher Try Out Baru'}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Tutup form voucher"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="voucher-code">
              Kode Voucher *
            </label>
            <input
              id="voucher-code"
              type="text"
              className={`${styles.input} ${errors.code ? styles.inputError : ''}`}
              placeholder="Contoh: TRYOUT2026, BIMBELGRATIS"
              value={formData.code}
              onChange={(e) => handleTextChange('code', e.target.value.toUpperCase())}
              disabled={isSaving || isEditing}
              autoFocus={!isEditing}
            />
            {errors.code ? (
              <p className={styles.errorText} role="alert">{errors.code}</p>
            ) : (
              <p className={styles.helpText}>Hanya huruf kapital, angka, strip (-), dan garis bawah (_).</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="voucher-title">
              Judul / Deskripsi Promo *
            </label>
            <input
              id="voucher-title"
              type="text"
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              placeholder="Contoh: Voucher Tryout Bulanan Gratis Siswa Bimbel"
              value={formData.title}
              onChange={(e) => handleTextChange('title', e.target.value)}
              disabled={isSaving}
            />
            {errors.title && <p className={styles.errorText} role="alert">{errors.title}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="voucher-quota">
                Kuota Pemakaian *
              </label>
              <input
                id="voucher-quota"
                type="number"
                min="1"
                step="1"
                className={`${styles.input} ${errors.quota ? styles.inputError : ''}`}
                value={formData.quota}
                onChange={(e) => handleTextChange('quota', e.target.value)}
                disabled={isSaving}
              />
              {errors.quota && <p className={styles.errorText} role="alert">{errors.quota}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="voucher-valid-until">
                Masa Berlaku Hingga *
              </label>
              <input
                id="voucher-valid-until"
                type="date"
                className={`${styles.input} ${errors.validUntil ? styles.inputError : ''}`}
                value={formData.validUntil}
                onChange={(e) => handleTextChange('validUntil', e.target.value)}
                disabled={isSaving}
              />
              {errors.validUntil && <p className={styles.errorText} role="alert">{errors.validUntil}</p>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Cakupan Paket Try Out *
            </label>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px' }}>
                <input
                  type="radio"
                  name="scopeType"
                  value="all"
                  checked={formData.scopeType === 'all'}
                  onChange={() => handleTextChange('scopeType', 'all')}
                  disabled={isSaving}
                />
                Semua Paket Try Out (all)
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px' }}>
                <input
                  type="radio"
                  name="scopeType"
                  value="custom"
                  checked={formData.scopeType === 'custom'}
                  onChange={() => handleTextChange('scopeType', 'custom')}
                  disabled={isSaving}
                />
                Pilih Paket Tertentu
              </label>
            </div>

            {formData.scopeType === 'custom' && (
              <div
                style={{
                  maxHeight: '160px',
                  overflowY: 'auto',
                  border: '1px solid var(--tt-border, #D5E2DE)',
                  borderRadius: '8px',
                  padding: '10px',
                  background: 'var(--tt-surface-subtle, #F5F8F6)',
                }}
              >
                {tryouts.length === 0 ? (
                  <p className={styles.helpText}>Tidak ada data paket tryout yang ditemukan.</p>
                ) : (
                  tryouts.map((tryout) => (
                    <label
                      key={tryout.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 4px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #ECEFEF',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedPackages.includes(tryout.id)}
                        onChange={() => handleTogglePackage(tryout.id)}
                        disabled={isSaving}
                      />
                      <span>
                        <strong>{tryout.title}</strong>{' '}
                        <span style={{ color: 'var(--tt-muted, #526862)' }}>
                          ({tryout.level} - {tryout.subject})
                        </span>
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
            {errors.applicablePackages && (
              <p className={styles.errorText} role="alert">{errors.applicablePackages}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="voucher-status">
              Status Awal
            </label>
            <select
              id="voucher-status"
              className={styles.selectInput}
              value={formData.status}
              onChange={(e) => handleTextChange('status', e.target.value)}
              disabled={isSaving}
              style={{ width: '100%' }}
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={onClose}
              disabled={isSaving}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={isSaving}
            >
              {isSaving ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Buat Voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
