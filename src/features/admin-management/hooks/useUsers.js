'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { adminApi, usersQuery } from '../api.js';

/**
 * Mengelola daftar, referensi akademik, serta mutasi tanpa sumber localStorage kedua.
 * @param {Object} filters - Filter pencarian pengguna.
 * @returns {Object} State dan operasi untuk halaman pengguna.
 */
export function useUsers(filters) {
  const query = usersQuery(filters);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedQuery, setLoadedQuery] = useState(null);
  const [error, setError] = useState('');
  const [academics, setAcademics] = useState([]);
  const [referenceError, setReferenceError] = useState('');
  const [referenceLoading, setReferenceLoading] = useState(true);
  const [referenceVersion, setReferenceVersion] = useState(0);
  const [pending, setPending] = useState(null);
  const [notice, setNotice] = useState('');
  const [mutationError, setMutationError] = useState('');
  const controller = useRef(null);
  const sequence = useRef(0);
  const busy = useRef(false);
  const alive = useRef(true);

  const fetchUsers = useCallback(() => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    const version = ++sequence.current;
    return adminApi.users(query, current.signal).then((data) => {
      if (!alive.current || version !== sequence.current || current.signal.aborted) return false;
      setUsers(data); setError(''); setLoadedQuery(query);
      return true;
    }).catch((failure) => {
      if (failure.name !== 'AbortError' && alive.current && version === sequence.current) {
        setError(failure.message); setLoadedQuery(query);
      }
      return false;
    }).finally(() => {
      if (alive.current && version === sequence.current && !current.signal.aborted) setLoading(false);
    });
  }, [query]);

  const reload = useCallback(() => {
    setLoading(true); setError('');
    return fetchUsers();
  }, [fetchUsers]);
  const latestReload = useRef(reload);
  useEffect(() => { latestReload.current = reload; }, [reload]);

  useEffect(() => {
    alive.current = true;
    void fetchUsers();
    return () => { controller.current?.abort(); alive.current = false; };
  }, [fetchUsers]);

  useEffect(() => {
    const referenceController = new AbortController();
    async function load() {
      setReferenceLoading(true);
      setReferenceError('');
      try {
        const data = await adminApi.academics(referenceController.signal);
        if (!referenceController.signal.aborted) setAcademics(data);
      } catch (failure) {
        if (!referenceController.signal.aborted) setReferenceError(failure.message);
      } finally {
        if (!referenceController.signal.aborted) setReferenceLoading(false);
      }
    }
    void load();
    return () => referenceController.abort();
  }, [referenceVersion]);

  /**
   * Mencegah submit ganda dan membedakan kegagalan mutasi dari refresh daftar.
   * @param {Function} action - Operasi API yang menulis data.
   * @param {Object} operation - Identitas tombol yang sedang bekerja.
   * @param {string} message - Pesan sukses dari operasi yang tersimpan.
   * @returns {Promise<boolean>} True hanya jika perubahan benar-benar diakui API.
   */
  async function mutate(action, operation, message) {
    if (busy.current) return false;
    busy.current = true;
    setPending(operation);
    setNotice('');
    setMutationError('');
    try {
      await action();
      if (!alive.current) return false;
      setNotice(message);
      const refreshed = await latestReload.current();
      if (alive.current && !refreshed) setNotice(`${message} Daftar belum dapat diperbarui; tekan Muat ulang daftar.`);
      return true;
    } catch (failure) {
      if (alive.current) setMutationError(failure.message);
      return false;
    } finally {
      busy.current = false;
      if (alive.current) setPending(null);
    }
  }

  return { users, loading: loading || loadedQuery !== query, error: loadedQuery === query ? error : '', academics, referenceError, referenceLoading, pending, notice, mutationError,
    reload, retryAcademics: () => setReferenceVersion((value) => value + 1),
    clearFeedback: () => { setNotice(''); setMutationError(''); },
    save: (body, id) => mutate(() => adminApi.save(body, id), { kind: 'save', id },
      id ? 'Perubahan pengguna tersimpan.' : 'Pengguna baru berhasil ditambahkan.'),
    member: (user) => mutate(() => adminApi.member(user.id, !user.isMember), { kind: 'member', id: user.id },
      `Status member ${user.name} berhasil ${user.isMember ? 'dicabut' : 'diaktifkan'}.`),
    remove: (user) => mutate(() => adminApi.remove(user.id), { kind: 'delete', id: user.id },
      `Pengguna ${user.name} berhasil dihapus.`),
  };
}
