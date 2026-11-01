"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDemo } from "@/src/components/DemoProvider";
import { classes, assignments } from "@/src/data/mock";
import { getTeacherStats_103022400061 } from "@/src/features/questions/actions";

export default function TeacherDashboardPage_103022400061() {
  const { user } = useDemo();
  
  const teacherName = user?.name || "Pengajar";
  const teacherEmail = user?.email || "guru@titikterampil.id";

  const [stats, setStats_103022400061] = useState({
    essaysWaiting: 0,
    totalQuestions: 0,
    totalClasses: 0,
    totalAssignments: 0
  });

  useEffect(() => {
    setStats_103022400061(getTeacherStats_103022400061());
  }, []);

  return (
    <section className="page-content">
      <div className="dashboard-welcome">
        <div>
          <p className="eyebrow">TITIK TERAMPIL / P16 / DASHBOARD PENGAJAR</p>
          <h1>Dashboard Pengajar</h1>
          <p className="lead">
            Selamat datang, {teacherName}. Pantau penugasan esai, soal diampu, dan kelas binaan aktif.
          </p>
        </div>
        <div className="dashboard-badge-box">
          <span className="dashboard-badge">Pengajar Aktif</span>
          <span className="dashboard-badge-muted">{teacherEmail}</span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-box">
          <span className="stat-label">Esai Menunggu Koreksi</span>
          <strong className="stat-number">{stats.essaysWaiting}</strong>
          <small className="muted">Butuh tindakan segera</small>
        </div>
        <div className="stat-box">
          <span className="stat-label">Total Soal Diampu</span>
          <strong className="stat-number">{stats.totalQuestions}</strong>
          <small className="muted">Koleksi bank soal</small>
        </div>
        <div className="stat-box">
          <span className="stat-label">Kelas Binaan</span>
          <strong className="stat-number">{stats.totalClasses}</strong>
          <small className="muted">Bimbingan aktif</small>
        </div>
        <div className="stat-box">
          <span className="stat-label">Penugasan Aktif</span>
          <strong className="stat-number">{stats.totalAssignments}</strong>
          <small className="muted">Tugas esai terdaftar</small>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-head">
          <h2>Aksi dan Navigasi</h2>
        </div>
        <div className="quick-actions-grid">
          <Link href="/teacher/grading" className="quick-action-card">
            <span className="quick-action-tag">KOREKSI</span>
            <div>
              <strong>Daftar Penilaian Esai</strong>
              <p>Periksa dan berikan nilai pada pengumpulan tugas esai dari peserta.</p>
            </div>
          </Link>
          <Link href="/teacher/members" className="quick-action-card">
            <span className="quick-action-tag">MEMBER</span>
            <div>
              <strong>Pemberian Status Member</strong>
              <p>Kelola aktivasi dan pencabutan akses Member siswa bimbingan belajar.</p>
            </div>
          </Link>
          <Link href="/admin/questions" className="quick-action-card">
            <span className="quick-action-tag">SOAL</span>
            <div>
              <strong>Bank Soal</strong>
              <p>Akses koleksi soal dan manajemen paket latihan tryout.</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-head">
          <div>
            <h2>Daftar Kelas Binaan</h2>
            <p className="muted">Kelas bimbingan yang saat ini berada di bawah pengawasan Anda.</p>
          </div>
        </div>

        <div className="grid">
          {classes.map((cls) => (
            <article className="panel item-card" key={cls.id}>
              <div className="item-card-header">
                <span className="item-tag">{cls.level}</span>
                <span className="item-duration">Kelas {cls.grade}</span>
              </div>
              <h3>{cls.title}</h3>
              <p className="item-meta">ID Kelas: <b>{cls.id}</b></p>
            </article>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-head">
          <div>
            <h2>Penugasan Esai Terdaftar</h2>
            <p className="muted">Daftar penugasan aktif untuk evaluasi siswa.</p>
          </div>
        </div>

        <div className="grid">
          {assignments.map((asg) => (
            <article className="panel item-card" key={asg.id}>
              <div className="item-card-header">
                <span className="item-tag">TUGAS ESAI</span>
                <span className="item-duration">ID: {asg.id}</span>
              </div>
              <h3>{asg.title}</h3>
              <p className="item-meta" style={{ marginTop: '8px', lineHeight: '1.5' }}>
                {asg.instructions}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}