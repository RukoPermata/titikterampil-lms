/**
 * Modul: Komponen Profil Siswa (P13)
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: form pengubahan data profil siswa dengan validasi konsistensi jenjang, WhatsApp, dan target studi.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDemo } from '@/src/components/DemoProvider';
import { updateProfile } from '@/src/features/auth/actions';

const gradeRanges = {
  SD: [4, 5, 6],
  SMP: [7, 8, 9],
  SMA: [10, 11, 12, 'Gap Year'],
  Umum: ['Umum'],
};

/**
 * Komponen form profil siswa dengan validasi jenjang, WhatsApp, dan target studi.
 * @returns {React.ReactElement} Form profil siswa.
 */
export function StudentProfile() {
  const { user, updateUser, showToast } = useDemo();

  // 1. Inisialisasi state form dari profil siswa aktif
  const [name, setName] = useState(user?.name || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '081234567890');
  const [level, setLevel] = useState(user?.level || 'SMA');
  const [grade, setGrade] = useState(user?.grade || 12);
  const [readiness, setReadiness] = useState(user?.readiness || 'Cukup siap');
  const [target1, setTarget1] = useState(user?.studyTargets?.[0] || '');
  const [target2, setTarget2] = useState(user?.studyTargets?.[1] || '');
  const [target3, setTarget3] = useState(user?.studyTargets?.[2] || '');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isHighSchoolOrGapYear = level === 'SMA' || level === 'Umum';

  /**
   * Menangani perubahan jenjang dan menyesuaikan opsi tingkat kelas.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Event perubahan select jenjang.
   */
  function handleLevelChange(e) {
    const nextLevel = e.target.value;
    setLevel(nextLevel);
    setError('');
    setSuccess('');

    const allowed = gradeRanges[nextLevel] || [];
    const isCurrentValid = allowed.some((g) => String(g) === String(grade));
    if (!isCurrentValid) {
      setGrade(allowed[0]);
    }
  }

  /**
   * Menyimpan pembaruan profil siswa.
   * @param {React.FormEvent<HTMLFormElement>} e - Event submit formulir.
   */
  function handleSubmit(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!user || !user.id) {
      setError('Sesi siswa tidak ditemukan.');
      setIsSubmitting(false);
      return;
    }

    // Validasi nomor WhatsApp
    const waPattern = /^(\+628|628|08)[0-9]{8,12}$/;
    const cleanedWa = String(whatsapp ?? '').trim().replace(/[\s-]/g, '');
    if (!cleanedWa) {
      setError('Nomor WhatsApp wajib diisi.');
      setIsSubmitting(false);
      return;
    }
    if (!waPattern.test(cleanedWa)) {
      setError('Nomor WhatsApp harus diawali 08 atau 628 dan terdiri dari 10-14 digit angka.');
      setIsSubmitting(false);
      return;
    }

    const studyTargets = [target1, target2, target3]
      .map((t) => String(t ?? '').trim())
      .filter(Boolean)
      .slice(0, 3);

    // 2. Panggil fungsi bisnis updateProfile
    const result = updateProfile({
      id: user.id,
      name,
      email: user.email,
      whatsapp: cleanedWa,
      level,
      grade,
      role: 'student',
      readiness,
      studyTargets,
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
            Kelola identitas, nomor WhatsApp, jenjang pendidikan, target prodi, dan kesiapan belajar Anda.
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

          <form onSubmit={handleSubmit} noValidate action="#">
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
                placeholder="Contoh: Budi Santoso"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="student-wa">Nomor WhatsApp *</label>
              <input
                id="student-wa"
                type="tel"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                placeholder="Contoh: 081234567890"
                required
              />
              <small className="muted">Untuk informasi tryout bulanan dan konsultasi belajar.</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="student-level">Jenjang Pendidikan *</label>
                <select id="student-level" value={level} onChange={handleLevelChange}>
                  <option value="SD">SD (Kelas 4-6)</option>
                  <option value="SMP">SMP (Kelas 7-9)</option>
                  <option value="SMA">SMA / SMK</option>
                  <option value="Umum">Umum / Alumni</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="student-grade">Tingkat Kelas *</label>
                <select
                  id="student-grade"
                  value={grade}
                  onChange={(e) => {
                    setGrade(e.target.value);
                    setError('');
                    setSuccess('');
                  }}
                >
                  {(gradeRanges[level] || []).map((g) => (
                    <option key={g} value={g}>
                      {typeof g === 'number' ? `Kelas ${g}` : g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="readiness-level">Tingkat Kesiapan Belajar *</label>
              <select
                id="readiness-level"
                value={readiness}
                onChange={(e) => setReadiness(e.target.value)}
              >
                <option value="Masih mencari arah">Masih mencari arah</option>
                <option value="Cukup siap">Cukup siap</option>
                <option value="Sangat siap">Sangat siap</option>
              </select>
            </div>

            {/* Target Studi Khusus SMA / Gap Year / Umum */}
            {isHighSchoolOrGapYear && (
              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>
                  Target Program Studi & Kampus Impian (Maksimal 3)
                </label>
                <div className="form-group">
                  <label htmlFor="p-target1" style={{ fontSize: '12px' }}>Pilihan 1</label>
                  <input
                    id="p-target1"
                    type="text"
                    placeholder="Contoh: Teknik Informatika - UI"
                    value={target1}
                    onChange={(e) => setTarget1(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="p-target2" style={{ fontSize: '12px' }}>Pilihan 2</label>
                  <input
                    id="p-target2"
                    type="text"
                    placeholder="Contoh: Sistem Informasi - ITB"
                    value={target2}
                    onChange={(e) => setTarget2(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="p-target3" style={{ fontSize: '12px' }}>Pilihan 3</label>
                  <input
                    id="p-target3"
                    type="text"
                    placeholder="Contoh: Ilmu Komputer - UGM"
                    value={target3}
                    onChange={(e) => setTarget3(e.target.value)}
                  />
                </div>
              </div>
            )}

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
              <span className="badge-role">{user?.isMember ? 'Member Bimbel' : 'Peserta Reguler'}</span>
            </div>
            <p><strong>Nama:</strong> {name || user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>WhatsApp:</strong> {whatsapp || user?.whatsapp || '-'}</p>
            <p><strong>Kesiapan:</strong> {readiness}</p>
            {target1 && <p><strong>Target 1:</strong> {target1}</p>}
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
