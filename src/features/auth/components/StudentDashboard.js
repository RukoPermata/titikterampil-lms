/**
 * Modul: Komponen Dashboard Siswa (P04)
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: menampilkan ringkasan aktivitas belajar, kelas, jadwal tryout, dan navigasi siswa.
 */
'use client';

import Link from 'next/link';
import { useDemo } from '@/src/components/DemoProvider';
import { tryouts, classes, assignments, users } from '@/src/data/mock';

/**
 * Komponen utama dashboard siswa yang menyajikan ikhtisar belajar dan navigasi cepat.
 * @returns {React.ReactElement} Antarmuka dashboard siswa.
 */
export function StudentDashboard() {
  const { user } = useDemo();

  // 1. Identifikasi data siswa aktif
  const studentName = user?.name || 'Siswa';
  const studentLevel = user?.level || 'SMA';
  const studentGrade = user?.grade || 12;

  // 2. Filter kelas dan tryout yang relevan dengan jenjang siswa
  const relevantClasses = classes.filter(
    (c) => !studentLevel || c.level === studentLevel
  );
  const displayClasses = relevantClasses.length > 0 ? relevantClasses : classes;

  const relevantTryouts = tryouts.filter(
    (t) => !studentLevel || t.level === studentLevel
  );
  const displayTryouts = relevantTryouts.length > 0 ? relevantTryouts : tryouts;

  // 3. Ringkasan data aktif
  const activeClassCount = displayClasses.length;
  const availableTryoutCount = displayTryouts.length;
  const assignmentCount = assignments.length;

  /**
   * Menemukan nama pengajar berdasarkan ID pengajar.
   * @param {string} teacherId - ID pengajar.
   * @returns {string} Nama pengajar terdaftar.
   */
  function getTeacherName(teacherId) {
    const teacher = users.find((u) => u.id === teacherId);
    return teacher ? teacher.name : 'Pengajar Titik Terampil';
  }

  return (
    <section className="page-content">
      {/* 1. Header Ringkasan Siswa */}
      <div className="dashboard-welcome">
        <div>
          <p className="eyebrow">TITIK TERAMPIL / P04 / DASHBOARD SISWA</p>
          <h1>Dashboard Siswa</h1>
          <p className="lead">
            Selamat datang, {studentName}. Pantau kelas aktif, jadwal latihan CBT, dan tugas belajar Anda di sini.
          </p>
        </div>
        <div className="dashboard-badge-box">
          <span className="dashboard-badge">
            {studentLevel} / Kelas {studentGrade}
          </span>
          <span className="dashboard-badge-muted">{user?.email || 'siswa@titikterampil.id'}</span>
        </div>
      </div>

      {/* 2. Indikator Statistik Utama */}
      <div className="dashboard-stats">
        <div className="stat-box">
          <span className="stat-label">Jenjang Pendidikan</span>
          <strong className="stat-number">{studentLevel}</strong>
          <small className="muted">Kelas {studentGrade}</small>
        </div>
        <div className="stat-box">
          <span className="stat-label">Kelas Terdaftar</span>
          <strong className="stat-number">{activeClassCount}</strong>
          <small className="muted">Ruang belajar aktif</small>
        </div>
        <div className="stat-box">
          <span className="stat-label">Paket Tryout CBT</span>
          <strong className="stat-number">{availableTryoutCount}</strong>
          <small className="muted">Latihan tersedia</small>
        </div>
        <div className="stat-box">
          <span className="stat-label">Tugas Terjadwal</span>
          <strong className="stat-number">{assignmentCount}</strong>
          <small className="muted">Latihan formatif</small>
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
              <p>Latihan ujian berbasis komputer sesuai jenjang dan mata pelajaran.</p>
            </div>
          </Link>
          <Link href="/student/classes" className="quick-action-card">
            <span className="quick-action-tag">LMS</span>
            <div>
              <strong>Kelas Belajar</strong>
              <p>Daftar ruang kelas, dokumen materi, dan instruksi pembelajaran.</p>
            </div>
          </Link>
          <Link href="/student/history" className="quick-action-card">
            <span className="quick-action-tag">REKAP</span>
            <div>
              <strong>Riwayat Ujian</strong>
              <p>Rekapitulasi skor hasil submit ujian dan evaluasi jawaban.</p>
            </div>
          </Link>
          <Link href="/student/profile" className="quick-action-card">
            <span className="quick-action-tag">AKUN</span>
            <div>
              <strong>Profil Siswa</strong>
              <p>Pembaruan nama, jenjang pendidikan, dan penyesuaian tingkat kelas.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Rekomendasi Tryout CBT */}
      <div className="dashboard-section">
        <div className="dashboard-section-head">
          <div>
            <h2>Paket Tryout CBT Tersedia</h2>
            <p className="muted">Daftar latihan soal ujian untuk jenjang {studentLevel}.</p>
          </div>
          <Link href="/student/tryouts" className="button secondary">
            Buka Katalog Lengkap
          </Link>
        </div>

        {displayTryouts.length === 0 ? (
          <div className="panel dashboard-empty">
            <p>Tidak ada paket tryout yang aktif untuk jenjang ini.</p>
          </div>
        ) : (
          <div className="grid">
            {displayTryouts.slice(0, 3).map((item) => (
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

      {/* 5. Daftar Kelas Belajar */}
      <div className="dashboard-section">
        <div className="dashboard-section-head">
          <div>
            <h2>Kelas Belajar Terdaftar</h2>
            <p className="muted">Ruang belajar dan penugasan tahun ajaran 2026/2027.</p>
          </div>
          <Link href="/student/classes" className="button secondary">
            Buka Semua Kelas
          </Link>
        </div>

        {displayClasses.length === 0 ? (
          <div className="panel dashboard-empty">
            <p>Belum ada kelas belajar yang terhubung dengan akun Anda.</p>
          </div>
        ) : (
          <div className="grid">
            {displayClasses.map((c) => (
              <article className="panel item-card" key={c.id}>
                <div className="item-card-header">
                  <span className="item-tag">{c.level} / Kelas {c.grade}</span>
                </div>
                <h3>{c.title}</h3>
                <p className="item-meta">Pengajar: <b>{getTeacherName(c.teacherId)}</b></p>
                <div className="item-card-footer">
                  <Link href={`/student/classes/${c.id}`} className="button secondary">
                    Masuk Kelas
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
