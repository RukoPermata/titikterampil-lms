/**
 * Modul: Penyimpanan lokal direktori pengguna P19
 * @author Rayazka Aris (103022400096)
 * Tanggung jawab: menyimpan perubahan demo, menangani data rusak dan sinkronisasi tab.
 * @todo Ganti repository localStorage dengan API; direktori ini belum terhubung ke autentikasi.
 */
'use client';
import { useSyncExternalStore } from 'react';
import { demoUsers } from './data/demo-users';
import { isValidUserList } from './user-management';

const STORAGE_KEY = 'titik-terampil:user-directory:v1';
const CHANGE_EVENT = 'tt:user-directory-changed';
const SERVER_SNAPSHOT = { users: demoUsers, ready: false, error: '' };
// React membandingkan snapshot dengan Object.is, sehingga objek ini harus stabil.
let cachedSnapshot = null;

/**
 * Membaca data browser satu kali hingga ada perubahan dari tab atau operasi CRUD.
 * @returns {Object} Snapshot users, ready dan error untuk useSyncExternalStore.
 */
function getSnapshot() {
  if (cachedSnapshot) return cachedSnapshot;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const saved = raw === null ? demoUsers : JSON.parse(raw);
    if (!isValidUserList(saved)) throw new Error('Invalid directory');
    cachedSnapshot = { users: saved, ready: true, error: '' };
  } catch {
    // Jangan otomatis menimpa data rusak: pengguna boleh memilih memulihkan contoh.
    cachedSnapshot = { users: demoUsers, ready: true, error: 'Data lokal tidak dapat dibaca. Daftar contoh ditampilkan sementara. Pulihkan data contoh atau periksa izin penyimpanan browser.' };
  }
  return cachedSnapshot;
}

/**
 * Menyediakan snapshot SSR agar HTML server dan render hidrasi pertama cocok.
 * @returns {Object} Data awal tanpa mengakses window pada server.
 */
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

/**
 * Menghubungkan React ke perubahan localStorage dan perubahan di tab yang sama.
 * @param {Function} listener - Callback notifikasi dari React.
 * @returns {Function} Cleanup seluruh listener saat komponen dilepas.
 */
function subscribe(listener) {
  /** @param {StorageEvent|Event} event - Notifikasi perubahan. @returns {void} */
  function handleChange(event) {
    if (event.type === 'storage' && event.key !== STORAGE_KEY && event.key !== null) return;
    cachedSnapshot = null;
    listener();
  }
  window.addEventListener('storage', handleChange);
  window.addEventListener(CHANGE_EVENT, handleChange);
  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener(CHANGE_EVENT, handleChange);
  };
}

/**
 * Hook pembaca direktori. React menangani hidrasi dan langganan perubahannya.
 * @returns {Object} users, ready dan pesan error storage jika ada.
 */
export function useUserDirectory() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Menulis seluruh direktori secara sinkron sebelum melaporkan sukses ke UI.
 * @param {Array<Object>} users - Daftar baru setelah operasi tambah/edit/hapus.
 * @returns {Object} ok dan error; kegagalan storage tidak dianggap berhasil.
 */
export function persistUsers(users) {
  if (!isValidUserList(users)) return { ok: false, error: 'Data pengguna tidak valid. Periksa kembali isian Anda.' };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    cachedSnapshot = { users, ready: true, error: '' };
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return { ok: true, error: '' };
  } catch {
    return { ok: false, error: 'Perubahan belum tersimpan. Izinkan penyimpanan browser atau kosongkan ruang penyimpanan, lalu coba lagi.' };
  }
}
