/**
 * Modul: Fungsi frontend auth
 * @author Kaisar Rayfa Al Baihaqqi (103022400110)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Kembangkan fungsi sesuai kontrak data; status not_implemented tidak berarti operasi berhasil.
 */
/**
 * Memeriksa kesiapan data pendaftaran siswa.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {Object} input - Nama, email, password, level dan grade dari form.
 * @returns {Object} Hasil validasi awal; valid tetap false selama aturan lengkap belum dibuat.
 */
export function validateRegistration(input) {
  // 1. Tolak input selain objek form.
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { status: 'error', valid: false, errors: ['Data pendaftaran wajib diisi.'] };
  }

  // 2. Normalisasi identitas tanpa mengembalikan atau menyimpan sandi.
  const candidate = { name: String(input.name ?? '').trim(), email: String(input.email ?? '').trim().toLowerCase(), level: input.level, grade: input.grade };

  // 3. TODO: Validasi field wajib, format email, sandi dan konsistensi jenjang/kelas.
  // 4. TODO: Periksa keunikan email terhadap sumber akun demo yang disepakati.
  // 5. Jangan menganggap normalisasi sebagai validasi yang sudah lengkap.
  return { status: 'not_implemented', valid: false, candidate, errors: ['Validasi pendaftaran lengkap belum tersedia.'] };
}

/**
 * Menyiapkan perubahan profil siswa.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {Object} profile - Profil dengan id, name, level dan grade.
 * @returns {Object} Kesalahan input atau kandidat perubahan yang belum disimpan.
 */
export function updateProfile(profile) {
  // 1. Pastikan identitas profil tersedia.
  if (!profile || typeof profile.id !== 'string' || !profile.id.trim()) {
    return { status: 'error', message: 'ID profil wajib diisi.' };
  }

  // 2. Ambil hanya field profil yang diizinkan, bukan sandi atau peran.
  const candidate = { id: profile.id, name: String(profile.name ?? '').trim(), level: profile.level, grade: profile.grade };

  // 3. TODO: Validasi nama dan pasangan jenjang/kelas.
  // 4. TODO: Simpan perubahan melalui adapter frontend; tangani storage gagal.
  // 5. TODO: Sinkronkan sesi dan tampilkan sukses hanya setelah penyimpanan berhasil.
  return { status: 'not_implemented', candidate, message: 'Profil belum disimpan.' };
}

/**
 * Menyiapkan ringkasan dashboard pengajar.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {string} teacherId - ID pengajar dari sesi demo aktif.
 * @returns {Object} Kerangka ringkasan yang belum dihitung.
 */
export function getTeacherSummary(teacherId) {
  // 1. Pastikan ringkasan diminta untuk pengajar tertentu.
  if (typeof teacherId !== 'string' || !teacherId.trim()) {
    return { status: 'error', message: 'ID pengajar wajib diisi.' };
  }

  // 2. Siapkan kontrak; null berarti belum dihitung, bukan nilai nol.
  const summary = { classCount: null, pendingSubmissionCount: null, studentCount: null };

  // 3. TODO: Ambil kelas pengajar dari data akademik Rayazka.
  // 4. TODO: Gunakan hasil monitoring Hilmy untuk menghitung tugas dan peserta.
  // 5. TODO: Tangani data kosong dan teruskan ringkasan ke dashboard P14.
  return { status: 'not_implemented', teacherId, summary };
}
