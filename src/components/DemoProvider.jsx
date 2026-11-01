/**
 * Modul: State sesi demo lintas halaman
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Sesi sementara hilang ketika browser dimuat ulang.
 */
'use client';
import { createContext, useContext, useState } from 'react';

const DemoContext = createContext(null);
const supportedRoles = ['student', 'teacher', 'admin'];

const defaultProfiles = {
  student: {
    id: 'student-demo',
    name: 'Siswa Contoh',
    email: 'siswa@titikterampil.id',
    role: 'student',
    level: 'SMA',
    grade: 12,
  },
  teacher: {
    id: 'teacher-demo',
    name: 'Pengajar Contoh',
    email: 'guru@titikterampil.id',
    role: 'teacher',
  },
  admin: {
    id: 'admin-demo',
    name: 'Admin Titik Terampil',
    email: 'admin@titikterampil.id',
    role: 'admin',
  },
};

let toastSequence = 0;
function createToastId() {
  toastSequence += 1;
  return `tt-toast-${toastSequence}`;
}

/**
 * Menyediakan sesi sementara bagi seluruh komponen frontend.
 * @param {Object} props - Properti provider.
 * @param {React.ReactNode} props.children - Konten yang membutuhkan sesi.
 * @returns {React.ReactElement} Provider sesi demo.
 */
export function DemoProvider({ children }) {
  // Pulihkan sesi dari storage jika ada agar tidak hilang saat browser dimuat ulang
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = sessionStorage.getItem('titikterampil_active_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [toasts, setToasts] = useState([]);

  /**
   * Menampilkan pesan notifikasi toast global.
   * @param {string} message - Pesan notifikasi.
   * @param {'success'|'error'|'info'} [type='info'] - Kategori toast.
   * @param {number} [duration=3000] - Lama tampil dalam milidetik.
   */
  function showToast(message, type = 'info', duration = 3000) {
    if (!message) return;
    const id = createToastId();
    setToasts((prev) => [...prev, { id, message, type, isExiting: false }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }

  /**
   * Menghapus toast dengan animasi keluar.
   * @param {string} id - ID notifikasi toast.
   */
  function removeToast(id) {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
  }

  /**
   * Mengaktifkan peran atau akun demo yang dipilih pengguna.
   * @param {string|Object} target - Peran ('student' | 'teacher' | 'admin') atau user lengkap.
   * @param {Object} [customData] - Data tambahan profil jika target berupa string peran.
   * @returns {boolean} True jika peran dikenali dan sesi diperbarui.
   */
  function signIn(target, customData = null) {
    const isObj = typeof target === 'object' && target !== null;
    const role = isObj ? target.role : target;

    if (!supportedRoles.includes(role)) return false;

    const active = isObj ? target : (customData || defaultProfiles[role]);
    setUser(active);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('titikterampil_active_session', JSON.stringify(active));
      }
    } catch {
      // Abaikan bila storage gagal
    }
    return true;
  }

  /**
   * Menghapus sesi demo aktif.
   * @returns {void} Memperbarui state tanpa menghapus data pembelajaran.
   */
  function signOut() {
    // 1. Kosongkan identitas agar guard menutup tampilan halaman peran.
    setUser(null);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('titikterampil_active_session');
      }
    } catch {
      // Abaikan bila storage gagal
    }
  }

  /**
   * Memperbarui profil pengguna aktif dalam sesi demo.
   * @param {Object} partial - Properti profil baru yang diperbarui.
   * @returns {boolean} True jika pembaruan berhasil.
   */
  function updateUser(partial) {
    if (!partial || typeof partial !== 'object') return false;
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('titikterampil_active_session', JSON.stringify(updated));
        }
      } catch {
        // Abaikan bila storage gagal
      }
      return updated;
    });
    return true;
  }

  // 2. TODO: Tambahkan status loading/error bila sesi kelak dibaca asinkron.
  // 3. Bagikan state dan operasi sesi melalui satu kontrak context.
  return (
    <DemoContext.Provider value={{ user, signIn, signOut, updateUser, showToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="toast-container" role="region" aria-label="Notifikasi sistem">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`toast toast-${toast.type || 'info'} ${toast.isExiting ? 'toast-exit' : 'toast-enter'}`}
              role={toast.type === 'error' ? 'alert' : 'status'}
            >
              <span>{toast.message}</span>
              <button
                type="button"
                className="toast-close-btn"
                onClick={() => removeToast(toast.id)}
                aria-label="Tutup notifikasi"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </DemoContext.Provider>
  );
}

/**
 * Membaca sesi demo dari provider terdekat.
 * @returns {Object} User aktif beserta fungsi signIn dan signOut.
 * @throws {Error} Jika komponen tidak berada dalam DemoProvider.
 */
export function useDemo() {
  // 1. Baca context milik root layout.
  const context = useContext(DemoContext);
  // 2. Beri pesan jelas bila provider belum dipasang.
  if (!context) throw new Error('useDemo harus digunakan di dalam DemoProvider.');
  // 3. TODO: Perbarui kontrak ini jika status loading/error ditambahkan.
  return context;
}

/**
 * Hook praktis untuk memanggil notifikasi toast pada modul apa pun.
 * @returns {(message: string, type?: 'success'|'error'|'info', duration?: number) => void} Fungsi showToast.
 */
export function useToast() {
  const { showToast } = useDemo();
  return showToast;
}
