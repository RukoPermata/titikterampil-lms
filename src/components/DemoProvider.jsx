/**
 * Modul: State sesi demo lintas halaman
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: Mengelola sesi autentikasi dan peran (Siswa, Pengajar, Admin) dengan persistensi storage.
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

/**
 * Menyediakan sesi pengguna demo bagi seluruh komponen frontend.
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
   * @returns {void}
   */
  function signOut() {
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

  return (
    <DemoContext.Provider value={{ user, signIn, signOut, updateUser }}>
      {children}
    </DemoContext.Provider>
  );
}

/**
 * Membaca sesi demo dari provider terdekat.
 * @returns {Object} User aktif beserta fungsi signIn, signOut, dan updateUser.
 * @throws {Error} Jika komponen tidak berada dalam DemoProvider.
 */
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo harus digunakan di dalam DemoProvider.');
  return context;
}
