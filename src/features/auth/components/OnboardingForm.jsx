/**
 * Modul: Layar 05: Formulir Personalisasi Awal / Onboarding
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: personalisasi siswa baru (rumpun belajar, kesiapan, target studi) sebelum masuk dashboard.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/src/components/DemoProvider';

/**
 * Komponen onboarding personalisasi awal siswa baru.
 * @returns {React.ReactElement} Antarmuka form personalisasi siswa.
 */
export function OnboardingForm() {
  const router = useRouter();
  const { user, updateUser, showToast } = useDemo();

  const isHighSchoolOrGapYear = user?.level === 'SMA' || user?.level === 'Umum';

  const [stream, setStream] = useState('Saintek');
  const [readiness, setReadiness] = useState('Cukup siap');
  const [target1, setTarget1] = useState(user?.studyTargets?.[0] || '');
  const [target2, setTarget2] = useState(user?.studyTargets?.[1] || '');
  const [target3, setTarget3] = useState(user?.studyTargets?.[2] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSave(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsSubmitting(true);

    const studyTargets = [target1, target2, target3]
      .map((t) => String(t ?? '').trim())
      .filter(Boolean)
      .slice(0, 3);

    const updatedProfile = {
      stream,
      readiness,
      studyTargets,
    };

    if (typeof updateUser === 'function') {
      updateUser(updatedProfile);
    }

    if (typeof showToast === 'function') {
      showToast('Personalisasi awal berhasil disimpan.', 'success');
    }

    router.push('/student/dashboard');
  }

  function handleSkip() {
    router.push('/student/dashboard');
  }

  return (
    <main id="main" className="auth-page" style={{ maxWidth: '680px' }}>
      <Link className="brand" href="/">
        titik<span>terampil.</span>
      </Link>

      <section className="panel">
        <p className="eyebrow">LANGKAH AWAL / P05</p>
        <h1>Personalisasi Belajarmu</h1>
        <p className="lead" style={{ fontSize: '15px', margin: '0 0 24px' }}>
          Bantu kami menyiapkan rekomendasi tryout CBT dan materi yang sesuai dengan target akademik Anda.
        </p>

        <form onSubmit={handleSave} noValidate action="#">
          {/* 1. Ringkasan Jenjang Terpilih */}
          <div className="form-group">
            <label>Jenjang Pendidikan Anda</label>
            <div
              style={{
                padding: '12px 14px',
                background: 'var(--accent-soft)',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <strong style={{ color: 'var(--primary)' }}>
                {user?.level || 'SMA'} / Kelas {user?.grade || 12}
              </strong>
              <small className="muted">Telah dikonfirmasi saat pendaftaran</small>
            </div>
          </div>

          {/* 2. Rumpun Belajar */}
          <div className="form-group">
            <label htmlFor="stream-select">Rumpun Minat Belajar *</label>
            <select
              id="stream-select"
              value={stream}
              onChange={(e) => setStream(e.target.value)}
            >
              <option value="Saintek">Saintek / IPA (Matematika & Sains Alam)</option>
              <option value="Soshum">Soshum / IPS (Sosial & Humaniora)</option>
              <option value="Campuran">Campuran / Umum (Persiapan Menyeluruh)</option>
            </select>
            <small className="muted">Menyesuaikan fokus latihan soal tryout harian.</small>
          </div>

          {/* 3. Tingkat Kesiapan */}
          <div className="form-group">
            <label htmlFor="readiness-select">Tingkat Kesiapan Ujian Saat Ini *</label>
            <select
              id="readiness-select"
              value={readiness}
              onChange={(e) => setReadiness(e.target.value)}
            >
              <option value="Masih mencari arah">Masih mencari arah (Perlu pemetaan materi dari dasar)</option>
              <option value="Cukup siap">Cukup siap (Fokus latihan soal dan pendalaman rumus)</option>
              <option value="Sangat siap">Sangat siap (Simulasi intensif dan manajemen waktu ujian)</option>
            </select>
          </div>

          {/* 4. Target Studi (Khusus SMA / Gap Year / Umum) */}
          {isHighSchoolOrGapYear && (
            <div
              style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid var(--line)',
              }}
            >
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>
                Target Program Studi & Kampus Impian (Maksimal 3 Pilihan)
              </label>
              <p className="muted" style={{ fontSize: '13px', margin: '0 0 14px' }}>
                Opsional: Masukkan target PTN/kedinasan Anda untuk memotivasi capaian tryout UTBK.
              </p>

              <div className="form-group">
                <label htmlFor="target-1" style={{ fontSize: '12px' }}>Pilihan Utama (Prioritas 1)</label>
                <input
                  id="target-1"
                  type="text"
                  placeholder="Contoh: Teknik Informatika - Universitas Indonesia"
                  value={target1}
                  onChange={(e) => setTarget1(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="target-2" style={{ fontSize: '12px' }}>Pilihan Kedua (Prioritas 2)</label>
                <input
                  id="target-2"
                  type="text"
                  placeholder="Contoh: Sistem Informasi - Institut Teknologi Bandung"
                  value={target2}
                  onChange={(e) => setTarget2(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="target-3" style={{ fontSize: '12px' }}>Pilihan Ketiga (Prioritas 3)</label>
                <input
                  id="target-3"
                  type="text"
                  placeholder="Contoh: Ilmu Komputer - Universitas Gadjah Mada"
                  value={target3}
                  onChange={(e) => setTarget3(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Tombol Aksi */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '28px',
            }}
          >
            <button type="submit" className="button" style={{ flex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan dan Masuk ke Dashboard'}
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={handleSkip}
            >
              Lewati untuk Sekarang
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
