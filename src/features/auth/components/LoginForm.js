/**
 * Modul: P02: Formulir Masuk (Login)
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/src/components/DemoProvider';
import { authenticateUser } from '../actions';

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const { signIn, showToast } = useDemo();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasCredError = Boolean(errorMessage);

  function checkEmailRules(val) {
    const trimmed = String(val ?? '').trim();
    if (!trimmed) return 'Alamat email wajib diisi.';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
      return 'Format alamat email tidak valid (contoh: siswa@sekolah.id).';
    }
    return '';
  }

  function handleEmailChange(e) {
    const val = e.target.value;
    setEmail(val);
    setErrorMessage('');
    if (emailTouched || val.length > 0) {
      setEmailTouched(true);
      setEmailError(checkEmailRules(val));
    }
  }

  function handleEmailBlur() {
    setEmailTouched(true);
    setEmailError(checkEmailRules(email));
  }

  function handlePasswordChange(e) {
    const val = e.target.value;
    setPassword(val);
    setErrorMessage('');
    if (passwordTouched) {
      setPasswordError(val ? '' : 'Kata sandi wajib diisi.');
    }
  }

  function handlePasswordBlur() {
    setPasswordTouched(true);
    setPasswordError(!password ? 'Kata sandi wajib diisi.' : '');
  }

  function handleSubmit(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }

    setErrorMessage('');
    setEmailTouched(true);
    setPasswordTouched(true);

    const eErr = checkEmailRules(email);
    const pErr = !password ? 'Kata sandi wajib diisi.' : '';

    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) {
      return;
    }

    try {
      const result = authenticateUser({ email, password });
      if (result.status !== 'success') {
        setErrorMessage(result.message || 'Email atau kata sandi yang Anda masukkan salah.');
        return;
      }

      setIsLoading(true);
      signIn(result.user);
      if (typeof showToast === 'function') {
        showToast('Berhasil masuk ke akun.', 'success');
      }
      router.push(`/${result.user.role}/dashboard`);
    } catch {
      setErrorMessage('Terjadi kesalahan saat memproses login. Silakan coba lagi.');
    }
  }
  function handleQuickLogin(role) {
    signIn(role);
    router.push(`/${role}/dashboard`);
  }

  return (
    <main id="main" className="auth-page">
      <Link className="brand" href="/">
        titik<span>terampil.</span>
      </Link>

      <section className="panel">
        <p className="eyebrow">PORTAL MASUK / P02</p>
        <h1>Masuk ke akunmu.</h1>
        <p>Akses ruang belajar, tryout CBT, dan dashboard akademik.</p>

        {errorMessage && (
          <div className="alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate action="#">
          <div className="form-group">
            <label htmlFor="email">Alamat Email *</label>
            <input
              id="email"
              type="email"
              placeholder="contoh: siswa@titikterampil.id"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              className={emailError || hasCredError ? 'has-error' : ''}
              required
            />
            {emailError && <p className="error-msg">{emailError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Kata Sandi *</label>
            <div className={`password-input-group ${passwordError || hasCredError ? 'has-error' : ''}`}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {passwordError && <p className="error-msg">{passwordError}</p>}
          </div>

          <button type="submit" className="button" style={{ width: '100%', marginTop: '8px' }} disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="demo-hints">
          <p style={{ margin: '0 0 8px' }}>
            <b>Masuk Cepat Demo:</b>
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button type="button" className="secondary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => handleQuickLogin('student')}>
              Siswa
            </button>
            <button type="button" className="secondary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => handleQuickLogin('teacher')}>
              Pengajar
            </button>
            <button type="button" className="secondary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => handleQuickLogin('admin')}>
              Admin
            </button>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '11px' }}>
            Sandi akun demo: <code>password123</code>
          </p>
        </div>

        <div className="auth-footer">
          <span>Belum memiliki akun?</span>
          <Link href="/register">Daftar sekarang →</Link>
        </div>
      </section>
    </main>
  );
}
