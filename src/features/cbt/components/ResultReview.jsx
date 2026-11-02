'use client';

/**
 * Modul: Hasil dan pembahasan CBT (P08)
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menampilkan skor, status esai, dan pembahasan setiap soal.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useDemo } from '@/src/components/DemoProvider';
import { questions as fallbackQuestions } from '@/src/data/mock';
import { getAttemptReview } from '../actions';
import { getAttempt } from '../attempt-store';
import styles from '../cbt.module.css';

const TYPE_LABELS = {
  single_choice: 'Pilihan tunggal',
  multiple_choice: 'Pilihan jamak',
  true_false: 'Benar / salah',
  short_answer: 'Isian singkat',
  essay: 'Esai',
};

const STATUS_LABELS = {
  correct: 'Benar',
  wrong: 'Salah',
  empty: 'Kosong',
  pending: 'Menunggu nilai',
};

/**
 * Menampilkan jawaban dalam bentuk teks yang mudah dibaca.
 * @param {unknown} value - Jawaban mentah.
 * @param {Array<string>} options - Daftar opsi soal.
 * @param {string} type - Tipe soal.
 * @returns {string} Teks jawaban.
 */
function answerText(value, options, type) {
  if (value === undefined || value === null) return '—';
  if (type === 'multiple_choice') {
    if (!Array.isArray(value) || value.length === 0) return '—';
    return value.map((index) => `${String.fromCharCode(65 + index)}. ${options[index] ?? ''}`).join(', ');
  }
  if (type === 'single_choice' || type === 'true_false') {
    if (!Number.isInteger(value)) return '—';
    return `${String.fromCharCode(65 + value)}. ${options[value] ?? ''}`;
  }
  return String(value).trim() || '—';
}

/**
 * Menampilkan hasil satu attempt beserta pembahasan seluruh soal.
 * @param {Object} props - Properti komponen.
 * @param {string} props.attemptId - ID attempt dari route.
 * @returns {React.ReactElement} Halaman hasil dan pembahasan.
 */
export function ResultReview({ attemptId }) {
  const { user } = useDemo();
  const [attempt] = useState(() => getAttempt(attemptId));
  const [questions, setQuestions] = useState(() => {
    const stored = getAttempt(attemptId);
    return fallbackQuestions.filter((item) => item.tryoutId === stored?.tryoutId);
  });
  const [loading, setLoading] = useState(Boolean(attempt?.tryoutId));
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // 1. Ambil bank soal berdasarkan paket attempt.
  useEffect(() => {
    const tryoutId = attempt?.tryoutId;
    if (!tryoutId) return undefined;
    let active = true;
    async function loadQuestions() {
      setLoading(true);
      try {
        const response = await fetch(`/api/questions?tryoutId=${encodeURIComponent(tryoutId)}`, {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Soal tidak dapat dimuat.');
        const payload = await response.json();
        if (active && Array.isArray(payload.data)) setQuestions(payload.data);
      } catch {
        if (active) setError('Soal terbaru tidak dapat dimuat. Memakai data contoh yang tersimpan.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadQuestions();
    return () => {
      active = false;
    };
  }, [attempt?.tryoutId]);

  const reviewResult = useMemo(
    () => getAttemptReview(attempt, questions),
    [attempt, questions]
  );

  if (!attempt) {
    return (
      <section className={`page-content ${styles.screenStack}`}>
        <h1>Hasil tidak ditemukan</h1>
        <p>Attempt <strong>{attemptId}</strong> tidak tersedia di penyimpanan browser ini.</p>
        <Link className="button" href="/student/history">Buka riwayat tryout</Link>
      </section>
    );
  }

  if (user?.id && attempt.studentId !== user.id) {
    return (
      <section className={`page-content ${styles.screenStack}`}>
        <h1>Hasil tidak dapat dibuka</h1>
        <p>Attempt ini bukan milik akun yang sedang aktif.</p>
        <Link className="button" href="/student/history">Kembali ke riwayat</Link>
      </section>
    );
  }

  if (reviewResult.status === 'in_progress') {
    return (
      <section className={`page-content ${styles.screenStack}`}>
        <p className="eyebrow">TITIK TERAMPIL / P08 / HASIL</p>
        <h1>Ujian belum dikumpulkan</h1>
        <p>Pembahasan baru tersedia setelah seluruh jawaban dikumpulkan.</p>
        <div className={styles.actionRow}>
          <Link className="button" href={`/student/exams/${attempt.tryoutId}`}>Lanjutkan ujian</Link>
          <Link className="button secondary" href="/student/history">Riwayat tryout</Link>
        </div>
      </section>
    );
  }

  if (reviewResult.status !== 'success') {
    return (
      <section className={`page-content ${styles.screenStack}`}>
        <h1>Hasil tidak dapat dibaca</h1>
        <p>{reviewResult.message}</p>
        <Link className="button" href="/student/history">Kembali ke riwayat</Link>
      </section>
    );
  }

  const { review } = reviewResult;
  const filters = [
    { id: 'all', label: `Semua (${review.items.length})` },
    { id: 'correct', label: `Benar (${review.summary.correct})` },
    { id: 'wrong', label: `Salah (${review.summary.wrong})` },
    { id: 'empty', label: `Kosong (${review.summary.empty})` },
    { id: 'pending', label: `Esai (${review.summary.pendingEssay})` },
    { id: 'flagged', label: `Ragu-ragu (${review.items.filter((item) => item.flagged).length})` },
  ];
  const visibleItems = review.items.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'flagged') return item.flagged;
    return item.status === filter;
  });
  const submittedDate = new Date(review.submittedAt);
  const submittedLabel = Number.isFinite(submittedDate.getTime())
    ? submittedDate.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    : review.submittedAt;

  return (
    <section className={`page-content ${styles.screenStack}`}>
      <p className="eyebrow">TITIK TERAMPIL / P08 / HASIL & PEMBAHASAN</p>
      <Link href="/student/history">← Kembali ke riwayat</Link>
      <h1>{review.tryoutTitle}</h1>
      <p className="lead">
        Dikumpulkan {submittedLabel}
        {review.submitReason === 'timeout' ? ' · waktu ujian habis' : ''}.
      </p>

      {error && <p className={styles.warningText} role="status">{error}</p>}
      {loading && <p className={styles.helperText}>Memuat pembahasan terbaru…</p>}

      <div className={styles.scoreHero}>
        <div className={styles.scoreMain}>
          <small>Nilai objektif</small>
          <strong>{review.score === null ? '—' : review.score}</strong>
          <span className={styles.helperText}>
            {review.gradingStatus === 'pending' ? 'Esai belum dinilai pengajar' : 'Penilaian selesai'}
          </span>
        </div>
        <div className={styles.scoreStat}><small>Benar</small><strong>{review.summary.correct}</strong></div>
        <div className={styles.scoreStat}><small>Salah</small><strong>{review.summary.wrong}</strong></div>
        <div className={styles.scoreStat}><small>Kosong</small><strong>{review.summary.empty}</strong></div>
        <div className={styles.scoreStat}><small>Esai pending</small><strong>{review.summary.pendingEssay}</strong></div>
        <div className={styles.scoreStat}>
          <small>Durasi</small>
          <strong>
            {review.summary.durationSeconds === null
              ? '—'
              : `${Math.floor(review.summary.durationSeconds / 60)}m ${review.summary.durationSeconds % 60}s`}
          </strong>
        </div>
      </div>

      <div className={styles.reviewFilters} role="group" aria-label="Filter pembahasan">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.reviewFilter} ${filter === item.id ? styles.reviewFilterActive : ''}`}
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visibleItems.length === 0 ? (
        <div className={`panel ${styles.emptyState}`}>
          <h2>Tidak ada soal pada filter ini</h2>
          <p>Pilih filter lain untuk melihat pembahasan.</p>
        </div>
      ) : (
        <div className={styles.reviewList}>
          {visibleItems.map((item) => (
            <article className={styles.reviewCard} key={item.questionId}>
              <div className={styles.reviewCardHeader}>
                <div>
                  <span className={styles.questionType}>
                    Soal {item.number} · {TYPE_LABELS[item.type] ?? item.type}
                  </span>
                  {item.flagged && <span className={styles.helperText}> · ditandai ragu-ragu</span>}
                </div>
                <span className={`${styles.reviewStatus} ${styles[`review${item.status[0].toUpperCase()}${item.status.slice(1)}`]}`}>
                  {STATUS_LABELS[item.status] ?? item.status}
                </span>
              </div>

              <h2 className={styles.questionPrompt}>{item.prompt}</h2>

              {item.options.length > 0 && (item.type === 'single_choice' ||
                item.type === 'multiple_choice' || item.type === 'true_false') && (
                <ul className={styles.optionList}>
                  {item.options.map((option, index) => {
                    const selected = item.type === 'multiple_choice'
                      ? Array.isArray(item.answer) && item.answer.includes(index)
                      : item.answer === index;
                    const correct = item.type === 'multiple_choice'
                      ? Array.isArray(item.correctAnswer) && item.correctAnswer.includes(index)
                      : item.correctAnswer === index;
                    const classes = [
                      styles.optionLabel,
                      selected ? styles.optionSelected : '',
                      correct ? styles.reviewOptionCorrect : '',
                      selected && !correct ? styles.reviewOptionWrong : '',
                    ].filter(Boolean).join(' ');
                    return (
                      <li key={`${item.questionId}-${index}`}>
                        <div className={classes}>
                          <span aria-hidden="true">{String.fromCharCode(65 + index)}.</span>
                          <span>{option}</span>
                          {correct && <span className={styles.reviewOptionTag}>Kunci</span>}
                          {selected && <span className={styles.reviewOptionTag}>Jawaban Anda</span>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {(item.type === 'short_answer' || item.type === 'essay') && (
                <>
                  <div className={styles.answerBox}>
                    <small>Jawaban Anda</small>
                    {answerText(item.answer, item.options, item.type)}
                  </div>
                  {item.type === 'short_answer' && (
                    <div className={styles.answerBox}>
                      <small>Kunci jawaban</small>
                      {answerText(item.correctAnswer, item.options, item.type)}
                    </div>
                  )}
                  {item.type === 'essay' && (
                    <div className={styles.answerBox}>
                      <small>Status penilaian</small>
                      Menunggu koreksi pengajar{item.rubric ? ` · Rubrik: ${item.rubric}` : ''}
                    </div>
                  )}
                </>
              )}

              {item.explanation && (
                <div className={styles.explanationBox}>
                  <strong>Pembahasan: </strong>{item.explanation}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <div className={styles.actionRow}>
        <Link className="button" href={`/student/exams/${attempt.tryoutId}/instructions`}>
          Ulangi tryout
        </Link>
        <Link className="button secondary" href="/student/history">Riwayat tryout</Link>
        <Link className="button secondary" href="/student/tryouts">Katalog paket</Link>
      </div>
    </section>
  );
}
