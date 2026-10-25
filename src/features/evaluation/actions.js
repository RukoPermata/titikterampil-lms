/**
 * Modul: Fungsi frontend tugas dan monitoring
 * @author Hilmy Rafi (103022400061)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Kembangkan fungsi sesuai kontrak data; status not_implemented tidak berarti operasi berhasil.
 */
/**
 * Menyiapkan tambah atau perubahan tugas pengajar.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {Object} assignment - Tugas dengan classId, title, instructions dan dueAt.
 * @returns {Object} Kesalahan atau kandidat tugas yang belum disimpan.
 */
export function saveAssignment(assignment) {
  // 1. Validasi kelas dan judul tugas.
  if (!assignment || typeof assignment.classId !== 'string' || !assignment.classId.trim() || typeof assignment.title !== 'string' || !assignment.title.trim()) {
    return { status: 'error', message: 'Kelas dan judul tugas wajib diisi.' };
  }

  // 2. Bentuk kandidat tugas sesuai kontrak modul pembelajaran.
  const candidate = { id: assignment.id, classId: assignment.classId, title: assignment.title.trim(), instructions: assignment.instructions, dueAt: assignment.dueAt };

  // 3. TODO: Validasi instruksi dan tenggat ISO serta kelas milik pengajar aktif.
  // 4. TODO: Tentukan tambah/edit dan simpan tugas melalui adapter frontend.
  // 5. TODO: Sinkronkan tugas ke kelas dan halaman pengumpulan milik Fityah.
  return { status: 'not_implemented', candidate, message: 'Tugas belum disimpan.' };
}

/**
 * Menyiapkan nilai dan umpan balik tugas siswa.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {string} submissionId - ID pengumpulan siswa.
 * @param {number} score - Nilai tugas pada rentang 0 sampai 100.
 * @param {string} feedback - Umpan balik dari pengajar.
 * @returns {Object} Kesalahan atau kandidat penilaian yang belum disimpan.
 */
export function gradeSubmission(submissionId, score, feedback) {
  // 1. Validasi identitas pengumpulan dan rentang nilai; nilai nol sah.
  if (typeof submissionId !== 'string' || !submissionId.trim() || !Number.isFinite(score) || score < 0 || score > 100 || typeof feedback !== 'string') {
    return { status: 'error', message: 'ID, nilai 0–100 dan teks umpan balik wajib valid.' };
  }

  // 2. Siapkan perubahan nilai dan normalisasi umpan balik.
  const grade = { submissionId, score, feedback: feedback.trim() };

  // 3. TODO: Cari pengumpulan beserta tugas dan kelas pengajarnya.
  // 4. TODO: Pastikan pengajar aktif berhak menilai lalu simpan gradedAt dan nilai.
  // 5. TODO: Sinkronkan nilai ke tampilan siswa serta monitoring kelas.
  return { status: 'not_implemented', grade, message: 'Nilai belum disimpan.' };
}

/**
 * Menyiapkan rekap hasil siswa pada kelas pengajar.
 * Validasi yang tersedia baru tahap awal; komentar TODO menandai aturan tersisa.
 * @param {string} teacherId - ID pengajar aktif.
 * @param {string} classId - ID kelas yang dipantau.
 * @returns {Object} Kerangka rekap yang belum dihitung.
 */
export function getStudentMonitoring(teacherId, classId) {
  // 1. Pastikan pengajar dan kelas ditentukan.
  if (typeof teacherId !== 'string' || !teacherId.trim() || typeof classId !== 'string' || !classId.trim()) {
    return { status: 'error', message: 'ID pengajar dan kelas wajib diisi.' };
  }

  // 2. Siapkan daftar rekap; jangan mengarang nilai siswa.
  const students = [];

  // 3. TODO: Pastikan kelas ditugaskan kepada pengajar tersebut.
  // 4. TODO: Gabungkan anggota kelas, hasil CBT Fauzan dan nilai tugas.
  // 5. TODO: Tandai belum mengikuti/belum dinilai terpisah dari nilai nol.
  // 6. TODO: Kembalikan rekap P17 dan data pendukung dashboard Kaisar.
  return { status: 'not_implemented', teacherId, classId, students };
}
