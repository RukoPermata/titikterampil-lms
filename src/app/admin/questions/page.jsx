
'use client';

import { useMemo, useState } from 'react';
import { questions as initialQuestions, tryouts } from '@/src/data/mock';

const QUESTION_TYPES = [
  { value: 'single_choice', label: 'Pilihan Tunggal' },
  { value: 'multiple_choice', label: 'Pilihan Ganda' },
  { value: 'true_false', label: 'Benar / Salah' },
  { value: 'short_answer', label: 'Jawaban Singkat' },
  { value: 'essay', label: 'Esai' },
];

const LEVELS = ['SD', 'SMP', 'SMA', 'Umum'];

function createEmptyForm() {
  return {
    prompt: '',
    tryoutId: tryouts[0]?.id ?? '',
    type: 'single_choice',
    options: ['', '', '', ''],
    correctIndex: 0,
    correctIndices: [],
    correctAnswer: '',
    weight: 1,
    maxScore: 10,
    rubric: '',
    explanation: '',
    image: '',
  };
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(createEmptyForm);
  const [error, setError] = useState('');
  const [importText, setImportText] = useState('');
  const [importResult, setImportResult] = useState(null);

  const subjects = useMemo(
    () => [...new Set(tryouts.map((item) => item.subject).filter(Boolean))],
    []
  );

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const test = tryouts.find(
        (item) => item.id === question.tryoutId
      );

      const matchesSearch = question.prompt
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesLevel =
        levelFilter === 'all' || test?.level === levelFilter;

      const matchesSubject =
        subjectFilter === 'all' || test?.subject === subjectFilter;

      const matchesType =
        typeFilter === 'all' || question.type === typeFilter;

      return (
        matchesSearch &&
        matchesLevel &&
        matchesSubject &&
        matchesType
      );
    });
  }, [questions, search, levelFilter, subjectFilter, typeFilter]);

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateOption(index, value) {
    setForm((current) => ({
      ...current,
      options: current.options.map((option, i) =>
        i === index ? value : option
      ),
    }));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(createEmptyForm());
    setError('');
    setShowForm(true);
  }

  function openEditForm(question) {
    setEditingId(question.id);

    setForm({
      ...createEmptyForm(),
      ...question,
      options: question.options
        ? [...question.options]
        : ['', '', '', ''],
      correctIndices: question.correctIndices
        ? [...question.correctIndices]
        : [],
    });

    setError('');
    setShowForm(true);
  }

  function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('File yang dipilih harus berupa gambar.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateForm('image', reader.result);
      setError('');
    };

    reader.readAsDataURL(file);
  }

  function validateQuestion() {
    if (!form.prompt.trim()) {
      return 'Teks soal wajib diisi.';
    }

    if (!form.tryoutId) {
      return 'Pilih paket tryout terlebih dahulu.';
    }

    if (Number(form.weight) <= 0) {
      return 'Bobot soal harus lebih besar dari nol.';
    }

    if (
      ['single_choice', 'multiple_choice', 'true_false'].includes(
        form.type
      )
    ) {
      const filledOptions = form.options.filter(
        (option) => option.trim()
      );

      if (filledOptions.length < 2) {
        return 'Minimal dua opsi jawaban harus diisi.';
      }

      if (form.type === 'single_choice') {
        if (
          !form.options[form.correctIndex]?.trim()
        ) {
          return 'Pilih kunci jawaban yang valid.';
        }
      }

      if (form.type === 'multiple_choice') {
        if (form.correctIndices.length === 0) {
          return 'Pilih minimal satu kunci jawaban.';
        }
      }
    }

    if (form.type === 'short_answer' && !form.correctAnswer.trim()) {
      return 'Jawaban singkat wajib diisi.';
    }

    if (form.type === 'essay' && Number(form.maxScore) <= 0) {
      return 'Skor maksimal esai harus lebih besar dari nol.';
    }

    return '';
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateQuestion();

    if (validationError) {
      setError(validationError);
      return;
    }

    const questionData = {
      ...form,
      id: editingId ?? `question-${Date.now()}`,
      prompt: form.prompt.trim(),
      weight: Number(form.weight),
      explanation: form.explanation.trim(),
      ...(form.type === 'essay' && {
        maxScore: Number(form.maxScore),
      }),
    };

    if (editingId) {
      setQuestions((current) =>
        current.map((question) =>
          question.id === editingId ? questionData : question
        )
      );
    } else {
      setQuestions((current) => [...current, questionData]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(createEmptyForm());
    setError('');
  }

  function handleDelete(question) {
    const confirmed = window.confirm(
      'Apakah kamu yakin ingin menghapus soal ini?'
    );

    if (!confirmed) return;

    setQuestions((current) =>
      current.filter((item) => item.id !== question.id)
    );

    setError('');
  }

  function handleImportCSV() {
    setImportResult(null);

    const lines = importText
      .split(/\r?\n/)
      .filter((line) => line.trim());

    if (lines.length < 2) {
      setImportResult({
        success: 0,
        failed: 0,
        errors: ['CSV harus memiliki header dan minimal satu baris data.'],
      });
      return;
    }

    const headers = parseCSVLine(lines[0]).map((header) =>
      header.toLowerCase()
    );

    const requiredHeaders = [
      'prompt',
      'tryoutid',
      'type',
      'options',
      'correctindex',
      'weight',
      'explanation',
    ];

    const missingHeaders = requiredHeaders.filter(
      (header) => !headers.includes(header)
    );

    if (missingHeaders.length > 0) {
      setImportResult({
        success: 0,
        failed: lines.length - 1,
        errors: [
          `Kolom wajib tidak ditemukan: ${missingHeaders.join(', ')}`,
        ],
      });
      return;
    }

    const importedQuestions = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);

      const rowData = {};

      headers.forEach((header, index) => {
        rowData[header] = row[index] ?? '';
      });

      const options = rowData.options
        .split('|')
        .map((option) => option.trim())
        .filter(Boolean);

      const correctIndex = Number(rowData.correctindex);
      const weight = Number(rowData.weight);

      const validTryout = tryouts.some(
        (item) => item.id === rowData.tryoutid
      );

      const validType = QUESTION_TYPES.some(
        (item) => item.value === rowData.type
      );

      if (!rowData.prompt.trim()) {
        errors.push(`Baris ${i + 1}: teks soal kosong.`);
        continue;
      }

      if (!validTryout) {
        errors.push(`Baris ${i + 1}: tryoutId tidak valid.`);
        continue;
      }

      if (!validType) {
        errors.push(`Baris ${i + 1}: tipe soal tidak valid.`);
        continue;
      }

      if (
        ['single_choice', 'multiple_choice', 'true_false'].includes(
          rowData.type
        ) &&
        options.length < 2
      ) {
        errors.push(`Baris ${i + 1}: minimal dua opsi jawaban.`);
        continue;
      }

      if (
        rowData.type === 'single_choice' &&
        (
          !Number.isInteger(correctIndex) ||
          correctIndex < 0 ||
          correctIndex >= options.length
        )
      ) {
        errors.push(`Baris ${i + 1}: correctIndex tidak valid.`);
        continue;
      }

      if (!Number.isFinite(weight) || weight <= 0) {
        errors.push(`Baris ${i + 1}: bobot tidak valid.`);
        continue;
      }

      importedQuestions.push({
        id: `question-import-${Date.now()}-${i}`,
        tryoutId: rowData.tryoutid,
        type: rowData.type,
        prompt: rowData.prompt.trim(),
        options,
        correctIndex,
        weight,
        explanation: rowData.explanation.trim(),
      });
    }

    if (importedQuestions.length > 0) {
      setQuestions((current) => [
        ...current,
        ...importedQuestions,
      ]);
    }

    setImportResult({
      success: importedQuestions.length,
      failed: errors.length,
      errors,
    });
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setError('');
  }

  return (
    <main className="page-content questions-page">
      <header className="questions-header">
        <div>
          <h1>Bank Soal</h1>
          <p className="lead">
            Kelola koleksi soal berdasarkan jenjang, mata pelajaran,
            dan tipe soal.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="questions-add-button"
            onClick={() => {
              setShowImport(true);
              setImportResult(null);
              setImportText('');
            }}
          >
            Import CSV
          </button>

          <button
            type="button"
            className="questions-add-button"
            onClick={openCreateForm}
          >
            + Tambah Soal
          </button>
        </div>
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
          value={levelFilter}
          onChange={(event) => setLevelFilter(event.target.value)}
          aria-label="Filter jenjang"
        >
          <option value="all">Semua jenjang</option>
          {LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
              {level === 'SD' ? ' (4–6)' : ''}
              {level === 'SMP' ? ' (7–9)' : ''}
              {level === 'SMA' ? ' / Gap Year' : ''}
            </option>
          ))}
        </select>

        <select
          className="questions-filter"
          value={subjectFilter}
          onChange={(event) => setSubjectFilter(event.target.value)}
          aria-label="Filter mata pelajaran"
        >
          <option value="all">Semua mata pelajaran</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <select
          className="questions-filter"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          aria-label="Filter tipe soal"
        >
          <option value="all">Semua tipe soal</option>
          {QUESTION_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
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
              required
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
            Tipe soal
            <select
              value={form.type}
              onChange={(event) => {
                const type = event.target.value;

                updateForm('type', type);
                updateForm(
                  'options',
                  type === 'true_false'
                    ? ['Benar', 'Salah']
                    : ['', '', '', '']
                );
                updateForm('correctIndex', 0);
                updateForm('correctIndices', []);
              }}
            >
              {QUESTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <label className="question-field">
            Teks soal
            <textarea
              value={form.prompt}
              onChange={(event) =>
                updateForm('prompt', event.target.value)
              }
              placeholder="Masukkan pertanyaan..."
              required
            />
          </label>

          {['single_choice', 'multiple_choice', 'true_false'].includes(
            form.type
          ) && (
            <fieldset className="question-options">
              <legend>
                Pilihan jawaban
                {form.type === 'multiple_choice'
                  ? ' (pilih semua kunci yang benar)'
                  : ' dan kunci'}
              </legend>

              {form.options.map((option, index) => (
                <div className="question-option" key={index}>
                  {form.type === 'multiple_choice' ? (
                    <input
                      type="checkbox"
                      checked={form.correctIndices.includes(index)}
                      onChange={(event) => {
                        const checked = event.target.checked;

                        updateForm(
                          'correctIndices',
                          checked
                            ? [...form.correctIndices, index]
                            : form.correctIndices.filter(
                                (item) => item !== index
                              )
                        );
                      }}
                      aria-label={`Pilih opsi ${index + 1} sebagai kunci`}
                    />
                  ) : (
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={Number(form.correctIndex) === index}
                      onChange={() =>
                        updateForm('correctIndex', index)
                      }
                      aria-label={`Jadikan opsi ${index + 1} sebagai kunci`}
                    />
                  )}

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
          )}

          {form.type === 'short_answer' && (
            <label className="question-field">
              Jawaban benar
              <input
                value={form.correctAnswer}
                onChange={(event) =>
                  updateForm('correctAnswer', event.target.value)
                }
                placeholder="Masukkan jawaban singkat"
                required
              />
            </label>
          )}

          {form.type === 'essay' && (
            <>
              <label className="question-field">
                Skor maksimal
                <input
                  type="number"
                  min="1"
                  value={form.maxScore}
                  onChange={(event) =>
                    updateForm('maxScore', event.target.value)
                  }
                  required
                />
              </label>

              <label className="question-field">
                Rubrik penilaian
                <textarea
                  value={form.rubric}
                  onChange={(event) =>
                    updateForm('rubric', event.target.value)
                  }
                  placeholder="Tuliskan kriteria penilaian esai..."
                />
              </label>
            </>
          )}

          <label className="question-field">
            Bobot nilai
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={form.weight}
              onChange={(event) =>
                updateForm('weight', event.target.value)
              }
              required
            />
          </label>

          <label className="question-field">
            Gambar soal (opsional)
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          {form.image && (
            <div className="my-3">
              <p className="mb-2">Preview gambar:</p>
              <img
                src={form.image}
                alt="Preview gambar soal"
                className="max-h-64 rounded-lg border object-contain"
              />

              <button
                type="button"
                className="question-cancel-button mt-2"
                onClick={() => updateForm('image', '')}
              >
                Hapus gambar
              </button>
            </div>
          )}

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
            <button type="submit">
              {editingId ? 'Simpan Perubahan' : 'Simpan Soal'}
            </button>

            <button
              type="button"
              className="question-cancel-button"
              onClick={closeForm}
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
              <th>Jenjang</th>
              <th>Mata Pelajaran</th>
              <th>Tipe</th>
              <th>Bobot</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredQuestions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Tidak ada soal yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              filteredQuestions.map((question, index) => {
                const test = tryouts.find(
                  (item) => item.id === question.tryoutId
                );

                const typeLabel =
                  QUESTION_TYPES.find(
                    (item) => item.value === question.type
                  )?.label ?? question.type;

                return (
                  <tr key={question.id}>
                    <td>{index + 1}</td>

                    <td>
                      <div className="question-prompt">
                        <strong>{question.prompt}</strong>

                        {question.options?.length > 0 && (
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
                        )}

                        {question.type === 'short_answer' && (
                          <small className="question-key">
                            Jawaban: {question.correctAnswer ?? '-'}
                          </small>
                        )}

                        {question.type === 'essay' && (
                          <small className="question-key">
                            Skor maksimal: {question.maxScore ?? '-'}
                          </small>
                        )}
                      </div>
                    </td>

                    <td>{test?.level ?? '-'}</td>
                    <td>{test?.subject ?? '-'}</td>
                    <td>{typeLabel}</td>
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
              })
            )}
          </tbody>
        </table>
      </div>

      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 text-gray-900 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Import Soal CSV</h2>

              <button
                type="button"
                onClick={() => setShowImport(false)}
                className="text-xl"
                aria-label="Tutup modal"
              >
                ×
              </button>
            </div>

            <p className="mb-3 text-sm text-gray-600">
              Tempelkan isi CSV di bawah. Gunakan header:
              prompt, tryoutId, type, options, correctIndex, weight,
              explanation. Pisahkan opsi dengan tanda |.
            </p>

            <textarea
              rows={8}
              className="w-full rounded-lg border border-gray-300 p-3 font-mono text-sm"
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              placeholder={`prompt,tryoutId,type,options,correctIndex,weight,explanation
"Berapa hasil 2+2?",demo,single_choice,"3|4|5|6",1,1,"Hasilnya adalah 4."`}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="questions-add-button"
                onClick={handleImportCSV}
              >
                Validasi & Import
              </button>

              <button
                type="button"
                className="question-cancel-button"
                onClick={() => {
                  setShowImport(false);
                  setImportResult(null);
                }}
              >
                Tutup
              </button>
            </div>

            {importResult && (
              <div className="mt-4 rounded-lg border p-3">
                <p className="font-semibold">
                  Berhasil: {importResult.success} baris
                </p>

                <p className="font-semibold">
                  Gagal: {importResult.failed} baris
                </p>

                {importResult.errors.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-red-600">
                    {importResult.errors.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
