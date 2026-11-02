'use client';

/**
 * Modul: Petunjuk ujian sebelum CBT (P06b)
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menampilkan aturan, memeriksa akses, dan memulai attempt secara eksplisit.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/src/components/DemoProvider';
import { questions as fallbackQuestions, tryouts as fallbackTryouts } from '@/src/data/mock';
import { startAttempt } from '../actions';
import { getStudentAttempts, isTryoutUnlocked, saveAttempt } from '../attempt-store';
import styles from '../cbt.module.css';

/**
 * Menampilkan ringkasan paket dan tombol mulai ujian.
 * @param {Object} props - Properti komponen.
 * @param {string} props.tryoutId - ID paket dari route.
 * @returns {React.ReactElement} Halaman petunjuk ujian.
 */
export function ExamInstructions({ tryoutId }) {
  const router = useRouter();
  const { user } = useDemo();
  const initialTryout = fallbackTryouts.find((item) => item.id === tryoutId) ?? null;
  const initialQuestions = fallbackQuestions.filter((item) => item.tryoutId === tryoutId);

  const [tryout, setTryout] = useState(initialTryout);
  const [questions, setQuestions] = useState(initialQuestions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  // 1. Muat detail paket dan bank soal dari mock API.
  useEffect(() => {
    let active = true;
    async function loadData() {
      setLoading(true);
      setError('');
      try {
        const [tryoutResponse, questionResponse] = await Promise.all([
          fetch(`/api/tryouts/${encodeURIComponent(tryoutId)}`, { cache: 'no-store' }),
          fetch(`/api/questions?tryoutId=${encodeURIComponent(tryoutId)}`, { cache: 'no-store' }),
        ]);
        if (!tryoutResponse.ok || !questionResponse.ok) throw new Error('Data ujian tidak lengkap.');
        const tryoutPayload = await tryoutResponse.json();
        const questionPayload = await questionResponse.json();
        if (!active) return;
        if (tryoutPayload.data) setTryout(tryoutPayload.data);
        if (Array.isArray(questionPayload.data)) setQuestions(questionPayload.data);
      } catch {
        if (active) setError('Koneksi API tidak tersedia. Memakai data contoh yang tersimpan.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [tryoutId]);

  // 2. Baca attempt siswa langsung dari storage agar data selalu sesuai saat render.
  const studentAttempts = user?.id ? getStudentAttempts(user.id).filter((item) => item.tryoutId === tryoutId) : [];
  const activeAttempt = studentAttempts.find((item) => !item.submittedAt) ?? null;
  const submittedCount = studentAttempts.filter((item) => Boolean(item.submittedAt)).length;

  if (!tryout && !loading) {
    return (
      <section className="page-content">
        <h1>Paket tryout tidak ditemukan</h1>
        <p>ID paket <strong>{tryoutId}</strong> belum tersedia.</p>
        <Link className="button" href="/student/tryouts">Kembali ke katalog</Link>
      </section>
    );
  }

  const isMember = Boolean(user?.isMember);
  const hasAccess = Boolean(tryout?.isFree) || isMember ||
    Boolean(user?.id && isTryoutUnlocked(user.id, tryoutId));
  const canStart = Boolean(tryout) && hasAccess && questions.length > 0 && !loading;

  /**
   * Membuat attempt baru lalu membuka ruang ujian.
   * @returns {void}
   */
  function handleStart() {
    if (!canStart || !user?.id) return;
    setStarting(true);
    setError('');
    const result = startAttempt(tryout, { studentId: user.id });
    if (result.status !== 'success') {
      setError(result.message ?? 'Percobaan tidak dapat dimulai.');
      setStarting(false);
      return;
    }
    if (!saveAttempt(result.attempt)) {
      setError('Penyimpanan browser tidak tersedia. Aktifkan localStorage untuk memulai ujian.');
      setStarting(false);
      return;
    }
    router.push(`/student/exams/${tryout.id}`);
  }

  return (
    <section className="page-content">
      <p className="eyebrow">TITIK TERAMPIL / P26 / PETUNJUK UJIAN</p>
      <Link href={`/student/tryouts/${tryoutId}`}>← Kembali ke detail paket</Link>
      <h1>{tryout ? tryout.title : 'Memuat paket…'}</h1>
      <p className="lead">
        Baca aturan berikut sebelum menekan tombol mulai. Waktu ujian tidak berhenti saat halaman dimuat ulang.
      </p>

      {error && <p className={styles.warningText} role="status">{error}</p>}

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}><small>Durasi</small><strong>{tryout?.durationMinutes ?? '—'} menit</strong></div>
        <div className={styles.metaItem}><small>Soal tersedia</small><strong>{questions.length} soal</strong></div>
        <div className={styles.metaItem}><small>Percobaan selesai</small><strong>{submittedCount} kali</strong></div>
        <div className={styles.metaItem}><small>Status akses</small><strong>{hasAccess ? 'Terbuka' : 'Terkunci'}</strong></div>
      </div>

      {Array.isArray(tryout?.subtests) && tryout.subtests.length > 0 && (
        <article className="panel">
          <h2>Subtes dan alokasi waktu</h2>
          <div className={styles.subtestList}>
            {tryout.subtests.map((subtest) => (
              <div className={styles.subtestItem} key={subtest.id}>
                <div>
                  <strong>{subtest.title}</strong>
                  <p className={styles.cardMeta}>{subtest.questionCount} soal</p>
                </div>
                <span>{subtest.durationMinutes} menit</span>
              </div>
            ))}
          </div>
        </article>
      )}

      <article className="panel">
        <h2>Ketentuan pengerjaan</h2>
        <ul>
          <li>Timer dihitung dari deadline attempt dan tidak dapat dijeda.</li>
          <li>Jawaban disimpan otomatis di browser setelah perubahan.</li>
          <li>Gunakan penanda ragu-ragu untuk meninjau soal sebelum mengumpulkan.</li>
          <li>Ujian dikumpulkan otomatis saat waktu habis.</li>
          <li>Nilai objektif tampil langsung; jawaban esai menunggu koreksi pengajar.</li>
        </ul>

        {!hasAccess && (
          <p className={styles.warningText}>
            Paket ini belum terbuka. Kembali ke detail paket untuk menukar voucher atau menyelesaikan pembayaran.
          </p>
        )}
        {hasAccess && questions.length === 0 && !loading && (
          <p className={styles.warningText}>
            Bank soal paket ini belum tersedia. Pilih paket demo yang memiliki soal untuk mencoba alur CBT.
          </p>
        )}

        <div className={styles.actionRow}>
          {activeAttempt ? (
            <Link className="button" href={`/student/exams/${tryoutId}`}>
              Lanjutkan ujian →
            </Link>
          ) : (
            <button type="button" onClick={handleStart} disabled={!canStart || starting}>
              {starting ? 'Menyiapkan…' : 'Mulai ujian →'}
            </button>
          )}
          {!hasAccess && (
            <Link className="button secondary" href={`/student/tryouts/${tryoutId}`}>
              Buka detail paket
            </Link>
          )}
        </div>
        {activeAttempt && (
          <p className={styles.helperText}>
            Attempt aktif ditemukan. Timer tetap mengacu pada deadline yang tersimpan.
          </p>
        )}
      </article>
    </section>
  );
}
