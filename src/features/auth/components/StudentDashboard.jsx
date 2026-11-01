/**
 * Modul: Komponen Dashboard Siswa (P04)
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: menampilkan ringkasan aktivitas tryout CBT, filter eksklusif jenjang, dan widget leaderboard.
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDemo } from '@/src/components/DemoProvider';
import { tryouts, leaderboards } from '@/src/data/mock';

/**
 * Komponen utama dashboard siswa yang menyajikan ikhtisar tryout CBT dan papan peringkat.
 * @returns {React.ReactElement} Antarmuka dashboard siswa.
 */
export function StudentDashboard() {
  const { user } = useDemo();

  // 1. Identifikasi data siswa aktif
  const studentName = user?.name || 'Siswa';
  const studentLevel = user?.level || 'SMA';
  const studentGrade = user?.grade || (studentLevel === 'Umum' ? 'Umum' : 12);
  const isMember = Boolean(user?.isMember);
  // 2. State data dinamis dengan integrasi Fetch API (Kriteria UTS Poin 2.2 & 2.3.f)
  const [dynamicTryouts, setDynamicTryouts] = useState(() => (
    isMember ? tryouts : tryouts.filter((t) => t.level === studentLevel)
  ));
  const [dynamicLeaderboard, setDynamicLeaderboard] = useState(() => (
    leaderboards[studentLevel] || leaderboards.SMA || []
  ));
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadData() {
      setIsLoading(true);
      setFetchError('');
      try {
        const [resTryout, resLeaderboard] = await Promise.all([
          fetch(`/api/tryouts?level=${isMember ? '' : studentLevel}`),
          fetch(`/api/leaderboard?level=${studentLevel}`),
        ]);

        if (!resTryout.ok || !resLeaderboard.ok) {
          throw new Error('Gagal memuat dari API.');
        }

        const tryoutJson = await resTryout.json();
        const leaderboardJson = await resLeaderboard.json();

        if (active) {
          if (Array.isArray(tryoutJson.data)) {
            setDynamicTryouts(tryoutJson.data);
          }
          if (Array.isArray(leaderboardJson.data)) {
            setDynamicLeaderboard(leaderboardJson.data);
          }
        }
      } catch {
        if (active) {
          setFetchError('Koneksi API offline. Menggunakan data lokal.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [studentLevel, isMember]);

  const displayTryouts = dynamicTryouts;
  const currentLeaderboard = dynamicLeaderboard;
  return (
    <section className="page-content">
      {/* 1. Header Ringkasan Siswa */}
      <div className="dashboard-welcome">
        <div>
          <p className="eyebrow">TITIK TERAMPIL / P04 / DASHBOARD PESERTA</p>
          <h1>Dashboard Peserta</h1>
          <p className="lead">
            Selamat datang, {studentName}. Pantau paket tryout aktif, jadwal latihan CBT, dan peringkat belajar Anda.
          </p>
          {user?.studyTargets && user.studyTargets.length > 0 && (
            <p className="muted" style={{ fontSize: '13px', margin: '4px 0 0' }}>
              Target Utama: <strong style={{ color: 'var(--primary)' }}>{user.studyTargets[0]}</strong>
            </p>
          )}
          {isLoading && (
            <small className="muted" style={{ display: 'block', marginTop: '6px' }}>
              Memperbarui data tryout via API...
            </small>
          )}
          {fetchError && (
            <small style={{ color: '#b42318', display: 'block', marginTop: '6px' }}>
              {fetchError}
            </small>
          )}
        </div>
        <div className="dashboard-badge-box">
          <span className="dashboard-badge">
            {isMember ? 'Member Titik Terampil' : `${studentLevel} / Kelas ${studentGrade}`}
          </span>
          <span className="dashboard-badge-muted">{user?.email || 'siswa@titikterampil.id'}</span>
          {user?.readiness && (
            <small className="muted" style={{ fontSize: '11px' }}>
              Kesiapan: {user.readiness}
            </small>
          )}
        </div>
      </div>

      {/* 2. Indikator Statistik Utama */}
      <div className="dashboard-stats">
        <div className="stat-box">
          <span className="stat-label">Jenjang Pendidikan</span>
          <strong className="stat-number">{studentLevel}</strong>
          <small className="muted">{studentLevel === 'Umum' ? 'Peserta Mandiri' : `Kelas ${studentGrade}`}</small>
        </div>
        <div className="stat-box">
          <span className="stat-label">Paket Tryout CBT</span>
          <strong className="stat-number">{relevantTryouts.length}</strong>
          <small className="muted">{isMember ? 'Akses Lintas Jenjang' : 'Khusus Jenjang Anda'}</small>
        </div>
        <div className="stat-box">
          <span className="stat-label">Status Akses</span>
          <strong className="stat-number" style={{ color: isMember ? 'var(--primary)' : 'var(--ink)' }}>
            {isMember ? 'Member' : 'Reguler'}
          </strong>
          <small className="muted">{isMember ? 'Semua Paket Terbuka' : 'Voucher & Gratis'}</small>
        </div>
        <div className="stat-box">
          <span className="stat-label">Tingkat Kesiapan</span>
          <strong className="stat-number" style={{ fontSize: '18px', paddingTop: '6px' }}>
            {user?.readiness || 'Cukup siap'}
          </strong>
          <small className="muted">Target Asesmen CBT</small>
        </div>
      </div>

      {/* 3. Navigasi Cepat Antar Modul */}
      <div className="dashboard-section">
        <div className="dashboard-section-head">
          <h2>Aksi dan Navigasi</h2>
        </div>
        <div className="quick-actions-grid">
          <Link href="/student/tryouts" className="quick-action-card">
            <span className="quick-action-tag">CBT</span>
            <div>
              <strong>Katalog Tryout</strong>
              <p>Temukan dan kerjakan latihan soal ujian online sesuai jenjang Anda.</p>
            </div>
          </Link>
          <Link href="/student/history" className="quick-action-card">
            <span className="quick-action-tag">HASIL</span>
            <div>
              <strong>Riwayat & Pembahasan</strong>
              <p>Lihat rekapitulasi skor, evaluasi jawaban, dan pembahasan tiap soal.</p>
            </div>
          </Link>
          <Link href="/student/leaderboard" className="quick-action-card">
            <span className="quick-action-tag">RANK</span>
            <div>
              <strong>Papan Peringkat</strong>
              <p>Pantau posisi skor terbaik Anda di antara sesama peserta jenjang {studentLevel}.</p>
            </div>
          </Link>
          <Link href="/student/profile" className="quick-action-card">
            <span className="quick-action-tag">PROFIL</span>
            <div>
              <strong>Profil & Target Studi</strong>
              <p>Perbarui WhatsApp, jenjang kelas, target kampus, dan kesiapan.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Rekomendasi Tryout CBT (Filter Eksklusif Jenjang) */}
      <div className="dashboard-section">
        <div className="dashboard-section-head">
          <div>
            <h2>Latihan Tryout CBT Tersedia</h2>
            <p className="muted">
              {isMember
                ? 'Sebagai Member, Anda dapat mengakses semua paket tryout lintas jenjang.'
                : `Paket tryout yang disaring eksklusif untuk jenjang ${studentLevel}.`}
            </p>
          </div>
          <Link href="/student/tryouts" className="button secondary">
            Buka Katalog Lengkap
          </Link>
        </div>

        {relevantTryouts.length === 0 ? (
          <div className="panel dashboard-empty">
            <p>Tidak ada paket tryout yang aktif untuk jenjang {studentLevel}.</p>
          </div>
        ) : (
          <div className="grid">
            {relevantTryouts.slice(0, 4).map((item) => (
              <article className="panel item-card" key={item.id}>
                <div className="item-card-header">
                  <span className="item-tag">{item.level} / Kelas {item.grade}</span>
                  <span className="item-duration">{item.durationMinutes} menit</span>
                </div>
                <h3>{item.title}</h3>
                <p className="item-meta">Mata Pelajaran: <b>{item.subject}</b></p>
                <div className="item-card-footer">
                  <Link href={`/student/tryouts/${item.id}`} className="button">
                    Mulai Ujian
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* 5. Widget Leaderboard Antar Jenjang */}
      <div className="dashboard-section">
        <div className="dashboard-section-head">
          <div>
            <h2>Papan Peringkat ({studentLevel})</h2>
            <p className="muted">5 besar skor tryout terbaik peserta jenjang {studentLevel}.</p>
          </div>
          <Link href="/student/leaderboard" className="button secondary">
            Lihat Peringkat Penuh
          </Link>
        </div>

        <div className="leaderboard-panel">
          <div style={{ overflowX: 'auto' }}>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Rank</th>
                  <th>Nama Peserta</th>
                  <th>Asal Sekolah / Kategori</th>
                  <th style={{ textAlign: 'right' }}>Skor Terbaik</th>
                </tr>
              </thead>
              <tbody>
                {currentLeaderboard.slice(0, 5).map((entry) => (
                  <tr key={entry.rank}>
                    <td className="leaderboard-rank">
                      <span className="leaderboard-rank-top">{entry.rank}</span>
                    </td>
                    <td>
                      <strong>{entry.name}</strong>
                    </td>
                    <td className="muted">{entry.school}</td>
                    <td className="leaderboard-score">{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
