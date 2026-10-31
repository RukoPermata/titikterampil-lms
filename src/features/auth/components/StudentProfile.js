/**
 * Modul: Komponen Profil Siswa (P13)
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: form pengubahan data profil siswa dengan validasi konsistensi jenjang dan kelas.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDemo } from '@/src/components/DemoProvider';
import { updateProfile } from '@/src/features/auth/actions';

const gradeRanges = {
  SD: [1, 2, 3, 4, 5, 6],
  SMP: [7, 8, 9],
  SMA: [10, 11, 12],
};

/**
 * Komponen form profil siswa dengan validasi jenjang dan tingkat kelas.
 * @returns {React.ReactElement} Form profil siswa.
 */
export function StudentProfile() {
  const { user, updateUser, showToast } = useDemo();

  // 1. Inisialisasi state form dari profil siswa aktif
  const [name, setName] = useState(user?.name || '');
  const [level, setLevel] = useState(user?.level || 'SMA');
  const [grade, setGrade] = useState(user?.grade ? Number(user?.grade) : 12);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Menangani perubahan jenjang dan menyesuaikan opsi tingkat kelas.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Event perubahan select jenjang.
   */
  function handleLevelChange(e) {
    const nextLevel = e.target.value;
    setLevel(nextLevel);
    setError('');
    setSuccess('');

    // Sesuaikan kelas jika kelas saat ini tidak sesuai dengan jenjang baru
    const allowed = gradeRanges[nextLevel] || [];
    if (!allowed.includes(Number(grade))) {
      setGrade(allowed[0]);
    }
  }

  /**
   * Menyimpan pembaruan profil siswa.
   * @param {React.FormEvent<HTMLFormElement>} e - Event submit formulir.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!user || !user.id) {
      setError('Sesi siswa tidak ditemukan.');
      setIsSubmitting(false);
      return;
    }

    // 2. Panggil fungsi bisnis updateProfile
    const result = updateProfile({
      id: user.id,
      name,
      email: user.email,
      level,
      grade: Number(grade),
      role: 'student',
    });

    if (result.status === 'error') {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    // 3. Sinkronkan perubahan ke sesi aktif DemoProvider
    if (result.user && typeof updateUser === 'function') {
      updateUser(result.user);
    }

    if (typeof showToast === 'function') {
      showToast('Profil siswa berhasil diperbarui.', 'success');
    }

    setSuccess('Profil berhasil diperbarui. Perubahan jenjang dan kelas langsung aktif.');
    setIsSubmitting(false);
  }

  return (
    <section className="page-content">
      <div className="dashboard-welcome">
        <div>
          <p className="eyebrow">TITIK TERAMPIL / P13 / PENGATURAN AKUN</p>
          <h1>Profil Siswa</h1>
          <p className="lead">
            Kelola identitas, jenjang pendidikan, dan tingkat kelas aktif Anda untuk menyesuaikan materi latihan CBT.
          </p>
        </div>
      </div>

      <div className="profile-layout">
        {/* Formulir Edit Profil */}
        <div className="panel profile-form-panel">
          <h2>Ubah Data Diri</h2>
          <p className="muted">Perubahan data jenjang langsung menyesuaikan rekomendasi paket soal tryout.</p>

          {error && <div className="alert-error" role="alert">{error}</div>}
          {success && <div className="alert-success" role="status">{success}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="student-id">ID Pengguna</label>
              <input
                id="student-id"
                type="text"
                value={user?.id || 'student-demo'}
                disabled
                className="input-disabled"
              />
              <small className="muted">ID identitas dibuat otomatis oleh sistem.</small>
            </div>

            <div className="form-group">
              <label htmlFor="student-email">Alamat Email</label>
              <input
                id="student-email"
                type="email"
                value={user?.email || 'siswa@titikterampil.id'}
                disabled
                className="input-disabled"
              />
              <small className="muted">Alamat email terdaftar sebagai akun utama.</small>
            </div>

            <div className="form-group">
              <label htmlFor="student-name">Nama Lengkap Siswa *</label>
              <input
                id="student-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                placeholder="Contoh: Kaisar Rayfa"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="student-level">Jenjang Pendidikan *</label>
                <select id="student-level" value={level} onChange={handleLevelChange}>
                  <option value="SD">SD (Sekolah Dasar)</option>
                  <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                  <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="student-grade">Tingkat Kelas *</label>
                <select
                  id="student-grade"
                  value={grade}
                  onChange={(e) => {
                    setGrade(Number(e.target.value));
                    setError('');
                    setSuccess('');
                  }}
                >
                  {(gradeRanges[level] || []).map((g) => (
                    <option key={g} value={g}>
                      Kelas {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <Link href="/student/dashboard" className="button secondary">
                Kembali ke Dashboard
              </Link>
            </div>
          </form>
        </div>

        {/* Ringkasan Status Akun */}
        <aside className="profile-info-aside">
          <div className="panel">
            <h3>Informasi Akun</h3>
            <div className="profile-badge-row">
              <span className="item-tag">{level} / Kelas {grade}</span>
              <span className="badge-role">Siswa</span>
            </div>
            <p><strong>Nama:</strong> {name || user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Tahun Ajaran:</strong> 2026/2027</p>
            <hr className="divider" />
            <p className="muted" style={{ fontSize: '13px' }}>
              Pastikan jenjang dan kelas sesuai dengan tingkat Anda agar paket soal tryout yang disajikan relevan.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
