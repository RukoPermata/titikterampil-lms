'use client';

/**
 * Modul: Renderer lima tipe soal CBT
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menampilkan kontrol jawaban sesuai tipe soal tanpa membocorkan kunci.
 */
import styles from '../cbt.module.css';

const TYPE_LABELS = {
  single_choice: 'Pilihan tunggal',
  multiple_choice: 'Pilihan jamak',
  true_false: 'Benar / salah',
  short_answer: 'Isian singkat',
  essay: 'Esai',
};

/**
 * Menampilkan satu soal beserta kontrol jawabannya.
 * @param {Object} props - Properti komponen.
 * @param {Object} props.question - Soal yang ditampilkan.
 * @param {unknown} props.value - Jawaban saat ini.
 * @param {Function} props.onChange - Callback perubahan jawaban.
 * @param {boolean} [props.disabled=false] - Menonaktifkan kontrol setelah submit.
 * @returns {React.ReactElement} Kartu soal.
 */
export function QuestionRenderer({ question, value, onChange, disabled = false }) {
  const options = Array.isArray(question.options) ? question.options : [];
  const typeLabel = TYPE_LABELS[question.type] ?? question.type;

  /**
   * Mengubah pilihan jawaban jamak tanpa mengubah array asal.
   * @param {number} index - Indeks opsi.
   * @param {boolean} checked - Status checkbox.
   * @returns {void}
   */
  function handleMultipleChange(index, checked) {
    const current = Array.isArray(value) ? value : [];
    const next = checked
      ? [...new Set([...current, index])]
      : current.filter((item) => item !== index);
    onChange(next);
  }

  return (
    <article className={styles.questionCard}>
      <div className={styles.questionMeta}>
        <span className={styles.questionType}>{typeLabel}</span>
        <span className="muted">
          Bobot {question.type === 'essay' ? `${question.maxScore ?? 0} poin` : question.weight ?? 1}
        </span>
      </div>
      <h2 className={styles.questionPrompt}>{question.prompt}</h2>

      {(question.type === 'single_choice' || question.type === 'true_false') && (
        <ul className={styles.optionList}>
          {options.map((option, index) => (
            <li key={`${question.id}-${index}`}>
              <label className={`${styles.optionLabel} ${value === index ? styles.optionSelected : ''}`}>
                <input
                  type="radio"
                  name={`answer-${question.id}`}
                  checked={value === index}
                  onChange={() => onChange(index)}
                  disabled={disabled}
                />
                <span>{option}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {question.type === 'multiple_choice' && (
        <ul className={styles.optionList}>
          {options.map((option, index) => {
            const checked = Array.isArray(value) && value.includes(index);
            return (
              <li key={`${question.id}-${index}`}>
                <label className={`${styles.optionLabel} ${checked ? styles.optionSelected : ''}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => handleMultipleChange(index, event.target.checked)}
                    disabled={disabled}
                  />
                  <span>{option}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {question.type === 'short_answer' && (
        <div>
          <input
            className={styles.textAnswer}
            type="text"
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Tulis jawaban singkat"
            disabled={disabled}
            aria-label="Jawaban isian singkat"
          />
          <span className={styles.answerCount}>
            {(typeof value === 'string' ? value : '').length}/500 karakter
          </span>
        </div>
      )}

      {question.type === 'essay' && (
        <div>
          <textarea
            className={styles.textAnswer}
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Tulis jawaban esai secara terstruktur"
            disabled={disabled}
            aria-label="Jawaban esai"
          />
          <span className={styles.answerCount}>
            {(typeof value === 'string' ? value : '').length} karakter
          </span>
        </div>
      )}

      {!TYPE_LABELS[question.type] && (
        <p className={styles.warningText}>Tipe soal tidak dikenali pada data demo.</p>
      )}
    </article>
  );
}
