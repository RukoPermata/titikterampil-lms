/**
 * Modul: P19 — Manajemen Pengguna frontend
 * @author Rayazka Aris (103022400096)
 * Tanggung jawab: daftar, pencarian, filter, pagination dan CRUD data demo pengguna.
 * @todo Integrasikan repository API dan hak akses server pada tahap backend.
 */
'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { filterUsers, getDeleteError, ROLE_LABELS, STATUS_LABELS, validateUserForm, persistUsers, readUserDirectory, subscribeUserDirectory } from '@/src/features/academic/user-management';
import { demoUsers } from '@/src/features/academic/data/demo-users';
import { UserForm, UserModal } from './UserForm';
import styles from './users.module.css';

// BAGIAN 1 — Snapshot awal dan ikon: tidak ada akses browser pada render server.
const INITIAL_DIRECTORY = { users: demoUsers, ready: false, error: '' };

/**
 * Membaca direktori browser; dipanggil React setelah hidrasi.
 * @returns {Object} Snapshot pengguna yang stabil sampai ada perubahan.
 */
function getUserSnapshot() {
  return readUserDirectory(demoUsers);
}

/**
 * Menyediakan data awal SSR yang identik pada hidrasi pertama.
 * @returns {Object} Snapshot awal tanpa mengakses window atau localStorage.
 */
function getServerSnapshot() {
  return INITIAL_DIRECTORY;
}

const paths = {
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
  edit: <><path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15l-1 6Z" /></>,
  trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></>,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  left: <path d="m14 6-6 6 6 6" />,
  right: <path d="m10 6 6 6-6 6" />,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-3-5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
};

/**
 * Menggambar ikon dekoratif; nama aksesibel ditempatkan pada tombol.
 * @param {Object} props - Properti pilihan ikon.
 * @param {string} props.name - Nama ikon yang tersedia.
 * @returns {React.ReactElement} SVG ukuran 20px yang disembunyikan dari pembaca layar.
 */
function UserIcon({ name }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}


const dateFormat = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' });

/**
 * Membentuk inisial avatar tanpa mengunduh gambar atau memakai data pihak ketiga.
 * @param {string} name - Nama lengkap pengguna.
 * @returns {string} Maksimal dua huruf awal.
 */
function getInitials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}

/**
 * BAGIAN 2 — Halaman: state, data turunan, handler, lalu markup tampilan.
 * Menyusun seluruh interaksi halaman dengan state React dan penyimpanan lokal.
 * @returns {React.ReactElement} Halaman admin responsif beserta dialog bersyarat.
 */
export default function UsersPage() {
  // 1. Pisahkan data persisten dari state tampilan; pencarian tidak mengubah data.
  // useSyncExternalStore menyambungkan penyimpanan browser ke render React.
  const { users, ready, error: storageError } = useSyncExternalStore(
    subscribeUserDirectory, getUserSnapshot, getServerSnapshot,
  );

  // Page menjadi komponen client agar seluruh tampilan mudah ditemukan dalam satu file.
  // Judul tab disetel lewat effect; metadata root tetap dipakai untuk HTML awal.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Manajemen Pengguna | Titik Terampil';
    return () => { document.title = previousTitle; };
  }, []);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [editor, setEditor] = useState(null); // null = tertutup; { user: null } = tambah.
  const [confirmation, setConfirmation] = useState(null);
  const [notice, setNotice] = useState('');
  const [operationError, setOperationError] = useState('');

  // 2. Nilai turunan dihitung dari sumber, bukan disimpan sebagai state duplikat.
  const filtered = filterUsers(users, { query, role, status, sort });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount); // Hapus baris terakhir tidak membuat halaman kosong palsu.
  const start = (currentPage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);
  const hasFilters = query !== '' || role !== 'all' || status !== 'all';

  /**
   * Menghapus filter dan kembali ke halaman pertama.
   * @returns {void}
   */
  function resetFilters() {
    setQuery(''); setRole('all'); setStatus('all'); setPage(1);
  }

  /**
   * Membuka form baru atau edit dan membersihkan pesan operasi sebelumnya.
   * @param {Object|null} user - Record yang diedit atau null untuk menambah.
   * @returns {void}
   */
  function openEditor(user = null) {
    setOperationError(''); setNotice(''); setEditor({ user });
  }

  /**
   * Memvalidasi ulang data, membentuk record, lalu menyimpan sebelum menutup dialog.
   * @param {Object} input - Kandidat data dari UserForm.
   * @param {string|null} editingId - Identitas mode edit atau null.
   * @returns {Object} ok dan error yang dapat ditampilkan form.
   */
  function handleSave(input, editingId) {
    if (storageError) return { ok: false, error: 'Pulihkan penyimpanan lokal sebelum mengubah data.' };
    const result = validateUserForm(input, users, editingId);
    if (Object.keys(result.errors).length) return { ok: false, error: Object.values(result.errors)[0] };
    const original = users.find((user) => user.id === editingId);
    if (editingId && !original) return { ok: false, error: 'Pengguna sudah dihapus dari tab lain. Tutup form dan periksa daftar.' };

    // ID dan tanggal lama dipertahankan saat edit; tambah mendapat UUID baru.
    const record = { ...result.candidate, id: original?.id ?? crypto.randomUUID(), createdAt: original?.createdAt ?? new Date().toISOString() };
    const nextUsers = original ? users.map((user) => user.id === editingId ? record : user) : [...users, record];
    const saved = persistUsers(nextUsers);
    if (saved.ok) {
      setEditor(null);
      setNotice(`${record.name} berhasil ${original ? 'diperbarui' : 'ditambahkan'}.`);
      if (!original) { resetFilters(); setSort('newest'); }
    }
    return saved;
  }

  /**
   * Menyelesaikan konfirmasi hapus atau pemulihan data contoh.
   * @returns {void} Dialog tetap terbuka jika operasi ditolak atau storage gagal.
   */
  function handleConfirm() {
    let nextUsers;
    if (confirmation.type === 'restore') {
      nextUsers = demoUsers;
    } else {
      const reason = getDeleteError(users, confirmation.user.id);
      if (reason) { setOperationError(reason); return; }
      nextUsers = users.filter((user) => user.id !== confirmation.user.id);
    }
    const saved = persistUsers(nextUsers);
    if (!saved.ok) { setOperationError(saved.error); return; }
    setNotice(confirmation.type === 'restore' ? 'Data contoh berhasil dipulihkan.' : `${confirmation.user.name} berhasil dihapus.`);
    setConfirmation(null);
    setOperationError('');
  }

  // BAGIAN 3 — Tampilan: heading → ringkasan → toolbar → tabel → dialog.
  return (
    <section className={styles.page} aria-labelledby="users-heading" aria-busy={!ready}>
      <div className={styles.pageHeading}>
        <div>
          <h1 id="users-heading">Manajemen Pengguna</h1>
          <p>Kelola siswa, pengajar, dan administrator dalam satu tempat.</p>
        </div>
        <button type="button" className={styles.primaryButton} disabled={!ready || Boolean(storageError)} onClick={() => openEditor()}><UserIcon name="plus" />Tambah pengguna</button>
      </div>

      {/* Ringkasan selalu memakai seluruh direktori; filter hanya memengaruhi tabel. */}
      <div className={styles.summary} aria-label="Ringkasan pengguna">
        {Object.entries(ROLE_LABELS).map(([value, label]) => (
          <div className={styles.summaryItem} key={value}>
            <span>{label}</span><strong>{ready ? users.filter((user) => user.role === value).length : '—'}</strong>
            <span className={styles.summaryDetail}>{ready ? users.filter((user) => user.role === value && user.status === 'active').length : '—'} aktif</span>
          </div>
        ))}
      </div>

      {/* role=status mengumumkan hasil operasi tanpa memindahkan fokus pengguna. */}
      <div role="status" aria-live="polite">
        {notice && <div className={styles.successAlert}><UserIcon name="check" /><span>{notice}</span><button type="button" className={styles.iconButton} aria-label="Tutup pemberitahuan" onClick={() => setNotice('')}><UserIcon name="close" /></button></div>}
      </div>
      {storageError && <div role="alert" className={styles.errorAlert}><p>{storageError}</p><button type="button" className={styles.outlineButton} onClick={() => { setOperationError(''); setConfirmation({ type: 'restore' }); }}>Pulihkan data contoh</button></div>}

      <section className={styles.directory} aria-labelledby="directory-heading">
        <div className={styles.directoryHeading}><h2 id="directory-heading">Daftar pengguna <span>{ready ? users.length : '—'}</span></h2><span className={styles.demoLabel}>Data demo · Tersimpan di browser</span></div>
        <div className={styles.toolbar}>
          <label className={styles.search}><span className={styles.srOnly}>Cari nama atau email</span><UserIcon name="search" /><input type="search" value={query} placeholder="Cari nama atau email..." onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label>
          <label className={styles.filter}><span className={styles.srOnly}>Filter status</span><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="all">Semua status</option><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select></label>
          <label className={styles.filter}><span className={styles.srOnly}>Urutkan pengguna</span><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}><option value="newest">Terbaru</option><option value="name">Nama A–Z</option></select></label>
        </div>
        <div className={styles.roleFilters} role="group" aria-label="Filter peran pengguna">
          {[['all', 'Semua pengguna'], ...Object.entries(ROLE_LABELS)].map(([value, label]) => <button type="button" key={value} aria-pressed={role === value} className={styles.roleButton} onClick={() => { setRole(value); setPage(1); }}>{label}<span>{ready ? (value === 'all' ? users.length : users.filter((user) => user.role === value).length) : '—'}</span></button>)}
        </div>

        {!ready ? <div className={styles.empty} role="status"><p>Memuat direktori pengguna...</p></div> : filtered.length === 0 ? (
          <div className={styles.empty}><UserIcon name="people" /><h3>{hasFilters ? 'Pengguna tidak ditemukan' : 'Belum ada pengguna'}</h3><p>{hasFilters ? 'Coba kata kunci lain atau hapus filter untuk melihat seluruh pengguna.' : 'Tambahkan pengguna pertama untuk mulai mengelola direktori.'}</p>{hasFilters && <button type="button" className={styles.outlineButton} onClick={resetFilters}>Hapus filter</button>}</div>
        ) : (
          <>
            {/* Area scroll berlabel mempertahankan tabel semantik pada layar kecil. */}
            <div className={styles.tableScroll} role="region" aria-label="Tabel pengguna, geser horizontal untuk melihat seluruh kolom" tabIndex={0}>
              <table className={styles.table}>
                <caption className={styles.srOnly}>Daftar pengguna sesuai pencarian dan filter</caption>
                <thead><tr><th scope="col">Nama pengguna</th><th scope="col">Peran</th><th scope="col">Akademik</th><th scope="col">Status</th><th scope="col">Bergabung</th><th scope="col" className={styles.actionHeading}>Aksi</th></tr></thead>
                <tbody>{visible.map((user) => (
                  <tr key={user.id}>
                    <th scope="row"><div className={styles.identity}><span className={styles.avatar} aria-hidden="true">{getInitials(user.name)}</span><div><span className={styles.userName}>{user.name}</span><span className={styles.email}>{user.email}</span></div></div></th>
                    <td><span className={`${styles.badge} ${styles[user.role]}`}>{ROLE_LABELS[user.role]}</span></td>
                    <td>{user.role === 'student' ? <span>{user.level}<span className={styles.cellSecondary}>Kelas {user.grade}</span></span> : <span className={styles.notApplicable}>Tidak berlaku</span>}</td>
                    <td><span className={`${styles.status} ${user.status === 'active' ? styles.active : styles.inactive}`}><span aria-hidden="true" />{STATUS_LABELS[user.status]}</span></td>
                    <td className={styles.date}>{dateFormat.format(new Date(user.createdAt))}</td>
                    <td><div className={styles.rowActions}><button type="button" disabled={Boolean(storageError)} className={styles.iconButton} aria-label={`Edit ${user.name}`} onClick={() => openEditor(user)}><UserIcon name="edit" /></button><button type="button" disabled={Boolean(storageError)} className={`${styles.iconButton} ${styles.deleteButton}`} aria-label={`Hapus ${user.name}`} onClick={() => { setNotice(''); setOperationError(''); setConfirmation({ type: 'delete', user }); }}><UserIcon name="trash" /></button></div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <footer className={styles.pagination}>
              <p aria-live="polite">Menampilkan <strong>{start + 1}–{Math.min(start + pageSize, filtered.length)}</strong> dari <strong>{filtered.length}</strong> pengguna</p>
              <div className={styles.paginationControls}>
                <label><span className={styles.srOnly}>Jumlah pengguna per halaman</span><select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option value={6}>6 per halaman</option><option value={12}>12 per halaman</option><option value={24}>24 per halaman</option></select></label>
                <button type="button" className={styles.iconButton} aria-label="Halaman sebelumnya" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><UserIcon name="left" /></button>
                <span className={styles.pageNumber}>Halaman {currentPage} / {pageCount}</span>
                <button type="button" className={styles.iconButton} aria-label="Halaman berikutnya" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}><UserIcon name="right" /></button>
              </div>
            </footer>
          </>
        )}
      </section>
      <p className={styles.pageNote}>Perubahan hanya berlaku pada direktori demo di browser ini. Akses login pengguna belum terhubung.</p>

      {/* Render bersyarat mereset state form setiap kali dialog baru dibuka. */}
      {editor && <UserForm key={editor.user?.id ?? 'new'} user={editor.user} users={users} onSave={handleSave} onDismiss={() => setEditor(null)} />}
      {confirmation && <UserModal title={confirmation.type === 'restore' ? 'Pulihkan data contoh?' : 'Hapus pengguna?'} description={confirmation.type === 'restore' ? 'Direktori lokal akan diganti dengan daftar contoh awal.' : 'Periksa kembali pengguna yang akan dihapus dari direktori.'} onDismiss={() => { setConfirmation(null); setOperationError(''); }}>
        <div className={styles.confirmBody}>
          {confirmation.user && <div className={styles.deleteIdentity}><strong>{confirmation.user.name}</strong><span>{confirmation.user.email}</span></div>}
          <p>{confirmation.type === 'restore' ? 'Perubahan lokal sebelumnya akan diganti. Tindakan ini tidak memengaruhi data di perangkat lain.' : 'Data pengguna ini akan dihapus dari browser. Tindakan ini tidak dapat dibatalkan.'}</p>
          {(operationError || (confirmation.user && getDeleteError(users, confirmation.user.id))) && <p role="alert" className={styles.errorAlert}>{operationError || getDeleteError(users, confirmation.user.id)}</p>}
        </div>
        <div className={styles.dialogFooter}><button type="button" className={styles.outlineButton} onClick={() => { setConfirmation(null); setOperationError(''); }}>Batal</button><button type="button" disabled={Boolean(confirmation.user && getDeleteError(users, confirmation.user.id))} className={confirmation.type === 'restore' ? styles.primaryButton : styles.dangerButton} onClick={handleConfirm}>{confirmation.type === 'restore' ? 'Pulihkan data' : 'Hapus pengguna'}</button></div>
      </UserModal>}
    </section>
  );
}
