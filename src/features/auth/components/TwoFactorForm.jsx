/**
 * Modul: Layar 04: Formulir Verifikasi Kode Email (2FA)
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: simulasi verifikasi dua langkah (OTP 6 digit) setelah login email & kata sandi.
 */
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDemo } from '@/src/components/DemoProvider';

function TwoFactorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, showToast } = useDemo();

  const role = searchParams.get('role') || 'student';
  const email = searchParams.get('email') || 'siswa@titikterampil.id';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer 60 detik untuk kirim ulang kode
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  function handleOtpChange(e) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
    if (val.length === 6) {
      setError('');
    }
  }

  function handleSubmit(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    setError('');

    if (otp.length !== 6) {
      setError('Masukkan 6 digit kode verifikasi yang valid.');
      return;
    }

    setIsSubmitting(true);

    // Simulasi verifikasi OTP sukses untuk keperluan demo UTS
    if (typeof showToast === 'function') {
      showToast('Verifikasi 2FA berhasil. Selamat datang!', 'success');
    }
    signIn(role);
    router.push(`/${role}/dashboard`);
  }

  function handleResend() {
    if (timer > 0) return;
    setTimer(60);
    setError('');
    setOtp('');
    if (typeof showToast === 'function') {
      showToast('Kode verifikasi baru telah dikirimkan ke email Anda.', 'info');
    }
  }

  return (
    <main id="main" className="auth-page">
      <Link className="brand" href="/">
        titik<span>terampil.</span>
      </Link>

      <section className="panel" style={{ textAlign: 'center' }}>
        <p className="eyebrow">KEAMANAN AKUN / 2FA</p>
        <h1>Verifikasi 2 Langkah</h1>
        <p className="muted" style={{ margin: '0 auto 20px', maxWidth: '44ch' }}>
          Kode verifikasi 6 digit telah dikirimkan ke alamat email: <br />
          <strong style={{ color: 'var(--ink)' }}>{email}</strong>
        </p>

        {error && (
          <div className="alert-error" role="alert" style={{ textAlign: 'left' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate action="#">
          <div className="form-group" style={{ textAlign: 'center' }}>
            <label htmlFor="otp-input" style={{ marginBottom: '8px' }}>
              Masukkan 6 Digit Kode OTP *
            </label>
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={otp}
              onChange={handleOtpChange}
              className={`otp-input ${error ? 'has-error' : ''}`}
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="button"
            style={{ width: '100%', marginTop: '16px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Memverifikasi...' : 'Verifikasi dan Masuk'}
          </button>
        </form>

        <div className="otp-timer-box">
          {timer > 0 ? (
            <span>Kirim ulang kode dalam <b>{timer}</b> detik</span>
          ) : (
            <button
              type="button"
              className="otp-resend-btn"
              onClick={handleResend}
            >
              Kirim Ulang Kode Verifikasi
            </button>
          )}
        </div>

        <div className="demo-hints" style={{ textAlign: 'left' }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--ink)' }}>
            Simulasi Demo UTS:
          </p>
          <p style={{ margin: 0, fontSize: '12px' }}>
            Anda dapat memasukkan 6 digit angka apa saja (contoh: <code>123456</code>) untuk menyelesaikan verifikasi dua langkah ini.
          </p>
        </div>

        <div className="auth-footer" style={{ justifyContent: 'center' }}>
          <Link href="/login" style={{ fontSize: '13px' }}>
            Kembali ke halaman masuk
          </Link>
        </div>
      </section>
    </main>
  );
}

export function TwoFactorForm() {
  return (
    <Suspense fallback={<div className="page-content"><p>Memuat verifikasi...</p></div>}>
      <TwoFactorContent />
    </Suspense>
  );
}
