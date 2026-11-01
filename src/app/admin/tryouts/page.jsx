'use client';

import { useMemo, useState } from 'react';
import { tryouts as initialTryouts, questions } from '@/src/data/mock';
import { saveTryoutPackage } from '@/src/features/tryout-management/actions';

const createEmptyForm = () => ({
  title: '',
  level: 'SMA',
  grade: 12,
  subject: '',
  durationMinutes: 30,
});

export default function TryoutsPage() {
  const [tryouts, setTryouts] = useState(initialTryouts);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(createEmptyForm);
  const [error, setError] = useState('');

  const filteredTryouts = useMemo(
    () =>
      tryouts.filter((test) => {
        const keyword = search.toLowerCase();

        const matchesSearch =
          test.title.toLowerCase().includes(keyword) ||
          test.subject.toLowerCase().includes(keyword);

        const matchesLevel =
          levelFilter === 'all' || test.level === levelFilter;

        return matchesSearch && matchesLevel;
      }),
    [tryouts, search, levelFilter]
  );

  function openCreateForm() {
    setEditingId(null);
    setForm(createEmptyForm());
    setError('');
    setShowForm(true);
  }

  function openEditForm(test) {
    setEditingId(test.id);
    setForm({ ...test });
    setError('');
    setShowForm(true);
  }

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();
    const subject = form.subject.trim();
    const grade = Number(form.grade);
    const durationMinutes = Number(form.durationMinutes);

    if (!title || !subject) {
      setError('Nama paket dan mata pelajaran wajib diisi.');
      return;
    }

    const validLevels = ['SD', 'SMP', 'SMA'];

    if (!validLevels.includes(form.level)) {
      setError('Pilih jenjang pendidikan yang valid.');
      return;
    }

    if (
      !Number.isInteger(grade) ||
      (form.level === 'SD' && (grade < 1 || grade > 6)) ||
      (form.level === 'SMP' && (grade < 7 || grade > 9)) ||
      (form.level === 'SMA' && (grade < 10 || grade > 12))
    ) {
      setError('Tingkat kelas tidak sesuai dengan jenjang pendidikan.');
      return;
    }

    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      setError('Durasi harus berupa bilangan bulat lebih dari 0.');
      return;
    }

    const tryoutData = {
      id: editingId ?? `tryout-${Date.now()}`,
      title,
      level: form.level,
      grade,
      subject,
      durationMinutes,
    };

    // Validasi paket menggunakan actions.js.
    const result = saveTryoutPackage(tryoutData);

    if (result.status !== 'success') {
      setError(result.message ?? 'Data paket tryout tidak valid.');
      return;
    }

    const candidate = result.data;

    // Update atau tambahkan paket ke state.
    if (editingId) {
      setTryouts((current) =>
        current.map((test) =>
          test.id === editingId ? candidate : test
        )
      );
    } else {
      setTryouts((current) => [...current, candidate]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(createEmptyForm());
    setError('');
  }

  function handleDelete(test) {
    const hasQuestions = questions.some(
      (question) => question.tryoutId === test.id
    );

    if (hasQuestions) {
      setError(
        'Paket ini masih memiliki soal terkait. Penghapusan dibatalkan.'
      );
      return;
    }

    setTryouts((current) =>
      current.filter((item) => item.id !== test.id)
    );

    setError('');
  }

  return (
    <main className="page-content tryouts-page">
      <header className="tryouts-header">
        <div>
          <h1>Paket Tryout</h1>
          <p className="lead">
            Kelola paket tryout berdasarkan jenjang dan mata pelajaran.
          </p>
        </div>

        <button
          type="button"
          className="tryouts-add-button"
          onClick={openCreateForm}
        >
          + Tambah Paket
        </button>
      </header>

      <section className="tryouts-toolbar">
        <input
          className="tryouts-search"
          type="search"
          placeholder="Cari nama paket atau mata pelajaran..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Cari paket tryout"
        />

        <select
          className="tryouts-filter"
          value={levelFilter}
          onChange={(event) => setLevelFilter(event.target.value)}
          aria-label="Filter jenjang"
        >
          <option value="all">Semua jenjang</option>
          <option value="SD">SD</option>
          <option value="SMP">SMP</option>
          <option value="SMA">SMA</option>
        </select>
      </section>

      {error && (
        <p className="tryouts-error" role="alert">
          {error}
        </p>
      )}

      {showForm && (
        <form className="tryout-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit Paket Tryout' : 'Tambah Paket Tryout'}</h2>

          <label className="tryout-field">
            Nama paket
            <input
              type="text"
              value={form.title}
              onChange={(event) => updateForm('title', event.target.value)}
              placeholder="Contoh: Tryout Matematika SMA"
              required
            />
          </label>

          <label className="tryout-field">
            Jenjang pendidikan
            <select
              value={form.level}
              onChange={(event) => {
                const level = event.target.value;
                const defaultGrade = { SD: 6, SMP: 9, SMA: 12 };

                setForm((current) => ({
                  ...current,
                  level,
                  grade: defaultGrade[level],
                }));
              }}
            >
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
            </select>
          </label>

          <label className="tryout-field">
            Tingkat kelas
            <select
              value={form.grade}
              onChange={(event) =>
                updateForm('grade', event.target.value)
              }
            >
              {(form.level === 'SD'
                ? [1, 2, 3, 4, 5, 6]
                : form.level === 'SMP'
                  ? [7, 8, 9]
                  : [10, 11, 12]
              ).map((grade) => (
                <option key={grade} value={grade}>
                  Kelas {grade}
                </option>
              ))}
            </select>
          </label>

          <label className="tryout-field">
            Mata pelajaran
            <input
              type="text"
              value={form.subject}
              onChange={(event) => updateForm('subject', event.target.value)}
              placeholder="Contoh: Matematika"
              required
            />
          </label>

          <label className="tryout-field">
            Durasi pengerjaan (menit)
            <input
              type="number"
              min="1"
              step="1"
              value={form.durationMinutes}
              onChange={(event) =>
                updateForm('durationMinutes', event.target.value)
              }
              required
            />
          </label>

          <div className="tryout-form-actions">
            <button type="submit">Simpan Paket</button>

            <button
              type="button"
              className="tryout-cancel-button"
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

      <p className="tryouts-count">
        Menampilkan {filteredTryouts.length} dari {tryouts.length} paket
      </p>

      <div className="tryouts-table-wrapper">
        <table className="tryouts-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama Paket</th>
              <th>Jenjang</th>
              <th>Mata Pelajaran</th>
              <th>Durasi</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredTryouts.map((test, index) => (
              <tr key={test.id}>
                <td>{index + 1}</td>

                <td>
                  <div className="tryout-title">
                    <strong>{test.title}</strong>
                    <small>Kelas {test.grade}</small>
                  </div>
                </td>

                <td>
                  <span className="tryout-level">{test.level}</span>
                </td>

                <td>{test.subject}</td>
                <td>{test.durationMinutes} menit</td>

                <td>
                  <div className="tryout-actions">
                    <button
                      type="button"
                      onClick={() => openEditForm(test)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(test)}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredTryouts.length === 0 && (
              <tr>
                <td className="tryouts-empty" colSpan={6}>
                  Tidak ada paket yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}