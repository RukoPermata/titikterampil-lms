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

/**
 * Menyediakan sesi sementara bagi seluruh komponen frontend.
 * @param {Object} props - Properti provider.
 * @param {React.ReactNode} props.children - Konten yang membutuhkan sesi.
 * @returns {React.ReactElement} Provider sesi demo.
 */
export function DemoProvider({ children }) {
  // 1. Sesi hanya hidup dalam memori dan hilang ketika halaman dimuat ulang.
  const [user, setUser] = useState(null);

  /**
   * Mengaktifkan peran demo yang dipilih pengguna.
   * @param {string} role - student, teacher atau admin.
   * @returns {boolean} True jika peran demo dikenali dan sesi diperbarui.
   */
  function signIn(role) {
    // 1. Tolak nilai peran yang tidak dikenal sebelum mengubah sesi.
    if (!supportedRoles.includes(role)) return false;

    // 2. Bentuk identitas contoh; role ini belum berasal dari akun terverifikasi.
    setUser({ id: 'demo', name: 'Pengguna demo', role, level: 'SMA', grade: 12 });

    // 3. TODO: Pada tahap autentikasi berikutnya, baca identitas dari penyedia sesi.
    // 4. Kembalikan hasil agar pemanggil tidak menavigasi ketika peran ditolak.
    return true;
  }

  /**
   * Menghapus sesi demo aktif.
   * @returns {void} Memperbarui state tanpa menghapus data pembelajaran.
   */
  function signOut() {
    // 1. Kosongkan identitas agar guard menutup tampilan halaman peran.
    setUser(null);
    // 2. TODO: Cabut sesi penyedia autentikasi ketika backend diintegrasikan.
    // 3. TODO: Tentukan apakah draft CBT harus disimpan sebelum keluar.
  }

  // 2. TODO: Tambahkan status loading/error bila sesi kelak dibaca asinkron.
  // 3. Bagikan state dan operasi sesi melalui satu kontrak context.
  return (
    <DemoContext.Provider value={{ user, signIn, signOut }}>
      {children}
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
