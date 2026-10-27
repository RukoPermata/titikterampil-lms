/**
 * Modul: Form tambah dan edit pengguna P19
 * @author Rayazka Aris (103022400096)
 * Tanggung jawab: form, dialog native, pilihan akademik dan pesan validasi.
 * @todo Hubungkan undangan/aktivasi akun ketika autentikasi backend tersedia.
 */
'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { createUserForm, GRADES_BY_LEVEL, ROLE_LABELS, STATUS_LABELS, validateUserForm } from '@/src/features/academic/user-management';
import styles from './users.module.css';

/**
 * Menampilkan satu form untuk mode tambah maupun edit.
 * @param {Object} props - user, users, onSave dan onDismiss.
 * @returns {React.ReactElement} Form dialog dengan error yang terhubung ke field.
 */
export function UserForm({ user, users, onSave, onDismiss }) {
  const [form, setForm] = useState(() => createUserForm(user));
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const formId = useId();
  const editing = Boolean(user);

  /**
   * Memperbarui input; ganti jenjang mereset kelas agar pilihan tidak tertinggal.
   * @param {React.ChangeEvent} event - Perubahan input/select.
   * @returns {void}
   */
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous, [name]: value,
      ...(name === 'level' ? { grade: '' } : {}),
      ...(name === 'role' ? { level: '', grade: '' } : {}),
    }));
    // Error akan diperiksa ulang saat submit, bukan memarahi setiap ketikan.
    setErrors((previous) => ({ ...previous, [name]: undefined, form: undefined, ...(name === 'role' ? { level: undefined, grade: undefined } : {}) }));
  }

  /**
   * Memvalidasi form, memfokuskan field salah, lalu meminta parent menyimpan data.
   * @param {React.FormEvent} event - Submit form.
   * @returns {void} Dialog hanya ditutup parent jika penyimpanan berhasil.
   */
  function handleSubmit(event) {
    event.preventDefault();
    const result = validateUserForm(form, users, user?.id ?? null);
    if (Object.keys(result.errors).length) {
      setErrors(result.errors);
      const firstField = Object.keys(result.errors).find((name) => name !== 'form');
      if (firstField) formRef.current.elements.namedItem(firstField)?.focus();
      return;
    }
    // Parent memeriksa ulang daftar terkini dan melaporkan kegagalan storage.
    const saveResult = onSave(result.candidate, user?.id ?? null);
    if (!saveResult.ok) setErrors({ form: saveResult.error });
  }

  /**
   * Menghasilkan atribut aksesibilitas yang konsisten untuk semua field.
   * @param {string} name - Nama field pada state dan objek errors.
   * @returns {Object} Atribut input berlabel beserta referensi pesan kesalahannya.
   */
  function fieldProps(name) {
    return { id: `${formId}-${name}`, name, value: form[name], onChange: handleChange, 'aria-labelledby': `${formId}-${name}-label`, 'aria-invalid': errors[name] ? true : undefined, 'aria-describedby': errors[name] ? `${formId}-${name}-error` : undefined };
  }

  /**
   * Menampilkan pesan field; pemisahan ini menghindari markup error berulang.
   * @param {string} name - Field yang diperiksa.
   * @returns {React.ReactElement|null} Pesan error ber-ID atau null.
   */
  function fieldError(name) {
    return errors[name] ? <span id={`${formId}-${name}-error`} className={styles.fieldError}>{errors[name]}</span> : null;
  }

  return (
    <UserModal title={editing ? 'Edit pengguna' : 'Tambah pengguna'} description={editing ? 'Perbarui identitas dan akses pengguna.' : 'Lengkapi identitas dan tentukan peran pengguna.'} onDismiss={onDismiss}>
      <form ref={formRef} onSubmit={handleSubmit} noValidate className={styles.form}>
        {/* noValidate menyerahkan pesan validasi kepada React, bukan popup browser. */}
        {errors.form && <div role="alert" className={styles.errorAlert}>{errors.form}</div>}
        <label className={styles.field} htmlFor={`${formId}-name`}><span id={`${formId}-name-label`}>Nama lengkap</span>
          <input {...fieldProps('name')} type="text" autoComplete="name" maxLength={80} required placeholder="Contoh: Alya Safitri" />{fieldError('name')}
        </label>
        <label className={styles.field} htmlFor={`${formId}-email`}><span id={`${formId}-email-label`}>Email</span>
          <input {...fieldProps('email')} type="email" autoComplete="email" maxLength={254} required placeholder="nama@example.com" />{fieldError('email')}
        </label>
        <div className={styles.formGrid}>
          <label className={styles.field} htmlFor={`${formId}-role`}><span id={`${formId}-role-label`}>Peran</span>
            <select {...fieldProps('role')} required>{Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{fieldError('role')}
          </label>
          <label className={styles.field} htmlFor={`${formId}-status`}><span id={`${formId}-status-label`}>Status</span>
            <select {...fieldProps('status')} required>{Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{fieldError('status')}
          </label>
        </div>
        {form.role === 'student' && (
          <fieldset className={styles.academicFields}>
            <legend>Informasi akademik</legend>
            <div className={styles.formGrid}>
              <label className={styles.field} htmlFor={`${formId}-level`}><span id={`${formId}-level-label`}>Jenjang</span>
                <select {...fieldProps('level')} required><option value="">Pilih jenjang</option>{Object.keys(GRADES_BY_LEVEL).map((level) => <option key={level} value={level}>{level}</option>)}</select>{fieldError('level')}
              </label>
              <label className={styles.field} htmlFor={`${formId}-grade`}><span id={`${formId}-grade-label`}>Kelas</span>
                <select {...fieldProps('grade')} required disabled={!form.level}><option value="">Pilih kelas</option>{(GRADES_BY_LEVEL[form.level] ?? []).map((grade) => <option key={grade} value={grade}>Kelas {grade}</option>)}</select>{fieldError('grade')}
              </label>
            </div>
          </fieldset>
        )}
        <p className={styles.formNote}>Data disimpan di browser ini. Form ini belum membuat kredensial atau mengirim undangan akun.</p>
        <div className={styles.dialogFooter}>
          <button type="button" className={styles.outlineButton} onClick={onDismiss}>Batal</button>
          <button type="submit" className={styles.primaryButton}>{editing ? 'Simpan perubahan' : 'Tambah pengguna'}</button>
        </div>
      </form>
    </UserModal>
  );
}

// BAGIAN 2 — Pembungkus dialog bersama untuk form dan konfirmasi hapus.
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
        <button type="button" className={styles.iconButton} aria-label="Tutup dialog" onClick={() => dialogRef.current.close()}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
      </div>
      {children}
    </dialog>
  );
}
