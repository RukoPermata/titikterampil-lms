/**
 * Modul: Fungsi frontend academic
 * @author Rayazka Aris (103022400096)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Kembangkan fungsi sesuai kontrak data; status not_implemented tidak berarti operasi berhasil.
 */
/**
 * Menyiapkan tambah atau perubahan akun demo.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {Object} user - Data akun dengan name, email, role dan profil akademik bila siswa.
 * @returns {Object} Kesalahan atau kandidat akun yang belum disimpan.
 */
export function saveUser(user) {
  // 1. Validasi nama dan peran yang didukung.
  if (!user || typeof user.name !== 'string' || !user.name.trim() || !['student', 'teacher', 'admin'].includes(user.role)) {
    return { status: 'error', message: 'Nama dan peran pengguna tidak valid.' };
  }

  // 2. Ambil field akun yang diizinkan; jangan salin sandi ke hasil fungsi.
  const candidate = { id: user.id, name: user.name.trim(), email: String(user.email ?? '').trim().toLowerCase(), role: user.role, level: user.level, grade: user.grade };

  // 3. TODO: Validasi email unik dan jenjang/kelas khusus akun siswa.
  // 4. TODO: Bedakan operasi tambah/edit dan simpan melalui adapter frontend.
  // 5. TODO: Perbarui daftar pengguna dan periksa relasi sebelum penghapusan.
  return { status: 'not_implemented', candidate, message: 'Pengguna belum disimpan.' };
}

/**
 * Menyiapkan konfigurasi akademik multi-jenjang.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {Object} structure - Konfigurasi level, grades dan daftar mata pelajaran.
 * @returns {Object} Kesalahan atau kandidat struktur akademik yang belum disimpan.
 */
export function saveAcademicStructure(structure) {
  // 1. Periksa jenjang dan bentuk daftar kelas.
  const allowedGrades = { SD: [1,2,3,4,5,6], SMP: [7,8,9], SMA: [10,11,12] };
  if (!structure || !Object.hasOwn(allowedGrades, structure.level) || !Array.isArray(structure.grades) || structure.grades.length === 0) {
    return { status: 'error', message: 'Jenjang dan daftar kelas wajib valid.' };
  }

  // 2. Tolak kelas di luar rentang jenjang atau kelas duplikat.
  if (structure.grades.some((grade) => !allowedGrades[structure.level].includes(grade)) || new Set(structure.grades).size !== structure.grades.length) {
    return { status: 'error', message: 'Tingkat kelas tidak sesuai jenjang atau duplikat.' };
  }

  // 3. Siapkan salinan agar array asal tidak dimodifikasi.
  const candidate = { level: structure.level, grades: [...structure.grades], subjects: structure.subjects ?? [] };

  // 4. TODO: Validasi ID dan nama mapel serta referensi kelas yang menggunakannya.
  // 5. TODO: Simpan konfigurasi dan sinkronkan filter di modul lain.
  return { status: 'not_implemented', candidate, message: 'Konfigurasi belum disimpan.' };
}

/**
 * Menyiapkan penempatan siswa dan pengajar ke kelas.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {string} classId - ID kelas tujuan.
 * @param {Array<string>} studentIds - Daftar ID siswa yang dipilih.
 * @param {string} teacherId - ID pengajar penanggung jawab.
 * @returns {Object} Kesalahan atau kandidat keanggotaan yang belum disimpan.
 */
export function assignClassMembers(classId, studentIds, teacherId) {
  // 1. Periksa identitas kelas, pengajar dan bentuk daftar siswa.
  if (typeof classId !== 'string' || !classId.trim() || typeof teacherId !== 'string' || !teacherId.trim() || !Array.isArray(studentIds) || studentIds.some((id) => typeof id !== 'string' || !id.trim())) {
    return { status: 'error', message: 'Identitas kelas, pengajar atau siswa tidak valid.' };
  }

  // 2. Hilangkan ID siswa yang berulang.
  const membership = { classId, teacherId, studentIds: [...new Set(studentIds)] };

  // 3. TODO: Pastikan kelas dan akun tersedia serta peran akun sesuai.
  // 4. TODO: Cocokkan jenjang/tingkat kelas setiap siswa dengan kelas tujuan.
  // 5. TODO: Simpan relasi dan sinkronkan daftar kelas siswa/pengajar.
  return { status: 'not_implemented', membership, message: 'Keanggotaan belum disimpan.' };
}
