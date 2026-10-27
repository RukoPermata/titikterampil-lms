/**
 * Modul: Dialog aksesibel untuk tambah, edit dan hapus pengguna P19
 * @author Rayazka Aris (103022400096)
 * Tanggung jawab: focus trap native, Escape, label dialog dan penutupan.
 * @todo Gunakan komponen ini kembali bila pola dialog admin telah disepakati tim.
 */
'use client';
import { useEffect, useId, useRef } from 'react';
import { UserIcon } from './UserIcon';
import styles from './UserManagement.module.css';

/**
 * Membuka modal native: browser menangani focus trap dan memulihkan fokus pemicu.
 * @param {Object} props - title, description, children dan onDismiss.
 * @returns {React.ReactElement} Dialog yang hanya dipasang ketika terbuka.
 */
export function UserModal({ title, description, children, onDismiss }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  // showModal harus dipanggil setelah elemen terpasang, bukan saat render React.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId} aria-describedby={descriptionId} onClose={(event) => {
      // StrictMode dapat menutup lalu membuka kembali dialog saat pemeriksaan effect.
      // Abaikan event close lama jika dialog sudah terbuka lagi.
      if (!event.currentTarget.open) onDismiss();
    }}>
      <div className={styles.dialogHeading}>
        <div>
          <h2 id={titleId}>{title}</h2>
          <p id={descriptionId}>{description}</p>
        </div>
        <button type="button" className={styles.iconButton} aria-label="Tutup dialog" onClick={() => dialogRef.current.close()}><UserIcon name="close" /></button>
      </div>
      {children}
    </dialog>
  );
}
