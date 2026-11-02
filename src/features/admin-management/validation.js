/** Modul: Normalisasi form pengguna. Keputusan penyimpanan tetap milik API. */
export const roleLabels = { student: 'Peserta', teacher: 'Pengajar', admin: 'Admin' };

/**
 * Membuat nilai awal form tanpa status akun atau password yang tak didukung API.
 * @param {Object|null} user - Pengguna untuk diedit, atau null untuk tambah.
 * @returns {Object} Nilai controlled input.
 */
export function userForm(user = null) {
  return { name: user?.name ?? '', email: user?.email ?? '', whatsapp: user?.whatsapp ?? '',
    role: user?.role ?? 'student', level: user?.level ?? '', grade: String(user?.grade ?? ''),
    isMember: user?.isMember === true };
}

/**
 * Memvalidasi input dan menyusun payload dengan tipe kelas sesuai referensi API.
 * @param {Object} form - Controlled input form.
 * @param {Object[]} academics - Pilihan akademik dari endpoint.
 * @returns {Object} errors per field dan payload siap kirim.
 */
export function validateUserForm(form, academics) {
  const errors = {};
  const payload = { name: form.name.trim(), email: form.email.trim().toLowerCase(),
    whatsapp: form.whatsapp.trim(), role: form.role, isMember: form.role === 'student' && form.isMember };
  if (payload.name.length < 2 || payload.name.length > 80) errors.name = 'Isi nama sepanjang 2–80 karakter.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) || payload.email.length > 254) errors.email = 'Isi alamat email yang valid.';
  if (!/^(?:08|628|\+628)\d{7,12}$/.test(payload.whatsapp)) errors.whatsapp = 'Gunakan nomor Indonesia berawalan 08, 628, atau +628.';
  if (!Object.hasOwn(roleLabels, payload.role)) errors.role = 'Pilih peran yang tersedia.';
  if (form.role === 'student') {
    const academic = academics.find((item) => item.level === form.level);
    if (!academic) errors.level = 'Pilih jenjang peserta.';
    const grade = academic?.grades.find((value) => String(value) === form.grade);
    if (grade === undefined) errors.grade = 'Pilih kelas yang sesuai dengan jenjang.';
    payload.level = form.level;
    payload.grade = grade;
  }
  return { errors, payload };
}
