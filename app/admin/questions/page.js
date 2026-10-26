
'use client';

import { useMemo, useState } from 'react';
import { questions as initialQuestions, tryouts } from '@/src/data/mock';

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

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch = question.prompt
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesTryout =
        tryoutFilter === 'all' ||
        question.tryoutId === tryoutFilter;

      return matchesSearch && matchesTryout;
    });
  }, [questions, search, tryoutFilter]);

  function openCreateForm() {
    setEditingId(null);
    setForm(createEmptyForm());
    setError('');
    setShowForm(true);
  }

  function openEditForm(question) {
    setEditingId(question.id);
    setForm({
      ...question,
      options: [...question.options],
    });
    setError('');
    setShowForm(true);
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

    if (!form.prompt.trim()) {
      setError('Teks soal wajib diisi.');
      return;
    }

    const validOptions = form.options.filter(
      (option) => option.trim() !== ''
    );

    if (
      validOptions.length < 2 ||
      validOptions.length !== form.options.length
    ) {
      setError('Isi semua pilihan jawaban, minimal dua opsi.');
      return;
    }

    if (
      !Number.isInteger(Number(form.correctIndex)) ||
      Number(form.correctIndex) < 0 ||
      Number(form.correctIndex) >= form.options.length
    ) {
      setError('Pilih kunci jawaban yang valid.');
      return;
    }

    if (!Number.isFinite(Number(form.weight)) || Number(form.weight) <= 0) {
      setError('Bobot harus lebih besar dari 0.');
      return;
    }

    if (!form.tryoutId) {
      setError('Pilih paket tryout.');
      return;
    }

    const candidate = {
      ...form,
      id: editingId ?? `question-${Date.now()}`,
      correctIndex: Number(form.correctIndex),
      weight: Number(form.weight),
      prompt: form.prompt.trim(),
      options: form.options.map((option) => option.trim()),
      explanation: form.explanation.trim(),
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

    setShowForm(false);
    setEditingId(null);
    setForm(createEmptyForm());
    setError('');
  }

  function handleDelete(question) {
    const usedByTryout = questions.some(
      (item) =>
        item.id === question.id &&
        tryouts.some((test) => test.id === item.tryoutId)
    );

    if (usedByTryout) {
      setError(
        'Soal masih memiliki referensi paket tryout demo. Penghapusan dibatalkan.'
      );
      return;
    }

    setQuestions((current) =>
      current.filter((item) => item.id !== question.id)
    );
    setError('');
  }

  return (
    <main style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1>Bank Soal</h1>
          <p>Kelola soal pilihan ganda untuk paket tryout.</p>
        </div>

        <button type="button" onClick={openCreateForm}>
          + Tambah Soal
        </button>
      </header>

      <section
        style={{
          display: 'flex',
          gap: '12px',
          margin: '24px 0',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="search"
          placeholder="Cari teks soal..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Cari soal"
        />

        <select
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
        <p role="alert" style={{ color: 'crimson' }}>
          {error}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px',
            display: 'grid',
            gap: '12px',
          }}
        >
          <h2>{editingId ? 'Edit Soal' : 'Tambah Soal'}</h2>

          <label>
            Paket tryout
            <select
              value={form.tryoutId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  tryoutId: event.target.value,
                }))
              }
            >
              {tryouts.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Teks soal
            <textarea
              value={form.prompt}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  prompt: event.target.value,
                }))
              }
              required
            />
          </label>

          <fieldset>
            <legend>Pilihan jawaban dan kunci</legend>

            {form.options.map((option, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={Number(form.correctIndex) === index}
                  onChange={() =>
                    setForm((current) => ({
                      ...current,
                      correctIndex: index,
                    }))
                  }
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

          <label>
            Bobot nilai
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={form.weight}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  weight: event.target.value,
                }))
              }
              required
            />
          </label>

          <label>
            Pembahasan
            <textarea
              value={form.explanation}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  explanation: event.target.value,
                }))
              }
            />
          </label>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit">Simpan Soal</button>
            <button
              type="button"
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

      <p>
        Menampilkan {filteredQuestions.length} dari {questions.length} soal
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: '12px', borderBottom: '1px solid #ccc' }}>
                No.
              </th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ccc' }}>
                Soal
              </th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ccc' }}>
                Paket
              </th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ccc' }}>
                Bobot
              </th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ccc' }}>
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredQuestions.map((question, index) => {
              const test = tryouts.find(
                (item) => item.id === question.tryoutId
              );

              return (
                <tr key={question.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    <strong>{question.prompt}</strong>
                    <div style={{ marginTop: '6px' }}>
                      {question.options.map((option, optionIndex) => (
                        <span key={optionIndex}>
                          {String.fromCharCode(65 + optionIndex)}. {option}
                          {optionIndex < question.options.length - 1
                            ? ' · '
                            : ''}
                        </span>
                      ))}
                    </div>
                    <small>
                      Kunci:{' '}
                      {question.options[question.correctIndex] ?? '-'}
                    </small>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    {test?.title ?? 'Paket tidak ditemukan'}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    {question.weight}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    <button
                      type="button"
                      onClick={() => openEditForm(question)}
                    >
                      Edit
                    </button>{' '}
                    <button
                      type="button"
                      onClick={() => handleDelete(question)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredQuestions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '20px' }}>
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
