/**
 * Modul: P19 — Latihan CRUD Manajemen Pengguna dalam satu file
 * @author Rayazka Aris (103022400096)
 * Tanggung jawab: memahami dan membangun ulang Read, Create, Update dan Delete.
 * @todo Ganti localStorage dengan API dan autentikasi server setelah tahap frontend.
 */
'use client';
import { useEffect, useRef, useState } from 'react';

// BAGIAN 1 — DATA DAN VALIDASI
// Key lama dipertahankan agar pengguna yang sudah disimpan tidak hilang.
const STORAGE_KEY = 'titik-terampil:user-directory:v1';
const ROLES = { student: 'Siswa', teacher: 'Pengajar', admin: 'Administrator' };
const GRADES = { SD: [1, 2, 3, 4, 5, 6], SMP: [7, 8, 9], SMA: [10, 11, 12] };
const EMPTY_FORM = { name: '', email: '', role: 'student', status: 'active', level: '', grade: '' };
const INITIAL_USERS = [
  { id: 'admin-demo', name: 'Admin Contoh', email: 'admin@example.com', role: 'admin', status: 'active', level: '', grade: null, createdAt: '2026-10-01T02:00:00.000Z' },
  { id: 'teacher-demo', name: 'Pengajar Contoh', email: 'pengajar@example.com', role: 'teacher', status: 'active', level: '', grade: null, createdAt: '2026-10-02T02:00:00.000Z' },
  { id: 'student-demo', name: 'Siswa Contoh', email: 'siswa@example.com', role: 'student', status: 'active', level: 'SMA', grade: 12, createdAt: '2026-10-03T02:00:00.000Z' },
];

/**
 * Memeriksa input sebelum pengguna ditambah atau diubah.
 * @param {Object} user - Data form yang sudah dinormalisasi.
 * @param {Array<Object>} users - Daftar terkini untuk pemeriksaan email/admin.
 * @param {string|null} editingId - ID yang diedit; null untuk mode tambah.
 * @returns {string} Pesan kesalahan atau string kosong jika valid.
 */
function validateUser(user, users, editingId = null) {
  if (typeof user.name !== 'string' || user.name.trim().length < 2 || user.name.length > 80) return 'Nama harus terdiri dari 2–80 karakter.';
  if (typeof user.email !== 'string' || user.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) return 'Masukkan email yang valid.';
  if (users.some((item) => item.id !== editingId && item.email.toLowerCase() === user.email.toLowerCase())) return 'Email sudah digunakan pengguna lain.';
  if (!Object.hasOwn(ROLES, user.role)) return 'Pilih peran yang tersedia.';
  if (!['active', 'inactive'].includes(user.status)) return 'Pilih status yang tersedia.';
  if (user.role === 'student' && (!Object.hasOwn(GRADES, user.level) || !GRADES[user.level].includes(user.grade))) return 'Jenjang dan kelas siswa harus sesuai.';

  // Sisakan minimal satu administrator aktif, termasuk saat mengubah peran/status.
  const original = users.find((item) => item.id === editingId);
  const activeAdmins = users.filter((item) => item.role === 'admin' && item.status === 'active');
  if (original?.role === 'admin' && original.status === 'active' && activeAdmins.length <= 1 && (user.role !== 'admin' || user.status !== 'active')) return 'Administrator aktif terakhir tidak boleh dinonaktifkan atau diganti peran.';
  return '';
}

/**
 * Memastikan hasil JSON.parse aman dipakai sebagai daftar pengguna.
 * @param {unknown} value - Isi localStorage setelah diubah menjadi JavaScript.
 * @returns {boolean} True jika bentuk record, ID dan email konsisten.
 */
function isValidStoredUsers(value) {
  if (!Array.isArray(value) || value.length === 0) return false;
  const ids = new Set();
  const emails = new Set();
  for (const user of value) {
    if (!user || typeof user.id !== 'string' || !user.id.trim() || ids.has(user.id) || validateUser(user, [])) return false;
    if (typeof user.createdAt !== 'string' || !Number.isFinite(Date.parse(user.createdAt))) return false;
    const email = user.email.toLowerCase();
    if (emails.has(email)) return false;
    ids.add(user.id);
    emails.add(email);
  }
  return value.some((user) => user.role === 'admin' && user.status === 'active');
}

// BAGIAN 2 — HALAMAN DAN STATE REACT
/**
 * Menyimpan seluruh alur CRUD dan tampilan dalam satu halaman untuk latihan COTS.
 * @returns {React.ReactElement} Form pengguna dan tabel daftar pengguna.
 */
export default function UsersPage() {
  // users: data yang ditampilkan; ready: pembacaan awal selesai; error: masalah storage.
  const [directory, setDirectory] = useState({ users: [], ready: false, error: '' });
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const nameInput = useRef(null);
  const { users, ready, error: storageError } = directory;

  // READ: effect berjalan setelah halaman terpasang, sehingga localStorage hanya dibaca di browser.
  useEffect(() => {
    let initial;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw === null ? INITIAL_USERS : JSON.parse(raw);
      if (!isValidStoredUsers(saved)) throw new Error('Data lokal rusak');
      initial = { users: saved, ready: true, error: '' };
    } catch {
      initial = { users: INITIAL_USERS, ready: true, error: 'Penyimpanan lokal tidak dapat dibaca. Data contoh ditampilkan; pulihkan sebelum melakukan perubahan.' };
    }
    // Sinkronisasi satu kali dari penyimpanan eksternal saat mount; bukan perhitungan state turunan.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Membaca data browser setelah hidrasi server selesai.
    setDirectory(initial);
    document.title = 'Manajemen Pengguna | Titik Terampil';
  }, []);

  // BAGIAN 3 — FUNGSI CRUD (urut belajar: simpan → tambah → edit → hapus)
  /**
   * Menulis data terlebih dahulu; UI diperbarui hanya jika penyimpanan berhasil.
   * @param {Array<Object>} nextUsers - Daftar setelah operasi CRUD.
   * @param {string} successMessage - Pesan untuk hasil yang benar-benar tersimpan.
   * @returns {boolean} True jika tersimpan; false jika izin/kapasitas storage bermasalah.
   */
  function saveUsers(nextUsers, successMessage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUsers));
      setDirectory({ users: nextUsers, ready: true, error: '' });
      setError('');
      setMessage(successMessage);
      return true;
    } catch {
      setError('Perubahan belum tersimpan. Periksa izin atau ruang penyimpanan browser, lalu coba lagi.');
      setMessage('');
      return false;
    }
  }

  /** @returns {void} Mengosongkan form dan mengembalikan mode tambah. */
  function resetForm() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setError('');
  }

  /**
   * Memperbarui controlled input dan membersihkan pilihan akademik yang tidak sesuai.
   * @param {React.ChangeEvent} event - Input/select yang berubah.
   * @returns {void}
   */
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value,
      ...(name === 'level' ? { grade: '' } : {}),
      ...(name === 'role' ? { level: '', grade: '' } : {}),
    }));
  }

  /**
   * CREATE dan UPDATE memakai satu form; editingId menentukan operasi yang dilakukan.
   * @param {React.FormEvent} event - Submit form.
   * @returns {void} Form direset hanya jika data berhasil disimpan.
   */
  function handleSubmit(event) {
    event.preventDefault(); // Cegah submit HTML memuat ulang halaman.
    if (!ready || storageError) return;
    setMessage('');
    const candidate = { name: form.name.trim(), email: form.email.trim().toLowerCase(),
      role: form.role, status: form.status,
      level: form.role === 'student' ? form.level : '',
      grade: form.role === 'student' ? Number(form.grade) : null,
    };
    const validationError = validateUser(candidate, users, editingId);
    if (validationError) { setError(validationError); return; }

    let nextUsers;
    if (editingId !== null) {
      // UPDATE: ganti hanya record dengan ID yang cocok; pertahankan ID dan tanggal lama.
      nextUsers = users.map((user) => user.id === editingId ? { ...user, ...candidate } : user);
    } else {
      // CREATE: buat record baru, lalu tambahkan ke salinan array.
      const newUser = { ...candidate, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      nextUsers = [...users, newUser];
    }
    if (saveUsers(nextUsers, editingId ? 'Pengguna berhasil diperbarui.' : 'Pengguna berhasil ditambahkan.')) resetForm();
  }

  /**
   * Memasukkan data pengguna ke form dan mengaktifkan mode edit.
   * @param {Object} user - Pengguna dari baris tabel yang dipilih.
   * @returns {void}
   */
  function handleEdit(user) {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status, level: user.level ?? '', grade: user.grade == null ? '' : String(user.grade) });
    setError(''); setMessage('');
    nameInput.current?.focus();
  }

  /**
   * DELETE: minta konfirmasi, lalu gunakan filter untuk menghapus berdasarkan ID.
   * @param {Object} user - Pengguna yang akan dihapus.
   * @returns {void}
   */
  function handleDelete(user) {
    setError(''); setMessage('');
    const isLastAdmin = user.role === 'admin' && user.status === 'active' && users.filter((item) => item.role === 'admin' && item.status === 'active').length <= 1;
    if (isLastAdmin) { setError('Administrator aktif terakhir tidak boleh dihapus.'); return; }
    if (!window.confirm(`Hapus ${user.name}? Data ini akan dihapus dari browser.`)) return;
    const nextUsers = users.filter((item) => item.id !== user.id);
    if (saveUsers(nextUsers, 'Pengguna berhasil dihapus.') && editingId === user.id) resetForm();
  }

  /** @returns {void} Memulihkan data contoh hanya setelah konfirmasi pengguna. */
  function restoreExamples() {
    if (!window.confirm('Ganti data lokal dengan data contoh? Perubahan lama akan diganti.')) return;
    if (saveUsers(INITIAL_USERS, 'Data contoh berhasil dipulihkan.')) resetForm();
  }

  // BAGIAN 4 — TAMPILAN MINIMAL: satu form dan satu tabel.
  const disabled = !ready || Boolean(storageError);
  return (
    <section className="users-page" aria-labelledby="users-title">
      <h1 id="users-title">Manajemen Pengguna</h1>
      <p>Latihan CRUD: tambah, tampilkan, ubah, dan hapus pengguna. Data demo disimpan di browser ini.</p>
      <div role="status">{message && <p className="feedback success">{message}</p>}</div>
      {error && <p role="alert" className="feedback error">{error}</p>}
      {storageError && <div role="alert" className="feedback error"><p>{storageError}</p><button type="button" onClick={restoreExamples}>Pulihkan data contoh</button></div>}
      <div className="users-grid">
        <section className="users-panel" aria-labelledby="form-title">
          <h2 id="form-title">{editingId ? 'Edit pengguna' : 'Tambah pengguna'}</h2>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={disabled}>
              <label htmlFor="user-name">Nama lengkap</label>
              <input ref={nameInput} id="user-name" name="name" value={form.name} onChange={handleChange} required minLength={2} maxLength={80} autoComplete="name" />
              <label htmlFor="user-email">Email</label>
              <input id="user-email" name="email" type="email" value={form.email} onChange={handleChange} required maxLength={254} autoComplete="email" />
              <label htmlFor="user-role">Peran</label>
              <select id="user-role" name="role" value={form.role} onChange={handleChange}>{Object.entries(ROLES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
              <label htmlFor="user-status">Status</label>
              <select id="user-status" name="status" value={form.status} onChange={handleChange}><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select>
              {form.role === 'student' && <>
                <label htmlFor="user-level">Jenjang</label>
                <select id="user-level" name="level" value={form.level} onChange={handleChange} required><option value="">Pilih jenjang</option>{Object.keys(GRADES).map((level) => <option key={level} value={level}>{level}</option>)}</select>
                <label htmlFor="user-grade">Kelas</label>
                <select id="user-grade" name="grade" value={form.grade} onChange={handleChange} required disabled={!form.level}><option value="">Pilih kelas</option>{(GRADES[form.level] ?? []).map((grade) => <option key={grade} value={grade}>{grade}</option>)}</select>
              </>}
              <div className="form-actions"><button type="submit">{editingId ? 'Simpan perubahan' : 'Tambah pengguna'}</button>{editingId && <button type="button" className="secondary-action" onClick={resetForm}>Batal edit</button>}</div>
            </fieldset>
          </form>
        </section>
        <section className="users-panel user-list" aria-labelledby="list-title">
          <h2 id="list-title">Daftar pengguna ({ready ? users.length : '…'})</h2>
          {!ready ? <p role="status">Memuat data...</p> : <div className="table-scroll" role="region" aria-label="Daftar pengguna, geser untuk melihat seluruh kolom" tabIndex={0}>
            <table>
              <caption className="sr-only">Data pengguna yang tersimpan pada browser</caption>
              <thead><tr><th scope="col">Nama</th><th scope="col">Email</th><th scope="col">Peran</th><th scope="col">Akademik</th><th scope="col">Status</th><th scope="col">Aksi</th></tr></thead>
              {/* READ: setiap objek pengguna menjadi satu baris, dengan ID sebagai key. */}
              <tbody>{users.map((user) => <tr key={user.id}>
                <th scope="row">{user.name}</th><td>{user.email}</td><td>{ROLES[user.role]}</td><td>{user.role === 'student' ? `${user.level} / ${user.grade}` : 'Tidak berlaku'}</td><td>{user.status === 'active' ? 'Aktif' : 'Nonaktif'}</td>
                <td><div className="row-actions"><button type="button" className="secondary-action" disabled={disabled} onClick={() => handleEdit(user)} aria-label={`Edit ${user.name}`}>Edit</button><button type="button" className="delete-action" disabled={disabled} onClick={() => handleDelete(user)} aria-label={`Hapus ${user.name}`}>Hapus</button></div></td>
              </tr>)}</tbody>
            </table>
          </div>}
        </section>
      </div>
      <p className="local-note">Direktori latihan ini belum membuat akun login atau mengubah data kelas pada modul lain.</p>

      {/* BAGIAN 5 — CSS lokal di file yang sama, cukup untuk latihan dan mobile. */}
      <style jsx>{`
        .users-page { padding: 28px; color: var(--tt-text-primary); font-family: var(--tt-font-body); }
        h1 { font-size: 28px; margin: 0 0 8px; letter-spacing: -.02em; }
        h2 { font-size: 18px; margin: 0 0 20px; letter-spacing: -.01em; }
        .users-page > p { color: var(--tt-text-secondary); margin: 0 0 24px; }
        .users-grid { display: grid; grid-template-columns: minmax(240px, 300px) minmax(0, 1fr); gap: 20px; align-items: start; }
        .users-panel { min-width: 0; padding: 20px; background: var(--tt-surface); border: 1px solid var(--tt-border-default); border-radius: 12px; }
        fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
        label { display: block; margin: 14px 0 6px; font-size: 14px; }
        label:first-child { margin-top: 0; }
        input, select { width: 100%; min-height: 44px; padding: 9px 12px; border: 1px solid var(--tt-border-strong); border-radius: 8px; background: var(--tt-surface); color: var(--tt-text-primary); font: inherit; font-size: 16px; }
        button { white-space: nowrap; min-height: 44px; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--tt-primary); background: var(--tt-primary); color: white; font: inherit; font-size: 14px; cursor: pointer; }
        button:hover { background: var(--tt-hover); }
        .secondary-action { background: var(--tt-surface); color: var(--tt-primary); }
        .secondary-action:hover { background: var(--tt-soft); }
        .delete-action { background: var(--tt-danger-soft); color: var(--tt-danger); border-color: var(--tt-danger); }
        .delete-action:hover { background: var(--tt-danger); color: white; }
        button:disabled, fieldset:disabled button { background: var(--tt-disabled-bg); color: var(--tt-text-secondary); border-color: var(--tt-border-default); cursor: not-allowed; }
        select:disabled, input:disabled { background: var(--tt-disabled-bg); }
        :is(button, input, select, .table-scroll):focus-visible { outline: 3px solid var(--tt-focus-ring); outline-offset: 3px; }
        .form-actions, .row-actions { display: flex; flex-wrap: wrap; gap: 8px; }
        .form-actions { margin-top: 20px; }
        .row-actions { flex-wrap: nowrap; }
        .table-scroll { overflow-x: auto; }
        table { width: 100%; min-width: 670px; border-collapse: collapse; text-align: left; font-size: 14px; }
        th, td { padding: 12px; border-bottom: 1px solid var(--tt-border-default); overflow-wrap: anywhere; max-width: 220px; vertical-align: middle; }
        thead th { white-space: nowrap; }
        thead { background: var(--tt-surface-subtle); }
        tbody th { font-weight: 500; }
        .feedback { padding: 12px 16px; border-radius: 8px; margin: 16px 0; }
        .feedback p { margin-top: 0; }
        .success { background: var(--tt-success-bg); color: var(--tt-success); }
        .error { background: var(--tt-error-bg); color: var(--tt-error); }
        .local-note { margin-top: 24px !important; font-size: 12px; }
        .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
        @media (max-width: 1100px) { .users-grid { grid-template-columns: minmax(0, 1fr); } }
        @media (max-width: 639px) { .users-page { padding: 20px 16px; } .users-panel { padding: 16px; } }
      `}</style>
    </section>
  );
}
