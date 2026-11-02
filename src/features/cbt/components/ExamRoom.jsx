'use client';

/**
 * Modul: Ruang ujian CBT (P07)
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: timer berbasis deadline, lima tipe soal, autosave, navigasi, dan submit idempoten.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/src/components/DemoProvider';
import { questions as fallbackQuestions, tryouts as fallbackTryouts } from '@/src/data/mock';
import {
  computeRemainingMs,
  formatClock,
  isAnswerEmpty,
  saveAnswer,
  submitAttempt,
  toggleFlag,
} from '../actions';
import { findActiveAttempt, getAttempt, saveAttempt } from '../attempt-store';
import { QuestionRenderer } from './QuestionRenderer';
import styles from '../cbt.module.css';

/**
 * Menampilkan ruang ujian aktif untuk paket pada URL.
 * @param {Object} props - Properti komponen.
 * @param {string} props.tryoutId - ID paket dari route.
 * @returns {React.ReactElement} Ruang ujian CBT.
 */
export function ExamRoom({ tryoutId }) {
  const router = useRouter();
  const { user } = useDemo();
  const initialTryout = fallbackTryouts.find((item) => item.id === tryoutId) ?? null;
  const initialQuestions = fallbackQuestions.filter((item) => item.tryoutId === tryoutId);

  const [attempt, setAttempt] = useState(() => (
    user?.id ? findActiveAttempt(user.id, tryoutId) : null
  ));
  const attemptRef = useRef(attempt);
  const [tryout, setTryout] = useState(initialTryout);
  const [questions, setQuestions] = useState(initialQuestions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveState, setSaveState] = useState('saved');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const saveTimerRef = useRef(null);
  const autoSubmitRef = useRef(false);
  const dialogRef = useRef(null);

  /**
   * Memperbarui state dan ref attempt agar autosave selalu memakai data terbaru.
   * @param {Object} next - Attempt baru.
   * @returns {void}
   */
  function applyAttempt(next) {
    attemptRef.current = next;
    setAttempt(next);
  }

  /**
   * Menyimpan attempt ke storage dan memperbarui indikator simpan.
   * @param {Object} value - Attempt yang disimpan.
   * @param {boolean} [immediate=false] - Lewati jeda debounce.
   * @returns {void}
   */
  function persistAttempt(value, immediate = false) {
    if (!value) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveState('saving');
    const write = () => {
      const saved = saveAttempt(attemptRef.current);
      setSaveState(saved ? 'saved' : 'error');
      if (!saved) setError('Jawaban gagal disimpan ke browser. Periksa ruang penyimpanan.');
    };
    if (immediate) write();
    else saveTimerRef.current = setTimeout(write, 650);
  }

  // 1. Muat detail paket dan soal, lalu sinkronkan attempt terbaru.
  useEffect(() => {
    let active = true;
    async function loadExam() {
      setLoading(true);
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
    loadExam();
    return () => {
      active = false;
    };
  }, [tryoutId]);

  // 2. Timer hanya membaca deadline; interval tidak mengurangi durasi tersimpan.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 4. Simpan attempt terakhir saat halaman ditinggalkan atau komponen dilepas.
  useEffect(() => {
    function flush() {
      if (attemptRef.current && !attemptRef.current.submittedAt) {
        saveAttempt(attemptRef.current);
      }
    }
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      flush();
    };
  }, []);

  const remainingMs = attempt ? computeRemainingMs(attempt.deadline, now) : 0;
  const expired = Boolean(attempt) && remainingMs <= 0;

  /**
   * Mengumpulkan attempt sekali lalu membuka halaman hasil.
   * @param {string} [reason='manual'] - Alasan pengumpulan.
   * @returns {void}
   */
  const submitNow = useCallback((reason = 'manual') => {
    const current = attemptRef.current;
    if (!current || current.submittedAt) return;
    const result = submitAttempt(current, questions, { reason });
    if (result.status !== 'success') {
      if (result.code === 'already_submitted') {
        const stored = getAttempt(current.id);
        if (stored?.submittedAt) router.push(`/student/results/${stored.id}`);
        return;
      }
      setError(result.message ?? 'Percobaan gagal dikumpulkan.');
      return;
    }
    if (!saveAttempt(result.attempt)) {
      setError('Hasil gagal disimpan ke browser. Jangan tutup halaman sebelum mencoba lagi.');
      return;
    }
    attemptRef.current = result.attempt;
    setAttempt(result.attempt);
    setSaveState('saved');
    router.push(`/student/results/${result.attempt.id}`);
  }, [questions, router]);

  // 5. Kumpulkan otomatis saat deadline habis.
  useEffect(() => {
    if (!attempt || attempt.submittedAt || remainingMs > 0 || autoSubmitRef.current) return;
    autoSubmitRef.current = true;
    submitNow('timeout');
  }, [attempt, remainingMs, submitNow]);

  // 5. Arahkan ke halaman yang sesuai ketika attempt tidak ada atau sudah selesai.
  useEffect(() => {
    if (!user?.id) return;
    if (attempt?.submittedAt) {
      router.replace(`/student/results/${attempt.id}`);
      return;
    }
    if (!attempt && !loading) {
      router.replace(`/student/exams/${tryoutId}/instructions`);
    }
  }, [attempt, loading, router, tryoutId, user?.id]);

  /**
   * Menyimpan jawaban soal aktif.
   * @param {unknown} value - Jawaban baru.
   * @returns {void}
   */
  function handleAnswer(value) {
    const currentQuestion = questions[currentIndex];
    if (!attempt || !currentQuestion) return;
    const result = saveAnswer(attempt, currentQuestion, value);
    if (result.status !== 'success') {
      setError(result.message ?? 'Jawaban tidak valid.');
      return;
    }
    setError('');
    applyAttempt(result.attempt);
    persistAttempt(result.attempt);
  }

  /**
   * Menambah atau menghapus penanda ragu-ragu.
   * @returns {void}
   */
  function handleFlag() {
    const currentQuestion = questions[currentIndex];
    if (!attempt || !currentQuestion) return;
    const result = toggleFlag(attempt, currentQuestion.id);
    if (result.status !== 'success') {
      setError(result.message ?? 'Penanda gagal diubah.');
      return;
    }
    applyAttempt(result.attempt);
    persistAttempt(result.attempt, true);
  }

  /**
   * Menyimpan attempt secara manual.
   * @returns {void}
   */
  function handleManualSave() {
    if (!attemptRef.current) return;
    persistAttempt(attemptRef.current, true);
  }

  /**
   * Membuka dialog konfirmasi pengumpulan.
   * @returns {void}
   */
  function openSubmitDialog() {
    if (dialogRef.current?.showModal) dialogRef.current.showModal();
  }

  /**
   * Menutup dialog konfirmasi.
   * @returns {void}
   */
  function closeSubmitDialog() {
    dialogRef.current?.close();
  }

  /**
   * Mengumpulkan attempt setelah konfirmasi dialog.
   * @returns {void}
   */
  function confirmSubmit() {
    closeSubmitDialog();
    submitNow('manual');
  }

  if (!attempt) {
    return (
      <section className={`page-content ${styles.screenStack}`}>
        <p className="eyebrow">TITIK TERAMPIL / RUANG UJIAN</p>
        <h1>{loading ? 'Memuat ruang ujian…' : 'Attempt tidak ditemukan'}</h1>
        <p>Kembali ke petunjuk ujian untuk memulai percobaan baru.</p>
        <Link className="button" href={`/student/exams/${tryoutId}/instructions`}>
          Buka petunjuk ujian
        </Link>
      </section>
    );
  }

  if (questions.length === 0) {
    return (
      <section className={`page-content ${styles.screenStack}`}>
        <p className="eyebrow">TITIK TERAMPIL / RUANG UJIAN</p>
        <h1>Bank soal belum tersedia</h1>
        <p>Paket <strong>{tryout?.title ?? tryoutId}</strong> belum memiliki soal pada data demo.</p>
        <Link className="button" href="/student/tryouts">Kembali ke katalog</Link>
      </section>
    );
  }

  const answers = attempt.answers ?? {};
  const currentQuestion = questions[currentIndex] ?? questions[0];
  const answeredCount = questions.filter((question) => !isAnswerEmpty(answers[question.id])).length;
  const flags = Array.isArray(attempt.flaggedQuestionIds) ? attempt.flaggedQuestionIds : [];
  const flaggedCount = flags.length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);
  const isFlagged = flags.includes(currentQuestion.id);
  const timerTone = remainingMs <= 60 * 1000
    ? styles.timerDanger
    : remainingMs <= 5 * 60 * 1000 ? styles.timerWarning : '';

  return (
    <section className={`page-content ${styles.screenStack}`}>
      <header className={styles.pageHeader}>
        <div>
          <p className="eyebrow">TITIK TERAMPIL / P07 / RUANG UJIAN CBT</p>
          <h1>{tryout?.title ?? attempt.tryoutTitle}</h1>
          <p className="lead">
            {tryout?.subject ?? attempt.tryoutSubject} · {questions.length} soal · jawaban tersimpan otomatis.
          </p>
        </div>
        <Link className="button secondary" href="/student/history" onClick={handleManualSave}>
          Simpan & keluar
        </Link>
      </header>

      {error && <p className={styles.warningText} role="status">{error}</p>}

      <div className={styles.examShell}>
        <div className={styles.examMain}>
          <div className={styles.examToolbar}>
            <span className={styles.examProgress}>
              Soal {currentIndex + 1} dari {questions.length} · terjawab {answeredCount} · ragu-ragu {flaggedCount}
            </span>
            <div className={styles.examFooterGroup}>
              <button
                type="button"
                className="secondary"
                onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
                disabled={currentIndex === 0}
              >
                ← Sebelumnya
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))}
                disabled={currentIndex >= questions.length - 1}
              >
                Berikutnya →
              </button>
            </div>
          </div>

          <QuestionRenderer
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={handleAnswer}
            disabled={expired || Boolean(attempt.submittedAt)}
          />

          <div className={styles.examFooter}>
            <button
              type="button"
              className={isFlagged ? styles.flagActive : 'secondary'}
              onClick={handleFlag}
              aria-pressed={isFlagged}
            >
              {isFlagged ? 'Hapus penanda' : 'Tandai ragu-ragu'}
            </button>
            <div className={styles.examFooterGroup}>
              <button type="button" className="secondary" onClick={handleManualSave}>
                Simpan jawaban
              </button>
              <button type="button" onClick={openSubmitDialog} disabled={expired}>
                Kumpulkan ujian
              </button>
            </div>
          </div>
        </div>

        <aside className={styles.examSidebar} aria-label="Panel ujian">
          <div className={styles.timerCard}>
            <small>Sisa waktu</small>
            <span
              className={`${styles.timerValue} ${timerTone}`}
              role="timer"
              aria-label={`Sisa waktu ${formatClock(remainingMs)}`}
              aria-live="off"
            >
              {formatClock(remainingMs)}
            </span>
            <span className={styles.timerHint}>
              {expired ? 'Waktu habis. Jawaban dikumpulkan otomatis.' : 'Batas waktu tersimpan pada attempt.'}
            </span>
            <div className={`${styles.saveStatus} ${saveState === 'error' ? styles.saveError : ''}`} aria-live="polite">
              {saveState === 'saving' && 'Menyimpan jawaban…'}
              {saveState === 'saved' && 'Semua perubahan tersimpan.'}
              {saveState === 'error' && 'Gagal menyimpan. Coba tombol simpan.'}
            </div>
          </div>

          <div className={styles.questionNavPanel}>
            <h2>Navigasi soal</h2>
            <div className={styles.questionGrid}>
              {questions.map((question, index) => {
                const answered = !isAnswerEmpty(answers[question.id]);
                const flagged = flags.includes(question.id);
                const classes = [
                  styles.questionNavButton,
                  answered ? styles.questionAnswered : '',
                  flagged ? styles.questionFlagged : '',
                  index === currentIndex ? styles.questionCurrent : '',
                ].filter(Boolean).join(' ');
                return (
                  <button
                    key={question.id}
                    type="button"
                    className={classes}
                    onClick={() => setCurrentIndex(index)}
                    aria-current={index === currentIndex ? 'true' : undefined}
                    aria-label={`Soal ${index + 1}${answered ? ', terjawab' : ', belum terjawab'}${flagged ? ', ditandai' : ''}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div className={styles.questionLegend}>
              <span><i className={`${styles.legendDot} ${styles.legendAnswered}`} aria-hidden="true" />Terjawab</span>
              <span><i className={`${styles.legendDot} ${styles.legendFlagged}`} aria-hidden="true" />Ragu-ragu</span>
              <span><i className={`${styles.legendDot} ${styles.legendCurrent}`} aria-hidden="true" />Aktif</span>
            </div>
          </div>
        </aside>
      </div>

      <dialog className={styles.dialog} ref={dialogRef}>
        <div className={styles.dialogInner}>
          <h2>Kumpulkan ujian?</h2>
          <p>Setelah dikumpulkan, jawaban tidak dapat diubah lagi.</p>
          <ul className={styles.summaryList}>
            <li>Terjawab: <strong>{answeredCount}</strong> dari {questions.length}</li>
            <li>Belum terjawab: <strong>{unansweredCount}</strong></li>
            <li>Ditandai ragu-ragu: <strong>{flaggedCount}</strong></li>
            <li>Sisa waktu: <strong>{formatClock(remainingMs)}</strong></li>
          </ul>
          <div className={styles.dialogActions}>
            <button type="button" className="secondary" onClick={closeSubmitDialog}>Periksa lagi</button>
            <button type="button" onClick={confirmSubmit}>Ya, kumpulkan</button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
