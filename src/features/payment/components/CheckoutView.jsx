'use client';
/**
 * Modul: Tampilan Checkout Pembayaran dan Simulasi Status (Layar 09)
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: ringkasan pesanan, rincian harga, penukaran voucher, dan simulasi pembayaran demo.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDemo, useToast } from '@/src/components/DemoProvider';
import { formatRupiah } from '@/src/lib/utils';
import { paymentApi } from '../api.js';
import {
  calculateCheckoutDetails,
  formatTransactionDate,
  paymentMethods,
} from '../actions.js';
import styles from '../payment.module.css';

/**
 * Komponen utama halaman checkout dan simulasi pembayaran peserta (Layar 09).
 * @param {Object} props - Properti komponen.
 * @param {string} props.tryoutId - ID paket try out yang dibeli.
 * @returns {React.ReactElement} Tampilan alur checkout interaktif.
 */
export function CheckoutView({ tryoutId }) {
  const { user } = useDemo();
  const showToast = useToast();

  const [tryout, setTryout] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form checkout state
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [voucherNotice, setVoucherNotice] = useState(null);
  const [selectedMethodId, setSelectedMethodId] = useState('qris');

  // Status pesanan: 'initial' | 'Menunggu' | 'Berhasil' | 'Gagal' | 'Kedaluwarsa'
  const [orderStatus, setOrderStatus] = useState('initial');
  const [transaction, setTransaction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 menit hitung mundur

  // Muat data paket tryout dan voucher aktif
  useEffect(() => {
    let isMounted = true;
    async function init() {
      setLoading(true);
      setError('');
      try {
        const [tryoutsList, vouchersList] = await Promise.all([
          paymentApi.tryouts(),
          paymentApi.vouchers(),
        ]);

        if (!isMounted) return;

        const matchedTryout = tryoutsList.find((t) => t.id === tryoutId);
        if (!matchedTryout) {
          setError(`Paket tryout dengan ID "${tryoutId}" tidak ditemukan.`);
        } else {
          setTryout(matchedTryout);
        }
        setVouchers(Array.isArray(vouchersList) ? vouchersList : []);
      } catch (err) {
        if (isMounted) setError(err.message || 'Gagal memuat data paket tryout.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();
    return () => {
      isMounted = false;
    };
  }, [tryoutId]);

  // Timer hitung mundur saat status 'Menunggu'
  useEffect(() => {
    if (orderStatus !== 'Menunggu') return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSimulateStatus('Kedaluwarsa');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [orderStatus]);

  /**
   * Menghitung rincian harga berdasarkan voucher yang telah diterapkan.
   */
  const pricing = calculateCheckoutDetails(tryout, appliedCode, vouchers);

  /**
   * Menerapkan kode voucher yang dimasukkan siswa.
   */
  function handleApplyVoucher() {
    if (!voucherInput.trim()) {
      setVoucherNotice({ type: 'error', message: 'Masukkan kode voucher terlebih dahulu.' });
      return;
    }

    const testCalculation = calculateCheckoutDetails(tryout, voucherInput, vouchers);
    if (testCalculation.voucherError) {
      setVoucherNotice({ type: 'error', message: testCalculation.voucherError });
      setAppliedCode('');
    } else {
      setAppliedCode(voucherInput.trim().toUpperCase());
      setVoucherNotice({
        type: 'success',
        message: `Voucher "${testCalculation.appliedVoucher.code}" berhasil diterapkan! Diskon 100% untuk demo.`,
      });
      showToast('Voucher berhasil digunakan.', 'success');
    }
  }

  /**
   * Menghapus voucher yang sedang terpasang.
   */
  function handleRemoveVoucher() {
    setAppliedCode('');
    setVoucherInput('');
    setVoucherNotice(null);
    showToast('Voucher dihapus.', 'info');
  }

  const selectedMethod =
    paymentMethods.find((m) => m.id === selectedMethodId) || paymentMethods[0];

  /**
   * Membuat transaksi awal dengan status 'Menunggu' dan membuka layar instruksi pembayaran.
   */
  async function handleProceedToPayment() {
    setIsProcessing(true);
    try {
      const studentName = user?.name || 'Siswa Contoh';
      const studentId = user?.id || 'student-demo';

      const payload = {
        studentId,
        tryoutId: tryout.id,
        studentName,
        packageTitle: tryout.title,
        amount: pricing.total,
        paymentMethod: selectedMethod.name,
        status: pricing.total === 0 ? 'Berhasil' : 'Menunggu',
        date: new Date().toISOString(),
      };

      const createdTrx = await paymentApi.saveTransaction(payload);
      setTransaction(createdTrx);
      setOrderStatus(payload.status);

      if (payload.status === 'Berhasil') {
        showToast('Paket gratis berhasil diaktifkan!', 'success');
      } else {
        showToast('Pesanan dibuat. Silakan selesaikan pembayaran.', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Gagal membuat pesanan transaksi.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }

  /**
   * Menangani tombol simulasi aksi untuk demonstrasi presentasi UTS.
   * @param {'Berhasil' | 'Gagal' | 'Kedaluwarsa'} targetStatus - Status akhir yang disimulasikan.
   */
  async function handleSimulateStatus(targetStatus) {
    if (!transaction) return;
    setIsProcessing(true);
    try {
      const updated = await paymentApi.saveTransaction(
        { status: targetStatus },
        transaction.id
      );
      setTransaction(updated);
      setOrderStatus(targetStatus);

      if (targetStatus === 'Berhasil') {
        showToast('Simulasi: Pembayaran berhasil diverifikasi!', 'success');
      } else if (targetStatus === 'Gagal') {
        showToast('Simulasi: Pembayaran gagal atau ditolak.', 'error');
      } else if (targetStatus === 'Kedaluwarsa') {
        showToast('Simulasi: Batas waktu pembayaran telah kedaluwarsa.', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Gagal memperbarui status transaksi.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }

  /**
   * Memformat sisa waktu dalam format MM:SS.
   * @param {number} seconds - Jumlah detik.
   * @returns {string} String waktu MM:SS.
   */
  function formatCountdown(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // Tampilan loading atau error paket
  if (loading) {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>Memuat data checkout...</p>
          <p>Menyiapkan rincian paket dan tagihan tryout.</p>
        </div>
      </div>
    );
  }

  if (error || !tryout) {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.emptyState}>
          <p className={styles.emptyStateTitle}>Terjadi Kesalahan</p>
          <p>{error || 'Paket tryout tidak ditemukan.'}</p>
          <Link
            className={`${styles.btn} ${styles.btnPrimary}`}
            href="/student/tryouts"
            style={{ marginTop: '16px' }}
          >
            ← Kembali ke Katalog Tryout
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.checkoutContainer} aria-labelledby="checkout-page-title">
      <div style={{ marginBottom: '16px' }}>
        <Link
          href={`/student/tryouts/${tryout.id}`}
          style={{ fontSize: '14px', color: 'var(--tt-primary, #087F76)', textDecoration: 'none' }}
        >
          ← Kembali ke Detail Tryout
        </Link>
        <p className="eyebrow" style={{ marginTop: '8px' }}>
          TITIK TERAMPIL / CHECKOUT / P09
        </p>
        <h1 id="checkout-page-title" className={styles.title}>
          {orderStatus === 'initial'
            ? 'Checkout Paket Try Out'
            : orderStatus === 'Menunggu'
            ? 'Menunggu Pembayaran'
            : orderStatus === 'Berhasil'
            ? 'Pembayaran Berhasil'
            : orderStatus === 'Gagal'
            ? 'Pembayaran Gagal'
            : 'Pembayaran Kedaluwarsa'}
        </h1>
        <p className={styles.subtitle}>
          {orderStatus === 'initial'
            ? 'Periksa kembali ringkasan pesanan Anda, gunakan voucher jika ada, dan pilih metode pembayaran.'
            : 'Pantau status verifikasi sistem pembayaran untuk mendapatkan akses ruang ujian CBT.'}
        </p>
      </div>

      {/* =================================================================== */}
      {/* FASE 1: TAMPILAN CHECKOUT AWAL (FORM & RINGKASAN HARGA)             */}
      {/* =================================================================== */}
      {orderStatus === 'initial' && (
        <div className={styles.checkoutLayout}>
          {/* Kolom Kiri: Rincian Paket & Pilihan Metode Pembayaran */}
          <div>
            {/* Kartu Informasi Paket */}
            <div className={styles.checkoutCard}>
              <h2 className={styles.checkoutCardTitle}>Paket yang Dibeli</h2>
              <div className={styles.packageInfoStrip}>
                <h3 className={styles.packageTitle}>{tryout.title}</h3>
                <div className={styles.packageSpecs}>
                  <span className={styles.specItem}>
                    <strong>Jenjang:</strong> {tryout.level} (Kelas {tryout.grade})
                  </span>
                  <span className={styles.specItem}>
                    <strong>Mata Pelajaran:</strong> {tryout.subject}
                  </span>
                  <span className={styles.specItem}>
                    <strong>Durasi:</strong> {tryout.durationMinutes} Menit
                  </span>
                  <span className={styles.specItem}>
                    <strong>Jumlah Soal:</strong> {tryout.questionCount || 0} Butir
                  </span>
                </div>
              </div>
            </div>

            {/* Pilihan Metode Pembayaran (Jika paket berbayar) */}
            {pricing.total > 0 && (
              <div className={styles.checkoutCard}>
                <h2 className={styles.checkoutCardTitle}>Pilih Metode Pembayaran</h2>
                <div>
                  {paymentMethods.map((method) => {
                    const isSelected = selectedMethodId === method.id;
                    return (
                      <div
                        key={method.id}
                        className={`${styles.methodOption} ${
                          isSelected ? styles.methodOptionSelected : ''
                        }`}
                        onClick={() => setSelectedMethodId(method.id)}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          className={styles.methodRadio}
                          checked={isSelected}
                          onChange={() => setSelectedMethodId(method.id)}
                          aria-label={method.name}
                        />
                        <div className={styles.methodDetails}>
                          <div className={styles.methodName}>{method.name}</div>
                          <div className={styles.methodInstruction}>
                            {method.instructions}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Kupon Voucher & Ringkasan Pembayaran */}
          <div>
            <div className={styles.checkoutCard}>
              <h2 className={styles.checkoutCardTitle}>Kode Voucher Diskon</h2>

              {appliedCode ? (
                <div
                  style={{
                    background: 'var(--tt-soft, #EAF8F5)',
                    border: '1px solid #94DFCD',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                      {appliedCode}
                    </span>
                    <div style={{ fontSize: '12px', color: 'var(--tt-primary, #087F76)' }}>
                      Voucher promo aktif (Diskon 100%)
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                    onClick={handleRemoveVoucher}
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Contoh: TRYOUTGRATIS"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    />
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={handleApplyVoucher}
                    >
                      Gunakan
                    </button>
                  </div>
                  {voucherNotice && (
                    <p
                      className={
                        voucherNotice.type === 'error' ? styles.errorText : styles.helpText
                      }
                      style={{
                        color:
                          voucherNotice.type === 'error'
                            ? 'var(--tt-danger, #B42318)'
                            : 'var(--tt-primary, #087F76)',
                      }}
                    >
                      {voucherNotice.message}
                    </p>
                  )}
                  <p className={styles.helpText}>
                    Tips Demo: Anda dapat mencoba kode <code>TRYOUTGRATIS</code> atau{' '}
                    <code>BIMBELMEMBER</code>.
                  </p>
                </div>
              )}

              <hr
                style={{
                  border: 'none',
                  borderTop: '1px solid var(--tt-border, #D5E2DE)',
                  margin: '20px 0',
                }}
              />

              <h2 className={styles.checkoutCardTitle}>Rincian Pembayaran</h2>
              <div className={styles.priceRow}>
                <span>Harga Paket Normal</span>
                <span>{formatRupiah(pricing.basePrice)}</span>
              </div>

              {pricing.discount > 0 && (
                <div className={styles.priceRow}>
                  <span>Diskon Voucher</span>
                  <span className={styles.discountValue}>
                    - {formatRupiah(pricing.discount)}
                  </span>
                </div>
              )}

              <div className={styles.priceRow}>
                <span>Biaya Layanan Demo</span>
                <span>Gratis (Rp 0)</span>
              </div>

              <div className={styles.priceRowTotal}>
                <span>Total Tagihan</span>
                <span style={{ color: 'var(--tt-primary, #087F76)' }}>
                  {formatRupiah(pricing.total)}
                </span>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  style={{ width: '100%', padding: '14px' }}
                  onClick={handleProceedToPayment}
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? 'Memproses Pesanan...'
                    : pricing.total === 0
                    ? 'Konfirmasi Akses Gratis →'
                    : `Bayar Sekarang (${formatRupiah(pricing.total)}) →`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FASE 2: STATUS 'MENUNGGU PEMBAYARAN' (INSTRUKSI & SIMULASI DEMO)   */}
      {/* =================================================================== */}
      {orderStatus === 'Menunggu' && (
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div className={`${styles.statusBanner} ${styles.statusBannerWaiting}`}>
            <div className={`${styles.statusIcon} ${styles.statusIconWaiting}`}>⏳</div>
            <h2 className={styles.statusTitle}>Menunggu Pembayaran</h2>
            <p className={styles.statusMessage}>
              Silakan selesaikan pembayaran sebelum batas waktu berakhir:{' '}
              <strong style={{ color: '#D9822B', fontVariantNumeric: 'tabular-nums' }}>
                {formatCountdown(countdown)}
              </strong>
            </p>
          </div>

          <div className={styles.checkoutCard}>
            <div className={styles.priceRow}>
              <span>ID Transaksi / Invoice</span>
              <strong style={{ fontFamily: 'monospace' }}>{transaction?.id}</strong>
            </div>
            <div className={styles.priceRow}>
              <span>Paket Try Out</span>
              <strong>{transaction?.packageTitle}</strong>
            </div>
            <div className={styles.priceRow}>
              <span>Metode Pembayaran</span>
              <strong>{transaction?.paymentMethod}</strong>
            </div>
            <div className={styles.priceRow}>
              <span>Total Tagihan</span>
              <strong style={{ color: 'var(--tt-primary, #087F76)', fontSize: '18px' }}>
                {formatRupiah(transaction?.amount)}
              </strong>
            </div>

            {/* Simulasi Kode VA atau QRIS */}
            {selectedMethod.id === 'qris' ? (
              <div className={styles.payCodeBox}>
                <p style={{ margin: '0 0 8px', fontSize: '13px' }}>
                  Pindai QRIS Simulasi Menggunakan Aplikasi E-Wallet:
                </p>
                <div className={styles.qrSimulationBox}>
                  <div className={styles.qrPattern} />
                  <span>QRIS STANDAR PEMBAYARAN</span>
                </div>
                <small style={{ color: 'var(--tt-muted, #526862)' }}>
                  NMID: ID1029384756 | Titik Terampil Official
                </small>
              </div>
            ) : (
              <div className={styles.payCodeBox}>
                <p style={{ margin: '0', fontSize: '13px' }}>
                  Nomor Rekening / Virtual Account Pembayaran:
                </p>
                <div className={styles.payCodeNumber}>
                  {selectedMethod.accountNumber || '8277 0812 3456 7890'}
                </div>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      selectedMethod.accountNumber || '8277 0812 3456 7890'
                    );
                    showToast('Nomor Virtual Account disalin!', 'success');
                  }}
                >
                  Salin Nomor VA
                </button>
              </div>
            )}

            {/* Simulasi Kontrol Demo UTS */}
            <div className={styles.simulationBox}>
              <div className={styles.simulationHeader}>
                Simulasi Pembayaran (Fokus Evaluasi UTS)
              </div>
              <div className={styles.simulationDesc}>
                Gunakan tombol interaktif di bawah untuk menguji respons sistem terhadap skenario pembayaran berhasil, ditolak, atau waktu kedaluwarsa.
              </div>
              <div className={styles.simulationActions}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => handleSimulateStatus('Berhasil')}
                  disabled={isProcessing}
                >
                  ✓ Simulasikan Bayar Berhasil (Sukses)
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnDanger}`}
                  onClick={() => handleSimulateStatus('Gagal')}
                  disabled={isProcessing}
                >
                  ✕ Simulasikan Pembayaran Gagal
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => handleSimulateStatus('Kedaluwarsa')}
                  disabled={isProcessing}
                >
                  ⏱ Simulasikan Transaksi Kedaluwarsa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FASE 3: STATUS 'BERHASIL' (SUKSES DIVERIFIKASI)                     */}
      {/* =================================================================== */}
      {orderStatus === 'Berhasil' && (
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <div className={`${styles.statusBanner} ${styles.statusBannerSuccess}`}>
            <div className={`${styles.statusIcon} ${styles.statusIconSuccess}`}>✓</div>
            <h2 className={styles.statusTitle}>Pembayaran Berhasil!</h2>
            <p className={styles.statusMessage}>
              Akses paket tryout Anda telah aktif dan siap dikerjakan di Ruang Ujian CBT.
            </p>
          </div>

          <div className={styles.checkoutCard}>
            <div className={styles.priceRow}>
              <span>ID Transaksi</span>
              <strong style={{ fontFamily: 'monospace' }}>{transaction?.id}</strong>
            </div>
            <div className={styles.priceRow}>
              <span>Paket Try Out</span>
              <strong>{transaction?.packageTitle}</strong>
            </div>
            <div className={styles.priceRow}>
              <span>Nama Peserta</span>
              <strong>{transaction?.studentName}</strong>
            </div>
            <div className={styles.priceRow}>
              <span>Waktu Pembayaran</span>
              <span>{formatTransactionDate(transaction?.date)}</span>
            </div>
            <div className={styles.priceRow}>
              <span>Total Dibayar</span>
              <strong style={{ color: 'var(--tt-primary, #087F76)' }}>
                {formatRupiah(transaction?.amount)}
              </strong>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                className={`${styles.btn} ${styles.btnPrimary}`}
                href={`/student/exams/${tryout.id}`}
                style={{ padding: '14px' }}
              >
                Mulai Kerjakan Try Out Sekarang →
              </Link>
              <Link
                className={`${styles.btn} ${styles.btnSecondary}`}
                href="/student/tryouts"
              >
                Kembali ke Katalog Try Out
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FASE 4: STATUS 'GAGAL' ATAU 'KEDALUWARSA'                           */}
      {/* =================================================================== */}
      {(orderStatus === 'Gagal' || orderStatus === 'Kedaluwarsa') && (
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <div
            className={`${styles.statusBanner} ${
              orderStatus === 'Gagal'
                ? styles.statusBannerFailed
                : styles.statusBannerWaiting
            }`}
          >
            <div
              className={`${styles.statusIcon} ${
                orderStatus === 'Gagal'
                  ? styles.statusIconFailed
                  : styles.statusIconWaiting
              }`}
            >
              {orderStatus === 'Gagal' ? '✕' : '⏱'}
            </div>
            <h2 className={styles.statusTitle}>
              {orderStatus === 'Gagal'
                ? 'Pembayaran Gagal / Ditolak'
                : 'Batas Waktu Pembayaran Berakhir'}
            </h2>
            <p className={styles.statusMessage}>
              {orderStatus === 'Gagal'
                ? 'Transaksi tidak dapat diproses oleh sistem bank penyedia. Saldo Anda tidak terpotong.'
                : 'Pesanan ini telah kedaluwarsa karena melewati batas waktu 15 menit.'}
            </p>
          </div>

          <div className={styles.checkoutCard}>
            <div className={styles.priceRow}>
              <span>ID Transaksi</span>
              <strong style={{ fontFamily: 'monospace' }}>{transaction?.id}</strong>
            </div>
            <div className={styles.priceRow}>
              <span>Paket Try Out</span>
              <strong>{transaction?.packageTitle}</strong>
            </div>
            <div className={styles.priceRow}>
              <span>Status</span>
              <span
                className={`${styles.badge} ${
                  orderStatus === 'Gagal' ? styles.badgeDanger : styles.badgeMuted
                }`}
              >
                {orderStatus}
              </span>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => {
                  setOrderStatus('initial');
                  setCountdown(900);
                }}
              >
                Ulangi Pembayaran Paket
              </button>
              <Link
                className={`${styles.btn} ${styles.btnSecondary}`}
                href="/student/tryouts"
              >
                Pilih Paket Latihan Lain
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
