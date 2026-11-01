/**
 * Modul: P03: Formulir Pendaftaran Siswa
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
  SD: [4, 5, 6],
  SMP: [7, 8, 9],
  SMA: [10, 11, 12, 'Gap Year'],
  Umum: ['Umum'],
};

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

export function RegisterForm() {
  const router = useRouter();
  const { signIn, showToast } = useDemo();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [whatsappError, setWhatsappError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [whatsappTouched, setWhatsappTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const [level, setLevel] = useState('SMA');
  const [grade, setGrade] = useState('10');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Memeriksa kesesuaian aturan nama lengkap secara interaktif.
   * @param {string} val - Nilai nama lengkap.
   * @returns {string} Pesan error atau string kosong jika valid.
   */
  function checkNameRules(val) {
    const trimmed = String(val ?? '').trim();
    if (!trimmed) return 'Nama lengkap wajib diisi.';
    if (trimmed.length < 2) return 'Nama lengkap minimal 2 karakter.';
    return '';
  }

  /**
   * Memeriksa kesesuaian format alamat email secara interaktif.
   * @param {string} val - Nilai alamat email.
   * @returns {string} Pesan error atau string kosong jika valid.
   */
  function checkEmailRules(val) {
    const trimmed = String(val ?? '').trim();
    if (!trimmed) return 'Alamat email wajib diisi.';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
      return 'Format alamat email tidak valid (contoh: siswa@sekolah.id).';
    }
    return '';
  }

  function handleNameChange(e) {
    const val = e.target.value;
    setName(val);
    setNameTouched(true);
    setNameError(checkNameRules(val));
  }

  function handleNameBlur() {
    setNameTouched(true);
    setNameError(checkNameRules(name));
  }

  function handleEmailChange(e) {
    const val = e.target.value;
    setEmail(val);
    setEmailTouched(true);
    setEmailError(checkEmailRules(val));
  }

  function handleEmailBlur() {
    setEmailTouched(true);
    setEmailError(checkEmailRules(email));
  }

  /**
   * Memeriksa kesesuaian nomor WhatsApp secara interaktif.
   * @param {string} val - Nilai nomor WhatsApp.
   * @returns {string} Pesan error atau string kosong jika valid.
   */
  function checkWhatsappRules(val) {
    const raw = String(val ?? '').trim().replace(/[\s-]/g, '');
    if (!raw) return 'Nomor WhatsApp wajib diisi.';
    const waPattern = /^(\+628|628|08)[0-9]{8,12}$/;
    if (!waPattern.test(raw)) {
      return 'Nomor WhatsApp harus diawali 08 atau 628 (contoh: 081234567890).';
    }
    return '';
  }

  function handleWhatsappChange(e) {
    const val = e.target.value.replace(/[^\d+]/g, '');
    setWhatsapp(val);
    setWhatsappTouched(true);
    setWhatsappError(checkWhatsappRules(val));
  }

  function handleWhatsappBlur() {
    setWhatsappTouched(true);
    setWhatsappError(checkWhatsappRules(whatsapp));
  }
  /**
   * Memeriksa kesesuaian aturan kata sandi secara interaktif.
   * @param {string} val - Nilai kata sandi yang diketik.
   * @returns {string} Pesan kesalahan atau string kosong jika valid.
   */
  function checkPasswordRules(val) {
    if (!val) return 'Kata sandi wajib diisi.';
    if (val.length < 8) return 'Kata sandi minimal 8 karakter.';
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/`~]/;
    if (!specialCharPattern.test(val)) {
      return 'Kata sandi wajib mengandung minimal satu simbol (misal: !@#$).';
    }
    return '';
  }

  /**
   * Menangani ketikan pada kata sandi utama dan memvalidasi secara real-time.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event input kata sandi.
   */
  function handlePasswordChange(e) {
    const val = e.target.value;
    setPassword(val);
    setPasswordTouched(true);

    // Tampilkan inline error jika tidak sesuai aturan, hilang otomatis saat sudah sesuai
    const err = checkPasswordRules(val);
    setPasswordError(err);

    // Sinkronkan validasi konfirmasi jika konfirmasi sudah disentuh
    if (confirmTouched && confirmPassword) {
      if (confirmPassword === val) {
        setConfirmError('');
      } else {
        setConfirmError('Konfirmasi kata sandi tidak cocok.');
      }
    }
  }

  /**
   * Menangani ketikan pada konfirmasi sandi. Hilang otomatis saat nilainya sudah sama.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event input konfirmasi sandi.
   */
  function handleConfirmChange(e) {
    const val = e.target.value;
    setConfirmPassword(val);

    // Jika sudah cocok dengan kata sandi utama, hilangkan error secara otomatis
    if (val === password) {
      setConfirmError('');
    } else if (confirmTouched) {
      setConfirmError('Konfirmasi kata sandi tidak cocok.');
    }
  }

  /**
   * Menangani saat pengguna berpindah fokus/klik di tempat lain dari konfirmasi sandi.
   */
  function handleConfirmBlur() {
    setConfirmTouched(true);
    if (!confirmPassword) {
      setConfirmError('Konfirmasi kata sandi wajib diisi.');
    } else if (confirmPassword !== password) {
      setConfirmError('Konfirmasi kata sandi tidak cocok.');
    } else {
      setConfirmError('');
    }
  }

  function handleLevelChange(newLevel) {
    setLevel(newLevel);
    const availableGrades = GRADE_OPTIONS[newLevel] || [];
    if (availableGrades.length > 0) {
      setGrade(String(availableGrades[0]));
    }
  }

  function handleSubmit(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    setErrorMessage('');
    setNameTouched(true);
    setEmailTouched(true);
    setWhatsappTouched(true);
    setPasswordTouched(true);
    setConfirmTouched(true);

    const nErr = checkNameRules(name);
    const eErr = checkEmailRules(email);
    const wErr = checkWhatsappRules(whatsapp);
    const pErr = checkPasswordRules(password);

    let cErr = '';
    if (!confirmPassword) {
      cErr = 'Konfirmasi kata sandi wajib diisi.';
    } else if (confirmPassword !== password) {
      cErr = 'Konfirmasi kata sandi tidak cocok.';
    }

    setNameError(nErr);
    setEmailError(eErr);
    setWhatsappError(wErr);
    setPasswordError(pErr);
    setConfirmError(cErr);

    if (nErr || eErr || wErr || pErr || cErr) {
      return;
    }
    const validation = validateRegistration({
      name,
      email,
      whatsapp,
      password,
      confirmPassword,
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
      whatsapp: validation.candidate.whatsapp,
      password,
      role: 'student',
      level: validation.candidate.level,
      grade: validation.candidate.grade,
    };

    saveRegisteredUser(newUser);
    signIn(newUser);
    if (typeof showToast === 'function') {
      showToast('Pendaftaran akun siswa berhasil.', 'success');
    }
    router.push('/student/onboarding');
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

        <form onSubmit={handleSubmit} noValidate action="#">
          <div className="form-group">
            <label htmlFor="name">Nama Lengkap *</label>
            <input
              id="name"
              type="text"
              placeholder="contoh: Budi Santoso"
              value={name}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              className={nameError ? 'has-error' : ''}
              required
            />
            {nameError && <p className="error-msg">{nameError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Alamat Email *</label>
            <input
              id="email"
              type="email"
              placeholder="contoh: budi@email.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              className={emailError ? 'has-error' : ''}
              required
            />
            {emailError && <p className="error-msg">{emailError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="whatsapp">Nomor WhatsApp *</label>
            <input
              id="whatsapp"
              type="tel"
              placeholder="contoh: 081234567890"
              value={whatsapp}
              onChange={handleWhatsappChange}
              onBlur={handleWhatsappBlur}
              className={whatsappError ? 'has-error' : ''}
              required
            />
            {whatsappError && <p className="error-msg">{whatsappError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Kata Sandi *</label>
            <div className={`password-input-group ${passwordError ? 'has-error' : ''}`}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 8 karakter dan simbol"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => {
                  setPasswordTouched(true);
                  setPasswordError(checkPasswordRules(password));
                }}
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
            {passwordError ? (
              <p className="error-msg">{passwordError}</p>
            ) : (
              <small className="muted" style={{ display: 'block', marginTop: '4px' }}>
                Minimal 8 karakter dan mengandung simbol khusus (misal: !@#$).
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Konfirmasi Kata Sandi *</label>
            <div className={`password-input-group ${confirmError ? 'has-error' : ''}`}>
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Ulangi kata sandi"
                value={confirmPassword}
                onChange={handleConfirmChange}
                onBlur={handleConfirmBlur}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi sandi' : 'Tampilkan konfirmasi sandi'}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {confirmError && <p className="error-msg">{confirmError}</p>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="level">Jenjang *</label>
              <select
                id="level"
                value={level}
                onChange={(e) => handleLevelChange(e.target.value)}
              >
                <option value="SD">SD (Kelas 4-6)</option>
                <option value="SMP">SMP (Kelas 7-9)</option>
                <option value="SMA">SMA / SMK</option>
                <option value="Umum">Umum / Alumni</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="grade">Tingkat Kelas *</label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                {(GRADE_OPTIONS[level] || []).map((g) => (
                  <option key={g} value={g}>
                    {typeof g === 'number' ? `Kelas ${g}` : g}
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
            {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Sudah memiliki akun?</span>
          <Link href="/login">Masuk ke akun Anda</Link>
        </div>
      </section>
    </main>
  );
}
