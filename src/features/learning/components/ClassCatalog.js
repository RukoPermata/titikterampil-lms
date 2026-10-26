'use client';
/**
 * Modul: Komponen katalog kelas belajar siswa (P10)
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Hubungkan perubahan keanggotaan dengan backend saat API siap.
 */
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useDemo } from '@/src/components/DemoProvider';
import { classes, users } from '@/src/data/mock';
import { filterClasses } from '../actions';
import styles from '../learning.module.css';

/**
 * Komponen utama katalog kelas belajar siswa.
 * Mengelola filter jenjang, tingkat kelas, pencarian materi, serta status keanggotaan.
 * @returns {React.ReactElement} Tampilan katalog kelas siswa.
 */
export function ClassCatalog() {

  const { user } = useDemo();
  const studentId = user?.id || 'demo';
  const studentLevel = user?.level || 'SMA';
  const studentGrade = user?.grade ? Number(user.grade) : 12;

  const [searchQuery, setSearchQuery] = useState('');
  const [membershipTab, setMembershipTab] = useState('all'); // 'all' | 'enrolled' | 'available'
  const [onlyMyLevel, setOnlyMyLevel] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(studentLevel);
  const [selectedGrade, setSelectedGrade] = useState(String(studentGrade));

  const [enrolledMap, setEnrolledMap] = useState(() => {
    const initial = {};
    for (const item of classes) {
      if (Array.isArray(item.studentIds) && item.studentIds.includes(studentId)) {
        initial[item.id] = true;
      }
    }
    return initial;
  });

  function handleToggleEnroll(classId) {
    setEnrolledMap((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  }

  function handleResetFilters() {
    setSearchQuery('');
    setMembershipTab('all');
    setOnlyMyLevel(true);
    setSelectedLevel(studentLevel);
    setSelectedGrade(String(studentGrade));
  }

  const teacherMap = useMemo(() => {
    const map = {};
    if (Array.isArray(users)) {
      for (const u of users) {
        if (u.id) map[u.id] = u.name;
      }
    }
    return map;
  }, []);

  const classesWithMembership = useMemo(() => {
    return classes.map((item) => {
      const isEnrolled = Boolean(enrolledMap[item.id]);
      const currentStudentIds = isEnrolled
        ? [...new Set([...(item.studentIds || []), studentId])]
        : (item.studentIds || []).filter((id) => id !== studentId);

      return {
        ...item,
        isEnrolled,
        studentIds: currentStudentIds,
      };
    });
  }, [enrolledMap, studentId]);

  const effectiveLevel = onlyMyLevel ? studentLevel : (selectedLevel || null);
  const effectiveGrade = onlyMyLevel ? studentGrade : (selectedGrade ? Number(selectedGrade) : null);

  const filteredList = useMemo(() => {
    return filterClasses(classesWithMembership, {
      level: effectiveLevel,
      grade: effectiveGrade,
      query: searchQuery,
      studentId,
      membership: membershipTab,
    });
  }, [classesWithMembership, effectiveLevel, effectiveGrade, searchQuery, studentId, membershipTab]);

  const { totalCount, enrolledCount, availableCount } = useMemo(() => {
    const scopedList = filterClasses(classesWithMembership, {
      level: effectiveLevel,
      grade: effectiveGrade,
      query: searchQuery,
    });

    let enrolled = 0;
    let available = 0;
    for (const item of scopedList) {
      if (item.isEnrolled) {
        enrolled += 1;
      } else {
        available += 1;
      }
    }

    return {
      totalCount: scopedList.length,
      enrolledCount: enrolled,
      availableCount: available,
    };
  }, [classesWithMembership, effectiveLevel, effectiveGrade, searchQuery]);

  return (
    <section className="page-content">
      <p className="eyebrow">TITIK TERAMPIL / P10</p>
      <h1>Kelas Belajar</h1>
      <p className="lead">
        Ruang belajar interaktif berdasarkan jenjang dan mata pelajaran.
        Pilih kelas yang Anda ikuti untuk membaca materi modul dan mengerjakan tugas.
      </p>

      {/* Banner informasi siswa aktif */}
      <div className={styles.studentBanner}>
        <div className={styles.studentInfo}>
          <strong>Profil Siswa:</strong>
          <span>{user?.name || 'Siswa Contoh'}</span>
          <span className={styles.studentBadge}>
            {studentLevel} · Kelas {studentGrade}
          </span>
        </div>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={onlyMyLevel}
            onChange={(e) => setOnlyMyLevel(e.target.checked)}
          />
          Hanya tampilkan jenjang saya ({studentLevel} - Kelas {studentGrade})
        </label>
      </div>

      {/* Toolbar Filter & Pencarian */}
      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Cari kelas atau mata pelajaran (misal: Matematika, Fisika)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="secondary"
              onClick={() => setSearchQuery('')}
            >
              Hapus
            </button>
          )}
        </div>

        <div className={styles.filterRow}>
          {/* Tab Filter Status Keanggotaan */}
          <div className={styles.tabs} role="tablist" aria-label="Status Keanggotaan">
            <button
              type="button"
              role="tab"
              aria-selected={membershipTab === 'all'}
              className={`${styles.tabButton} ${membershipTab === 'all' ? styles.tabActive : ''}`}
              onClick={() => setMembershipTab('all')}
            >
              Semua Kelas ({totalCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={membershipTab === 'enrolled'}
              className={`${styles.tabButton} ${membershipTab === 'enrolled' ? styles.tabActive : ''}`}
              onClick={() => setMembershipTab('enrolled')}
            >
              Kelas Saya ({enrolledCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={membershipTab === 'available'}
              className={`${styles.tabButton} ${membershipTab === 'available' ? styles.tabActive : ''}`}
              onClick={() => setMembershipTab('available')}
            >
              Tersedia ({availableCount})
            </button>
          </div>

          {/* Opsi Jenjang Tambahan bila toggle jenjang siswa dimatikan */}
          {!onlyMyLevel && (
            <div className={styles.filterControls}>
              <select
                aria-label="Pilih Jenjang"
                className={styles.filterSelect}
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">Semua Jenjang</option>
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
                <option value="SMA">SMA</option>
              </select>

              <select
                aria-label="Pilih Tingkat Kelas"
                className={styles.filterSelect}
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                <option value="">Semua Tingkat</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    Kelas {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <p className={styles.resultCount}>
        Menampilkan {filteredList.length} kelas belajar.
      </p>

      {/* Render Daftar Kartu Kelas */}
      {filteredList.length > 0 ? (
        <div className="grid">
          {filteredList.map((item) => {
            const teacherName = teacherMap[item.teacherId] || 'Pengajar Terampil';
            return (
              <article className="panel" key={item.id}>
                <div className={styles.cardHeader}>
                  <p className="eyebrow">
                    {item.level} · Kelas {item.grade}
                  </p>
                  {item.isEnrolled ? (
                    <span className={styles.badgeEnrolled}>
                      ✓ Terdaftar
                    </span>
                  ) : (
                    <span className={styles.badgeAvailable}>
                      Belum Terdaftar
                    </span>
                  )}
                </div>

                <h2>{item.title}</h2>
                <p className={styles.cardSubject}>{item.subject}</p>
                <p className={styles.cardDesc}>
                  {item.description || 'Ruang belajar interaktif untuk mendalami modul pembelajaran dan tugas.'}
                </p>
                <p className={styles.cardMeta}>
                  Pengajar: <strong>{teacherName}</strong>
                </p>

                <div className={styles.cardActions}>
                  <Link
                    className="button"
                    href={'/student/classes/' + item.id}
                  >
                    Buka materi →
                  </Link>

                  {item.isEnrolled ? (
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => handleToggleEnroll(item.id)}
                    >
                      Batal gabung
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => handleToggleEnroll(item.id)}
                    >
                      + Gabung kelas
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Kondisi belum memiliki kelas / pencarian tidak ditemukan */
        <div className={styles.emptyState}>
          <h3>Tidak ada kelas yang ditemukan</h3>
          {membershipTab === 'enrolled' ? (
            <p>
              Anda belum terdaftar pada kelas belajar untuk filter ini. Silakan pilih tab <strong>Semua Kelas</strong> atau <strong>Tersedia</strong> untuk bergabung ke kelas baru.
            </p>
          ) : (
            <p>
              Tidak ditemukan kelas yang cocok dengan kata kunci &quot;{searchQuery}&quot; atau filter yang aktif. Coba ubah kata kunci pencarian atau sesuaikan jenjang.
            </p>
          )}
          <button
            type="button"
            className="button"
            onClick={handleResetFilters}
          >
            Reset Filter &amp; Pencarian
          </button>
        </div>
      )}
    </section>
  );
}
