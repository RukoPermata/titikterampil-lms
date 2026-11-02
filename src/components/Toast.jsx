/**
 * Modul: Sistem Notifikasi Toast Global Melayang
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: Menyediakan sistem notifikasi toast mengambang di pojok kanan atas
 * dengan animasi geser horizontal CSS murni dan auto-dismiss.
 */
'use client';
import { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

let toastSequence = 0;
function createToastId() {
  toastSequence += 1;
  return `tt-toast-${toastSequence}`;
}

/**
 * Provider notifikasi toast global yang membungkus komponen aplikasi.
 * @param {Object} props - Properti provider.
 * @param {React.ReactNode} props.children - Komponen anak.
 * @returns {React.ReactElement} Provider dan wadah toast mengambang.
 */
export function ToastProvider({ children }) {
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
   * Menghapus toast dengan animasi keluar horizontal.
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

  return (
    <ToastContext.Provider value={showToast}>
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
    </ToastContext.Provider>
  );
}

/**
 * Hook praktis untuk memicu notifikasi toast dari modul apa pun.
 * @returns {(message: string, type?: 'success'|'error'|'info', duration?: number) => void} Fungsi showToast.
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return () => {};
  }
  return context;
}
