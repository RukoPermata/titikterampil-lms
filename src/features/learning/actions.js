/**
 * Modul: Fungsi frontend learning
 * @author Fityah Bayoediansyah Harahap (103022400085)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Kembangkan fungsi sesuai kontrak data; status not_implemented tidak berarti operasi berhasil.
 */
/**
 * Menyiapkan daftar materi kelas.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {string} classId - ID kelas yang diikuti siswa.
 * @returns {Object} Kerangka daftar materi yang belum dimuat.
 */
export function getClassMaterials(classId) {
  // 1. Validasi identitas kelas.
  if (typeof classId !== 'string' || !classId.trim()) {
    return { status: 'error', message: 'ID kelas wajib diisi.' };
  }

  // 2. Siapkan kontrak materi teks, dokumen dan tautan video.
  const materials = [];

  // 3. TODO: Periksa kelas serta keanggotaan pengguna aktif.
  // 4. TODO: Baca materi dengan classId yang sama dan urutkan modulnya.
  // 5. TODO: Bedakan kelas kosong, kelas tidak ditemukan dan error pembacaan.
  return { status: 'not_implemented', classId, materials };
}

/**
 * Menyiapkan tambah atau perubahan materi pengajar.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {Object} material - Materi dengan classId, title, type dan content atau url.
 * @returns {Object} Kesalahan atau kandidat materi yang belum disimpan.
 */
export function saveMaterial(material) {
  // 1. Validasi relasi kelas dan judul awal.
  if (!material || typeof material.classId !== 'string' || !material.classId.trim() || typeof material.title !== 'string' || !material.title.trim()) {
    return { status: 'error', message: 'Kelas dan judul materi wajib diisi.' };
  }

  // 2. Pilih field yang dipakai oleh materi.
  const candidate = { id: material.id, classId: material.classId, title: material.title.trim(), type: material.type, content: material.content, url: material.url };

  // 3. TODO: Validasi tipe teks/dokumen/video, isi dan URL http/https.
  // 4. TODO: Periksa kelas milik pengajar lalu tentukan tambah atau edit dari ID.
  // 5. TODO: Simpan melalui adapter frontend dan perbarui daftar materi siswa.
  return { status: 'not_implemented', candidate, message: 'Materi belum disimpan.' };
}

/**
 * Menyiapkan pengumpulan jawaban tugas siswa.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {string} assignmentId - ID tugas yang dikerjakan.
 * @param {string} answer - Jawaban teks siswa.
 * @returns {Object} Kesalahan atau kandidat pengumpulan yang belum disimpan.
 */
export function submitAssignment(assignmentId, answer) {
  // 1. Validasi identitas tugas dan jawaban tidak kosong.
  if (typeof assignmentId !== 'string' || !assignmentId.trim() || typeof answer !== 'string' || !answer.trim()) {
    return { status: 'error', message: 'ID tugas dan jawaban wajib diisi.' };
  }

  // 2. Normalisasi jawaban tanpa mengubah data asal.
  const submission = { assignmentId, answer: answer.trim() };

  // 3. TODO: Periksa siswa, keanggotaan kelas, tenggat dan aturan revisi.
  // 4. TODO: Beri submissionId dan submittedAt lalu simpan jawaban.
  // 5. TODO: Sinkronkan pengumpulan ke daftar penilaian milik Hilmy.
  return { status: 'not_implemented', submission, message: 'Tugas belum dikumpulkan.' };
}
