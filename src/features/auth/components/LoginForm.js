/**
 * Modul: P02 — Formulir Masuk (Login)
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/src/components/DemoProvider';
import { authenticateUser } from '../actions';

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useDemo();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    const result = authenticateUser({ email, password });
    if (result.status !== 'success') {
      if (result.field) {
        setFieldErrors({ [result.field]: result.message });
      } else {
        setErrorMessage(result.message);
      }
      return;
    }

    setIsLoading(true);
    signIn(result.user);
    router.push(`/${result.user.role}/dashboard`);
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

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Alamat Email</label>
            <input
              id="email"
              type="email"
              placeholder="contoh: siswa@titikterampil.id"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
              }}
              required
            />
            {fieldErrors.email && <p className="error-msg">{fieldErrors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
              }}
              required
            />
            {fieldErrors.password && <p className="error-msg">{fieldErrors.password}</p>}
          </div>

          <button type="submit" className="button" style={{ width: '100%', marginTop: '8px' }} disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Masuk →'}
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
