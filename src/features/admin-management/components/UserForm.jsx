'use client';
import { useEffect, useRef, useState } from 'react';
import { roleLabels, userForm, validateUserForm } from '../validation.js';
import styles from './admin.module.css';

/**
 * Mengelola input tambah/edit dan mempertahankannya ketika API menolak penyimpanan.
 * @param {Object} props - Pengguna, referensi akademik, status, dan callback simpan.
 * @returns {React.ReactElement} Form pengguna yang mengikuti kontrak API.
 */
export function UserForm({ user, academics, referenceLoading, referenceError, retryAcademics, pending,
  currentUserId, onSave, onCancel }) {
  const [form, setForm] = useState(() => userForm(user));
  const [errors, setErrors] = useState({});
  const firstInput = useRef(null);
  const fields = useRef({});
  const isSelf = Boolean(user && user.id === currentUserId);
  const academic = academics.find((item) => item.level === form.level);
  const disabled = Boolean(pending) || referenceLoading || Boolean(referenceError);

  useEffect(() => { if (user) firstInput.current?.focus(); }, [user]);

  /**
   * Memperbarui input serta mengosongkan kelas jika jenjang/peran berubah.
   * @param {React.ChangeEvent} event - Perubahan input.
   * @returns {void} Memperbarui controlled form.
   */
  function change(event) {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value,
      ...(name === 'level' ? { grade: '' } : {}),
      ...(name === 'role' ? { level: '', grade: '', isMember: false } : {}) }));
    setErrors((previous) => ({ ...previous, [name]: '' }));
  }

  /**
   * Memeriksa form sebelum meneruskan penyimpanan ke API.
   * @param {React.FormEvent} event - Submit form.
   * @returns {Promise<void>} Mereset form hanya sesudah penyimpanan sukses.
   */
  async function submit(event) {
    event.preventDefault();
    if (disabled) return;
    const result = validateUserForm(form, academics);
    setErrors(result.errors);
    const firstError = Object.keys(result.errors)[0];
    if (firstError) { fields.current[firstError]?.focus(); return; }
    if (await onSave(result.payload, user?.id)) {
      setForm(userForm());
      setErrors({});
    }
  }

  /**
   * Membentuk input teks dengan pesan error yang terhubung secara aksesibel.
   * @param {string} name - Nama field.
   * @param {string} label - Label input.
   * @param {Object} options - Atribut input tambahan.
   * @returns {React.ReactElement} Label, input, dan validasi.
   */
  function textInput(name, label, options = {}) {
    return <div className={styles.field}>
      <label className={styles.label} htmlFor={`user-${name}`}>{label} <span aria-hidden="true">*</span></label>
      <input {...options} ref={(element) => { fields.current[name] = element; if (name === 'name') firstInput.current = element; }}
        className={styles.input} id={`user-${name}`} name={name} value={form[name]} onChange={change} required
        aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `user-${name}-error` : undefined} />
      {errors[name] && <p id={`user-${name}-error`} className={styles.fieldError}>{errors[name]}</p>}
    </div>;
  }

  return <section className={styles.panel} aria-labelledby="user-form-title">
    <h2 id="user-form-title">{user ? 'Edit pengguna' : 'Tambah pengguna'}</h2>
    <p className={styles.muted}>{user ? `Perbarui data ${user.name}.` : 'Lengkapi identitas dan peran pengguna baru.'} Kolom bertanda * wajib diisi.</p>
    {referenceLoading && <p role="status" className={styles.hint}>Memuat pilihan jenjang dan kelas…</p>}
    {referenceError && <div role="alert" className={`${styles.feedback} ${styles.error}`}>
      <p>Pilihan akademik belum tersedia. {referenceError}</p>
      <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={retryAcademics}>Coba muat pilihan lagi</button>
    </div>}
    <form onSubmit={submit} noValidate aria-busy={pending?.kind === 'save'}>
      <fieldset disabled={disabled}>
        <legend className="sr-only">Identitas pengguna</legend>
        {textInput('name', 'Nama lengkap', { autoComplete: 'name', minLength: 2, maxLength: 80 })}
        {textInput('email', 'Email', { type: 'email', autoComplete: 'email', maxLength: 254 })}
        {textInput('whatsapp', 'WhatsApp', { type: 'tel', autoComplete: 'tel', placeholder: '081234567890' })}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="user-role">Peran *</label>
          <select className={styles.input} id="user-role" name="role" value={form.role} onChange={change} disabled={disabled || isSelf}>
            {Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          {isSelf && <p className={styles.hint}>Peran akun yang sedang digunakan dipertahankan agar sesi tetap dapat diakses.</p>}
        </div>
        {form.role === 'student' && <>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="user-level">Jenjang *</label>
            <select ref={(element) => { fields.current.level = element; }} className={styles.input} id="user-level" name="level"
              value={form.level} onChange={change} required aria-invalid={Boolean(errors.level)} aria-describedby={errors.level ? 'user-level-error' : undefined}>
              <option value="">Pilih jenjang</option>
              {academics.map((item) => <option key={item.level} value={item.level}>{item.level === 'SMA' ? 'SMA/SMK dan Gap Year' : item.level}</option>)}
            </select>
            {errors.level && <p id="user-level-error" className={styles.fieldError}>{errors.level}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="user-grade">Kelas / kategori *</label>
            <select ref={(element) => { fields.current.grade = element; }} className={styles.input} id="user-grade" name="grade"
              value={form.grade} onChange={change} disabled={!academic || disabled} required
              aria-invalid={Boolean(errors.grade)} aria-describedby={errors.grade ? 'user-grade-error' : undefined}>
              <option value="">Pilih kelas / kategori</option>
              {academic?.grades.map((grade) => <option key={grade} value={String(grade)}>{typeof grade === 'number' ? `Kelas ${grade}` : grade}</option>)}
            </select>
            {errors.grade && <p id="user-grade-error" className={styles.fieldError}>{errors.grade}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.check}><input type="checkbox" name="isMember" checked={form.isMember} onChange={change} />Aktifkan status member</label>
          </div>
        </>}
        <div className={`${styles.actions} mt-6`}>
          <button className={styles.button} type="submit">{pending?.kind === 'save' ? 'Menyimpan…' : user ? 'Simpan perubahan' : 'Tambah pengguna'}</button>
          {user && <button className={`${styles.button} ${styles.secondary}`} type="button" onClick={onCancel}>Batal edit</button>}
        </div>
      </fieldset>
    </form>
  </section>;
}
