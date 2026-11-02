
'use client';

import { useMemo, useState } from 'react';
import { tryouts as initialTryouts, questions } from '@/src/data/mock';
import { saveTryoutPackage } from '@/src/features/tryout-management/actions';

const STATUSES = [
  { value: 'draft', label: 'Draf' },
  { value: 'published', label: 'Terbit' },
  { value: 'archived', label: 'Arsip' },
];

const LEVELS = ['SD', 'SMP', 'SMA', 'Umum'];

const createEmptyForm = () => ({
  title: '',
  level: 'SMA',
  grade: 12,
  subject: '',
  category: 'FOKUS TKA',
  durationMinutes: 30,
  price: 0,
  isFree: false,
  status: 'draft',
});

function getStatus(test) {
  return test.status ?? 'published';
}

function formatPrice(price, isFree) {
  if (isFree || Number(price) === 0) {
    return 'Gratis';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export default function TryoutsPage() {
  const [tryouts, setTryouts] = useState(initialTryouts);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
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
          test.subject.toLowerCase().includes(keyword) ||
          (test.category ?? '').toLowerCase().includes(keyword);

        const matchesLevel =
          levelFilter === 'all' || test.level === levelFilter;

        const matchesStatus =
          statusFilter === 'all' || getStatus(test) === statusFilter;

        return matchesSearch && matchesLevel && matchesStatus;
      }),
    [tryouts, search, levelFilter, statusFilter]
  );

  function openCreateForm() {
    setEditingId(null);
    setForm(createEmptyForm());
    setError('');
    setShowForm(true);
  }

  function openEditForm(test) {
    setEditingId(test.id);

    setForm({
      ...createEmptyForm(),
      ...test,
      status: getStatus(test),
      category: test.category ?? '',
      price: test.price ?? 0,
      isFree: test.isFree ?? Number(test.price) === 0,
    });

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
    const category = form.category.trim();
    const durationMinutes = Number(form.durationMinutes);
    const price = Number(form.price);

    if (!title || !subject || !category) {
      setError('Nama paket, kategori, dan mata pelajaran wajib diisi.');
      return;
    }

    if (!LEVELS.includes(form.level)) {
      setError('Pilih jenjang pendidikan yang valid.');
      return;
    }

    let grade = form.grade;

    if (form.level === 'Umum') {
      grade = 'Umum';
    } else {
      grade = Number(form.grade);

      if (
        !Number.isInteger(grade) ||
        (form.level === 'SD' && (grade < 1 || grade > 6)) ||
        (form.level === 'SMP' && (grade < 7 || grade > 9)) ||
        (form.level === 'SMA' && (grade < 10 || grade > 12))
      ) {
        setError('Tingkat kelas tidak sesuai dengan jenjang pendidikan.');
        return;
      }
    }

    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      setError('Durasi harus berupa bilangan bulat lebih dari 0.');
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError('Harga harus berupa angka nol atau lebih.');
      return;
    }

    if (!STATUSES.some((item) => item.value === form.status)) {
      setError('Pilih status paket yang valid.');
      return;
    }

    const tryoutData = {
      id: editingId ?? `tryout-${Date.now()}`,
      title,
      level: form.level,
      grade,
      subject,
      category,
      durationMinutes,
      price: form.isFree ? 0 : price,
      isFree: form.isFree || price === 0,
      status: form.status,
    };

    const result = saveTryoutPackage(tryoutData);

    if (result.status !== 'success') {
      setError(result.message ?? 'Data paket tryout tidak valid.');
      return;
    }

    const candidate = result.data;

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

    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus paket "${test.title}"?`
    );

    if (!confirmed) return;

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
            Kelola paket tryout berdasarkan jenjang, kategori,
            status, dan harga.
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
          placeholder="Cari nama paket, mata pelajaran, atau kategori..."
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
          {LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <select
          className="tryouts-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter status"
        >
          <option value="all">Semua status</option>
          {STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </section>

      {error && (
        <p className="tryouts-error" role="alert">
          {error}
        </p>
      )}

      {showForm && (
        <form className="tryout-form" onSubmit={handleSubmit}>
          <h2>
            {editingId ? 'Edit Paket Tryout' : 'Tambah Paket Tryout'}
          </h2>

          <label className="tryout-field">
            Nama paket
            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                updateForm('title', event.target.value)
              }
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

                const defaultGrade = {
                  SD: 6,
                  SMP: 9,
                  SMA: 12,
                  Umum: 'Umum',
                };

                setForm((current) => ({
                  ...current,
                  level,
                  grade: defaultGrade[level],
                }));
              }}
            >
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          {form.level !== 'Umum' && (
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
          )}

          <label className="tryout-field">
            Mata pelajaran
            <input
              type="text"
              value={form.subject}
              onChange={(event) =>
                updateForm('subject', event.target.value)
              }
              placeholder="Contoh: Matematika"
              required
            />
          </label>

          <label className="tryout-field">
            Kategori paket
            <input
              type="text"
              value={form.category}
              onChange={(event) =>
                updateForm('category', event.target.value)
              }
              placeholder="Contoh: FOKUS TKA"
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

          <label className="tryout-field">
            Harga paket (Rupiah)
            <input
              type="number"
              min="0"
              step="1000"
              value={form.price}
              disabled={form.isFree}
              onChange={(event) =>
                updateForm('price', event.target.value)
              }
              required
            />
          </label>

          <label className="tryout-field">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={(event) => {
                  const isFree = event.target.checked;

                  setForm((current) => ({
                    ...current,
                    isFree,
                    price: isFree ? 0 : current.price,
                  }));
                }}
              />
              Paket gratis
            </span>
          </label>

          <label className="tryout-field">
            Status paket
            <select
              value={form.status}
              onChange={(event) =>
                updateForm('status', event.target.value)
              }
            >
              {STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <div className="tryout-form-actions">
            <button type="submit">
              {editingId ? 'Simpan Perubahan' : 'Simpan Paket'}
            </button>

            <button
              type="button"
              className="tryout-cancel-button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
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
              <th>Kategori</th>
              <th>Status</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredTryouts.map((test, index) => {
              const status = getStatus(test);

              const statusLabel =
                STATUSES.find((item) => item.value === status)?.label ??
                'Terbit';

              return (
                <tr key={test.id}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="tryout-title">
                      <strong>{test.title}</strong>
                      <small>
                        {test.level === 'Umum'
                          ? 'Umum'
                          : `Kelas ${test.grade}`}
                        {' · '}
                        {test.subject}
                      </small>
                    </div>
                  </td>

                  <td>
                    <span className="tryout-level">
                      {test.level}
                    </span>
                  </td>

                  <td>{test.category ?? '-'}</td>

                  <td>
                    <span
                      className={`tryout-status tryout-status-${status}`}
                    >
                      {statusLabel}
                    </span>
                  </td>

                  <td>
                    {formatPrice(test.price, test.isFree)}
                  </td>

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
              );
            })}

            {filteredTryouts.length === 0 && (
              <tr>
                <td className="tryouts-empty" colSpan={7}>
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
