/**
 * Modul: P03 — Formulir Pendaftaran Siswa
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/src/components/DemoProvider';
import { validateRegistration, saveRegisteredUser } from '../actions';

const GRADE_OPTIONS = {
  SD: [1, 2, 3, 4, 5, 6],
  SMP: [7, 8, 9],
  SMA: [10, 11, 12],
};

export function RegisterForm() {
  const router = useRouter();
  const { signIn } = useDemo();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState('SMA');
  const [grade, setGrade] = useState('10');

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleLevelChange(newLevel) {
    setLevel(newLevel);
    const availableGrades = GRADE_OPTIONS[newLevel] || [];
    if (availableGrades.length > 0) {
      setGrade(String(availableGrades[0]));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    const validation = validateRegistration({
      name,
      email,
      password,
      level,
      grade,
    });

    if (!validation.valid) {
      setErrorMessage(validation.errors?.[0] || 'Periksa kembali data pendaftaran Anda.');
      return;
    }

    setIsLoading(true);

    // Buat profil pengguna baru di sesi frontend dan simpan ke penyimpanan lokal
    const newUser = {
      id: `student-${Date.now()}`,
      name: validation.candidate.name,
      email: validation.candidate.email,
      password,
      role: 'student',
      level: validation.candidate.level,
      grade: validation.candidate.grade,
    };

    saveRegisteredUser(newUser);
    signIn(newUser);
    router.push('/student/dashboard');
  }

  return (
    <main id="main" className="auth-page">
      <Link className="brand" href="/">
        titik<span>terampil.</span>
      </Link>

      <section className="panel">
        <p className="eyebrow">PENDAFTARAN SISWA / P03</p>
        <h1>Buat akun barumu.</h1>
        <p>Bergabung dan mulai akses materi belajar serta latihan tryout CBT.</p>

        {errorMessage && (
          <div className="alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              id="name"
              type="text"
              placeholder="contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Alamat Email</label>
            <input
              id="email"
              type="email"
              placeholder="contoh: budi@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <input
              id="password"
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="level">Jenjang</label>
              <select
                id="level"
                value={level}
                onChange={(e) => handleLevelChange(e.target.value)}
              >
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
                <option value="SMA">SMA</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="grade">Tingkat Kelas</label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                {(GRADE_OPTIONS[level] || []).map((g) => (
                  <option key={g} value={g}>
                    Kelas {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="button"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang →'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Sudah memiliki akun?</span>
          <Link href="/login">Masuk ke akunmu →</Link>
        </div>
      </section>
    </main>
  );
}
