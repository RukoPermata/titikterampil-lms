
'use client';

import { useMemo, useState } from 'react';
import { questions as initialQuestions, tryouts } from '@/src/data/mock';
import { saveQuestion } from '@/src/features/tryout-management/actions';

const createEmptyForm = () => ({
  prompt: '',
  tryoutId: tryouts[0]?.id ?? '',
  options: ['', '', '', ''],
  correctIndex: 0,
  weight: 1,
  explanation: '',
});

export default function QuestionsPage() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [search, setSearch] = useState('');
  const [tryoutFilter, setTryoutFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(createEmptyForm);
  const [error, setError] = useState('');

  const filteredQuestions = useMemo(
    () =>
      questions.filter((question) => {
        const matchesSearch = question.prompt
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesTryout =
          tryoutFilter === 'all' ||
          question.tryoutId === tryoutFilter;

        return matchesSearch && matchesTryout;
      }),
    [questions, search, tryoutFilter]
  );

  function openCreateForm() {
    setEditingId(null);
    setForm(createEmptyForm());
    setError('');
    setShowForm(true);
  }

  function openEditForm(question) {
    setEditingId(question.id);
    setForm({ ...question, options: [...question.options] });
    setError('');
    setShowForm(true);
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateOption(index, value) {
    setForm((current) => ({
      ...current,
      options: current.options.map((option, i) =>
        i === index ? value : option
      ),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Validasi hubungan soal dengan paket tryout.
    if (
      !form.tryoutId ||
      !tryouts.some((test) => test.id === form.tryoutId)
    ) {
      setError('Pilih paket tryout yang valid.');
      return;
    }

    // Siapkan data dari form.
    const questionData = {
      ...form,
      id: editingId ?? `question-${Date.now()}`,
      prompt: form.prompt.trim(),
      options: form.options,
      correctIndex: Number(form.correctIndex),
      weight: Number(form.weight),
      explanation: form.explanation.trim(),
    };

    // Validasi soal melalui actions.js.
    const result = saveQuestion(questionData);

    if (result.status !== 'success') {
      setError(result.message ?? 'Soal tidak valid.');
      return;
    }

    // Tambahkan atau perbarui soal setelah validasi berhasil.
    const candidate = {
      ...result.data,
      tryoutId: form.tryoutId,
    };

    if (editingId) {
      setQuestions((current) =>
        current.map((question) =>
          question.id === editingId ? candidate : question
        )
      );
    } else {
      setQuestions((current) => [...current, candidate]);
    }

    // Tutup form dan bersihkan input.
    setShowForm(false);
    setEditingId(null);
    setForm(createEmptyForm());
    setError('');
  }

  function handleDelete(question) {
    const usedByTryout = tryouts.some(
      (test) => test.id === question.tryoutId
    );

    if (usedByTryout) {
      setError(
        'Soal terhubung dengan paket tryout. Penghapusan dibatalkan.'
      );
      return;
    }

    setQuestions((current) =>
      current.filter((item) => item.id !== question.id)
    );
    setError('');
  }

  return (
    <main className="page-content questions-page">
      <header className="questions-header">
        <div>
          <h1>Bank Soal</h1>
          <p className="lead">
            Kelola soal pilihan ganda untuk paket tryout.
          </p>
        </div>

        <button
          type="button"
          className="questions-add-button"
          onClick={openCreateForm}
        >
          + Tambah Soal
        </button>
      </header>

      <section className="questions-toolbar">
        <input
          className="questions-search"
          type="search"
          placeholder="Cari teks soal..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Cari soal"
        />

        <select
          className="questions-filter"
          value={tryoutFilter}
          onChange={(event) => setTryoutFilter(event.target.value)}
          aria-label="Filter paket tryout"
        >
          <option value="all">Semua paket</option>
          {tryouts.map((test) => (
            <option key={test.id} value={test.id}>
              {test.title}
            </option>
          ))}
        </select>
      </section>

      {error && (
        <p className="questions-error" role="alert">
          {error}
        </p>
      )}

      {showForm && (
        <form className="question-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit Soal' : 'Tambah Soal'}</h2>

          <label className="question-field">
            Paket tryout
            <select
              value={form.tryoutId}
              onChange={(event) =>
                updateForm('tryoutId', event.target.value)
              }
            >
              <option value="">Pilih paket</option>
              {tryouts.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.title}
                </option>
              ))}
            </select>
          </label>

          <label className="question-field">
            Teks soal
            <textarea
              value={form.prompt}
              onChange={(event) => updateForm('prompt', event.target.value)}
              placeholder="Masukkan pertanyaan..."
              required
            />
          </label>

          <fieldset className="question-options">
            <legend>Pilihan jawaban dan kunci</legend>

            {form.options.map((option, index) => (
              <div className="question-option" key={index}>
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={Number(form.correctIndex) === index}
                  onChange={() => updateForm('correctIndex', index)}
                  aria-label={`Jadikan opsi ${index + 1} sebagai kunci`}
                />

                <input
                  value={option}
                  onChange={(event) =>
                    updateOption(index, event.target.value)
                  }
                  placeholder={`Opsi ${index + 1}`}
                  required
                />
              </div>
            ))}
          </fieldset>

          <label className="question-field">
            Bobot nilai
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={form.weight}
              onChange={(event) => updateForm('weight', event.target.value)}
              required
            />
          </label>

          <label className="question-field">
            Pembahasan
            <textarea
              value={form.explanation}
              onChange={(event) =>
                updateForm('explanation', event.target.value)
              }
              placeholder="Jelaskan jawaban yang benar..."
            />
          </label>

          <div className="question-form-actions">
            <button type="submit">Simpan Soal</button>
            <button
              type="button"
              className="question-cancel-button"
              onClick={() => {
                setShowForm(false);
                setError('');
              }}
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <p className="questions-count">
        Menampilkan {filteredQuestions.length} dari {questions.length} soal
      </p>

      <div className="questions-table-wrapper">
        <table className="questions-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Soal</th>
              <th>Paket</th>
              <th>Bobot</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredQuestions.map((question, index) => {
              const test = tryouts.find(
                (item) => item.id === question.tryoutId
              );

              return (
                <tr key={question.id}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="question-prompt">
                      <strong>{question.prompt}</strong>

                      <div className="question-options-preview">
                        {question.options.map((option, optionIndex) => (
                          <span key={optionIndex}>
                            {String.fromCharCode(65 + optionIndex)}. {option}
                            {optionIndex < question.options.length - 1
                              ? ' · '
                              : ''}
                          </span>
                        ))}
                      </div>

                      <small className="question-key">
                        Kunci: {question.options[question.correctIndex] ?? '-'}
                      </small>
                    </div>
                  </td>

                  <td>{test?.title ?? 'Paket tidak ditemukan'}</td>
                  <td>{question.weight}</td>

                  <td>
                    <div className="question-actions">
                      <button
                        type="button"
                        onClick={() => openEditForm(question)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(question)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredQuestions.length === 0 && (
              <tr>
                <td className="questions-empty" colSpan={5}>
                  Tidak ada soal yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
