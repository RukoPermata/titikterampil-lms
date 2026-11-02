'use client';
import { useEffect, useRef, useState } from 'react';
import { useDemo } from '@/src/components/DemoProvider';
import { adminApi } from '../api.js';
import { useUsers } from '../hooks/useUsers.js';
import { UserFilters } from './UserFilters';
import { UserForm } from './UserForm';
import { UsersTable } from './UsersTable';
import styles from './admin.module.css';

const emptyFilters = { q: '', role: '', isMember: '' };

/** @returns {React.ReactElement} Manajemen pengguna dengan satu sumber data API. */
export function UsersManagement() {
  const { user: currentUser, updateUser } = useDemo();
  const [filters, setFilters] = useState(emptyFilters);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [formVersion, setFormVersion] = useState(0);
  const searchRef = useRef(null);
  const detailController = useRef(null);
  const directory = useUsers({ ...filters, q: search });
  const disabled = Boolean(directory.pending) || detailLoading;
  const hasFilters = Boolean(filters.q || filters.role || filters.isMember);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(filters.q), 300);
    return () => clearTimeout(timer);
  }, [filters.q]);
  useEffect(() => () => detailController.current?.abort(), []);

  /**
   * Memperbarui filter dan mengosongkan filter member untuk peran nonpeserta.
   * @param {string} key - Nama filter.
   * @param {string} value - Nilai input.
   * @returns {void} Memperbarui filter.
   */
  function changeFilter(key, value) {
    setFilters((previous) => ({ ...previous, [key]: value,
      ...(key === 'role' && value && value !== 'student' ? { isMember: '' } : {}) }));
  }

  /** @returns {void} Menghapus filter tanpa menunggu debounce pencarian. */
  function clearFilters() { setFilters(emptyFilters); setSearch(''); }

  /** @returns {void} Membatalkan pembacaan detail dan kembali ke form tambah. */
  function cancelEdit() {
    detailController.current?.abort();
    setDetailLoading(false); setDetailError(''); setEditing(null);
    setFormVersion((value) => value + 1);
    directory.clearFeedback();
  }

  /**
   * Memuat detail terkini sebelum pengguna mengedit data.
   * @param {Object} user - Baris pengguna yang dipilih.
   * @returns {Promise<void>} Mengisi form atau menampilkan kegagalan.
   */
  async function edit(user) {
    detailController.current?.abort();
    const controller = new AbortController();
    detailController.current = controller;
    setDetailLoading(true); setDetailError(''); directory.clearFeedback();
    try {
      const data = await adminApi.user(user.id, controller.signal);
      if (!controller.signal.aborted) { setEditing(data); setFormVersion((value) => value + 1); }
    } catch (failure) {
      if (!controller.signal.aborted) setDetailError(failure.message);
    } finally {
      if (!controller.signal.aborted) setDetailLoading(false);
    }
  }

  /**
   * Menyimpan form dan memperbarui nama akun aktif setelah diakui API.
   * @param {Object} body - Payload tervalidasi.
   * @param {string|undefined} id - ID jika sedang mengedit.
   * @returns {Promise<boolean>} True jika penyimpanan berhasil.
   */
  async function save(body, id) {
    const saved = await directory.save(body, id);
    if (saved) {
      if (id === currentUser?.id) updateUser(body);
      setEditing(null); setFormVersion((value) => value + 1);
    }
    return saved;
  }

  /**
   * Mengonfirmasi penghapusan lalu mengembalikan fokus setelah sukses.
   * @param {Object} user - Pengguna yang akan dihapus.
   * @returns {Promise<void>} Memproses hasil penghapusan.
   */
  async function remove(user) {
    if (user.id === currentUser?.id || disabled) return;
    if (!window.confirm(`Hapus pengguna ${user.name} (${user.email})? Tindakan ini menghapus data demo melalui API.`)) return;
    if (await directory.remove(user)) {
      if (editing?.id === user.id) { setEditing(null); setFormVersion((value) => value + 1); }
      searchRef.current?.focus();
    }
  }

  return <section className={styles.page} aria-labelledby="users-title">
    <header><h1 id="users-title">Manajemen pengguna</h1><p className={styles.intro}>Kelola identitas, peran, dan status member peserta Titik Terampil.</p></header>
    <UserFilters filters={filters} onChange={changeFilter} onClear={clearFilters} disabled={disabled} searchRef={searchRef} />
    <div role="status" aria-live="polite">{directory.notice && <p className={`${styles.feedback} ${styles.success}`}>{directory.notice}</p>}</div>
    {(directory.mutationError || detailError) && <p role="alert" className={`${styles.feedback} ${styles.error}`}>{directory.mutationError || detailError}</p>}
    {detailLoading && <p role="status" className={styles.hint}>Memuat detail pengguna terbaru…</p>}
    <div className={styles.layout}>
      <UserForm key={`${editing?.id || 'new'}-${formVersion}`} user={editing} academics={directory.academics}
        referenceLoading={directory.referenceLoading} referenceError={directory.referenceError} retryAcademics={directory.retryAcademics}
        pending={directory.pending || (detailLoading ? { kind: 'detail' } : null)} currentUserId={currentUser?.id} onSave={save} onCancel={cancelEdit} />
      <section className={styles.panel} aria-labelledby="users-list-title">
        <div className={styles.listHeading}><div><h2 id="users-list-title">Daftar pengguna</h2>
          <p className={styles.muted} role="status">{directory.loading ? 'Memperbarui daftar…' : directory.error ? 'Daftar belum berhasil diperbarui.' : `${directory.users.length} pengguna${hasFilters ? ' sesuai filter' : ''}`}</p>
        </div><button className={`${styles.button} ${styles.secondary}`} type="button" disabled={disabled || directory.loading} onClick={directory.reload}>Muat ulang daftar</button></div>
        {directory.error && <div role="alert" className={`${styles.feedback} ${styles.error}`}>
          <p>{directory.error} {directory.users.length > 0 && 'Data sebelumnya tetap ditampilkan.'}</p>
          <button className={`${styles.button} ${styles.secondary}`} type="button" disabled={disabled || directory.loading} onClick={directory.reload}>Coba muat daftar lagi</button>
        </div>}
        {(!directory.error || directory.users.length > 0) && <UsersTable users={directory.users} loading={directory.loading}
          disabled={disabled || Boolean(directory.error)} pending={directory.pending} currentUserId={currentUser?.id} editingId={editing?.id}
          hasFilters={hasFilters} onEdit={edit} onMember={directory.member} onDelete={remove} onClear={clearFilters} />}
      </section>
    </div>
  </section>;
}
