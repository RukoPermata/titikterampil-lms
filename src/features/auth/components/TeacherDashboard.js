/**
 * Modul: Komponen Dashboard Pengajar (P14)
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: menampilkan ringkasan kelas, siswa, tugas, dan status penilaian bagi pengajar aktif.
 */
'use client';

import Link from 'next/link';
import { useDemo } from '@/src/components/DemoProvider';
import { getTeacherSummary } from '@/src/features/auth/actions';
import { classes, assignments, users } from '@/src/data/mock';

/**
 * Komponen utama dashboard pengajar yang menyajikan ringkasan kelas, tugas, dan navigasi pengajaran.
 * @returns {React.ReactElement} Antarmuka dashboard pengajar.
 */
export function TeacherDashboard() {
  const { user } = useDemo();

  const teacherId = user?.id || 'teacher-demo';
  const teacherName = user?.name || 'Pengajar Contoh';

  // 1. Ambil ringkasan pengajar melalui fungsi getTeacherSummary
  const result = getTeacherSummary(teacherId, { classes, assignments, users });
  const summary = result.summary || {
    classCount: 0,
    studentCount: 0,
    assignmentCount: 0,
    pendingSubmissionCount: 0,
  };
  const teacherClasses = result.classes || [];
  const teacherAssignments = result.assignments || [];

  return (
    <section className="page-content">
      {/* 1. Header Pengajar */}
      <div className="dashboard-welcome">
        <div>
          <p className="eyebrow">TITIK TERAMPIL / P14 / DASHBOARD PENGAJAR</p>
          <h1>Dashboard Pengajar</h1>
          <p className="lead">
            Selamat bertugas, {teacherName}. Kelola materi kelas, pantau keaktifan peserta didik, dan lakukan penilaian tugas.
          </p>
        </div>
        <div className="dashboard-badge-box">
          <span className="dashboard-badge">Peran: Pengajar</span>
          <span className="dashboard-badge-muted">{user?.email || 'guru@titikterampil.id'}</span>
        </div>
      </div>

      {/* 2. Kartu Indikator Statistik Pengajar */}
      <div className="dashboard-stats">
        <div className="stat-box">
          <span className="stat-label">Kelas Diampu</span>
          <strong className="stat-number">{summary.classCount}</strong>
          <small className="muted">Ruang kelas aktif</small>
        </div>
        <div className="stat-box">
          <span className="stat-label">Siswa Terdaftar</span>
          <strong className="stat-number">{summary.studentCount}</strong>
          <small className="muted">Peserta didik binaan</small>
        </div>
        <div className="stat-box">
          <span className="stat-label">Tugas Terbit</span>
          <strong className="stat-number">{summary.assignmentCount}</strong>
          <small className="muted">Latihan pembelajaran</small>
        </div>
        <div className="stat-box">
          <span className="stat-label">Menunggu Penilaian</span>
          <strong className="stat-number" style={{ color: '#8b1e1e' }}>
            {summary.pendingSubmissionCount}
          </strong>
          <small className="muted">Perlu evaluasi nilai</small>
        </div>
      </div>

      {/* 3. Aksi Cepat Pengajaran */}
      <div className="dashboard-section">
        <div className="dashboard-section-head">
          <h2>Modul Pengajaran</h2>
        </div>
        <div className="quick-actions-grid">
          <Link href="/teacher/materials" className="quick-action-card">
            <span className="quick-action-tag">MATERI</span>
            <div>
              <strong>Kelola Materi</strong>
              <p>Pengunggahan dan pembaruan bahan ajar, teks, dan dokumen referensi.</p>
            </div>
          </Link>
          <Link href="/teacher/assignments" className="quick-action-card">
            <span className="quick-action-tag">TUGAS</span>
            <div>
              <strong>Tugas dan Evaluasi</strong>
              <p>Pemberian tugas baru dan penginputan nilai beserta catatan evaluasi.</p>
            </div>
          </Link>
          <Link href="/teacher/results" className="quick-action-card">
            <span className="quick-action-tag">MONITOR</span>
            <div>
              <strong>Monitoring Peserta Didik</strong>
              <p>Rekapitulasi ketuntasan belajar dan hasil pengerjaan latihan siswa.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Daftar Kelas Diampu */}
      <div className="dashboard-section">
        <div className="dashboard-section-head">
          <div>
            <h2>Kelas yang Anda Bimbing</h2>
            <p className="muted">Daftar kelas aktif pada tahun ajaran 2026/2027.</p>
          </div>
          <Link href="/teacher/materials" className="button secondary">
            Buka Kelola Materi
          </Link>
        </div>

        {teacherClasses.length === 0 ? (
          <div className="panel dashboard-empty">
            <p>Belum ada kelas yang terdaftar atas nama akun pengajar Anda.</p>
          </div>
        ) : (
          <div className="grid">
            {teacherClasses.map((c) => (
              <article className="panel item-card" key={c.id}>
                <div className="item-card-header">
                  <span className="item-tag">{c.level} / Kelas {c.grade}</span>
                  <span className="item-duration">Kode: {c.id}</span>
                </div>
                <h3>{c.title}</h3>
                <p className="item-meta">
                  Status Pengajaran: <b>Aktif</b>
                </p>
                <div className="item-card-footer" style={{ display: 'flex', gap: '8px' }}>
                  <Link href="/teacher/materials" className="button" style={{ flex: 1 }}>
                    Bahan Ajar
                  </Link>
                  <Link href="/teacher/assignments" className="button secondary" style={{ flex: 1 }}>
                    Kelola Tugas
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* 5. Daftar Tugas & Pengumpulan */}
      <div className="dashboard-section">
        <div className="dashboard-section-head">
          <div>
            <h2>Tugas dan Pengumpulan Terbaru</h2>
            <p className="muted">Pemeriksaan pengumpulan jawaban tugas siswa.</p>
          </div>
          <Link href="/teacher/assignments" className="button secondary">
            Lihat Semua Tugas
          </Link>
        </div>

        {teacherAssignments.length === 0 ? (
          <div className="panel dashboard-empty">
            <p>Belum ada tugas aktif pada kelas yang diampu.</p>
          </div>
        ) : (
          <div className="grid">
            {teacherAssignments.map((a) => (
              <article className="panel item-card" key={a.id}>
                <div className="item-card-header">
                  <span className="item-tag">Tugas Kelas</span>
                  <span className="item-duration" style={{ color: '#8b1e1e', fontWeight: 600 }}>
                    Menunggu Evaluasi
                  </span>
                </div>
                <h3>{a.title}</h3>
                <p className="item-meta">{a.instructions}</p>
                <div className="item-card-footer">
                  <Link href="/teacher/assignments" className="button">
                    Periksa Jawaban
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
