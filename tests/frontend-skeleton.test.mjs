/**
 * Modul: Verifikasi batas input skeleton frontend
 * @author Tim Titik Terampil; koordinator Kaisar dan Rayazka
 * Tanggung jawab: mencegah input tidak valid dan operasi belum selesai dianggap sukses.
 * @todo Tambahkan skenario persistence dan timer setelah fiturnya diimplementasikan.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

/**
 * Memuat modul frontend murni tanpa mengubah konfigurasi module aplikasi Next.js.
 * @param {string} relativePath - Lokasi modul terhadap root proyek.
 * @returns {Promise<Object>} Ekspor modul yang diuji.
 */
async function loadModule(relativePath) {
  // 1. Baca source ESM; file fungsi ini tidak memiliki import atau akses browser.
  const source = await readFile(new URL('../' + relativePath, import.meta.url), 'utf8');
  // 2. Gunakan URL data agar pengujian tidak bergantung pada type package root.
  return import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
}

const cbt = await loadModule('src/features/cbt/actions.js');
const academic = await loadModule('src/features/academic/actions.js');
const evaluation = await loadModule('src/features/evaluation/actions.js');
const management = await loadModule('src/features/tryout-management/actions.js');
const auth = await loadModule('src/features/auth/actions.js');

test('CBT menolak submit ganda, soal kosong, dan menilai attempt sekali', () => {
  const questions = [{
    id: 'q1',
    type: 'single_choice',
    weight: 1,
    correctIndex: 0,
    options: ['A', 'B'],
  }];
  assert.equal(cbt.submitAttempt({ id: 'a1', submittedAt: '2026-10-26T00:00:00Z' }, questions).status, 'error');
  assert.equal(cbt.submitAttempt({ id: 'a1' }, []).status, 'error');
  const submitted = cbt.submitAttempt({ id: 'a1', studentId: 's1', answers: { q1: 0 } }, questions);
  assert.equal(submitted.status, 'success');
  assert.equal(submitted.score, 100);
  assert.equal(submitted.attempt.status, 'submitted');
  assert.equal(cbt.submitAttempt(submitted.attempt, questions).status, 'error');
});

test('penempatan kelas menolak kelas lintas jenjang dan kelas duplikat', () => {
  assert.equal(academic.saveAcademicStructure({ level: 'SD', grades: [7] }).status, 'error');
  assert.equal(academic.saveAcademicStructure({ level: 'SMA', grades: [10, 10] }).status, 'error');
  assert.equal(academic.saveAcademicStructure({ level: 'SMP', grades: [7, 8, 9] }).status, 'not_implemented');
});

test('nilai nol sah sementara nilai di luar 0–100 dan NaN ditolak', () => {
  for (const score of [-1, 101, NaN]) {
    assert.equal(evaluation.gradeSubmission('s1', score, '').status, 'error');
  }
  for (const score of [0, 100]) {
    assert.equal(evaluation.gradeSubmission('s1', score, '').status, 'not_implemented');
  }
});

test('soal menolak kunci di luar opsi dan bobot tidak positif', () => {
  const question = { prompt: 'Soal', options: ['A', 'B'], correctIndex: 0, weight: 1 };
  assert.equal(management.saveQuestion({ ...question, correctIndex: 2 }).status, 'error');
  assert.equal(management.saveQuestion({ ...question, weight: 0 }).status, 'error');
  assert.equal(management.saveQuestion(question).status, 'success');
});

test('hasil skeleton pendaftaran tidak membocorkan password atau mengklaim validasi lengkap', () => {
  const result = auth.validateRegistration({ name: 'Siswa', password: 'contoh-rahasia' });
  assert.equal(result.valid, false);
  assert.equal(result.status, 'not_implemented');
  assert.ok(!JSON.stringify(result).includes('contoh-rahasia'));
});

test('filter kelas dari form cocok dengan data numerik tanpa mengubah sumber', () => {
  const packages = [{ id: 'sd', level: 'SD', grade: 6 }, { id: 'sma', level: 'SMA', grade: 12 }];
  const before = structuredClone(packages);
  assert.deepEqual(cbt.filterTryouts(packages, { level: 'SMA', grade: '12' }).map((item) => item.id), ['sma']);
  assert.deepEqual(packages, before);
  assert.deepEqual(cbt.filterTryouts(null), []);
});

test('autentikasi login memvalidasi email, kata sandi, dan menerima akun demo yang sah', () => {
  assert.equal(auth.authenticateUser(null).status, 'error');
  assert.equal(auth.authenticateUser({ email: 'salah-format' }).status, 'error');
  assert.equal(auth.authenticateUser({ email: 'unknown@email.com', password: '123' }).status, 'error');
  assert.equal(auth.authenticateUser({ email: 'siswa@titikterampil.id', password: 'salah' }).status, 'error');
  const success = auth.authenticateUser({ email: 'siswa@titikterampil.id', password: 'password123' });
  assert.equal(success.status, 'success');
  assert.equal(success.user.role, 'student');
});

test('updateProfile memvalidasi konsistensi jenjang dan tingkat kelas serta identitas profil', () => {
  assert.equal(auth.updateProfile(null).status, 'error');
  assert.equal(auth.updateProfile({ id: '' }).status, 'error');
  assert.equal(auth.updateProfile({ id: 's1', name: '' }).status, 'error');
  assert.equal(auth.updateProfile({ id: 's1', name: 'Budi', level: 'SD', grade: 9 }).status, 'error');
  assert.equal(auth.updateProfile({ id: 's1', name: 'Budi', level: 'SMP', grade: 12 }).status, 'error');
  assert.equal(auth.updateProfile({ id: 's1', name: 'Budi', level: 'SMA', grade: 6 }).status, 'error');

  const validUpdate = auth.updateProfile({ id: 'student-demo', name: 'Siswa Contoh Baru', level: 'SMA', grade: 12 });
  assert.equal(validUpdate.status, 'success');
  assert.equal(validUpdate.candidate.name, 'Siswa Contoh Baru');
  assert.equal(validUpdate.candidate.grade, 12);
});

test('getTeacherSummary memvalidasi ID pengajar dan mengagregasi data kelas pengajaran', () => {
  assert.equal(auth.getTeacherSummary(null).status, 'error');
  assert.equal(auth.getTeacherSummary('').status, 'error');

  const summaryResult = auth.getTeacherSummary('teacher-demo');
  assert.equal(summaryResult.status, 'success');
  assert.ok(summaryResult.summary.classCount >= 1);
  assert.ok(summaryResult.summary.studentCount >= 1);
  assert.ok(summaryResult.summary.assignmentCount >= 1);
});

test('validateRegistration memvalidasi panjang sandi minimal 8 karakter, keberadaan simbol, dan konfirmasi sandi', () => {
  // Kurang dari 8 karakter
  const shortPass = auth.validateRegistration({
    name: 'Siswa',
    email: 'siswa@titikterampil.id',
    password: 'p@ss',
    confirmPassword: 'p@ss',
    level: 'SMA',
    grade: 10,
  });
  assert.equal(shortPass.valid, false);
  assert.ok(shortPass.errors.some((err) => err.includes('8 karakter')));

  // Tidak ada simbol
  const noSymbolPass = auth.validateRegistration({
    name: 'Siswa',
    email: 'siswa@titikterampil.id',
    password: 'password123',
    confirmPassword: 'password123',
    level: 'SMA',
    grade: 10,
  });
  assert.equal(noSymbolPass.valid, false);
  assert.ok(noSymbolPass.errors.some((err) => err.includes('simbol')));

  // Konfirmasi tidak cocok
  const mismatchPass = auth.validateRegistration({
    name: 'Siswa',
    email: 'siswa@titikterampil.id',
    password: 'Password@123',
    confirmPassword: 'Password@Beda',
    level: 'SMA',
    grade: 10,
  });
  assert.equal(mismatchPass.valid, false);
  assert.ok(mismatchPass.errors.some((err) => err.includes('Konfirmasi kata sandi')));

  // Valid lengkap
  const validPass = auth.validateRegistration({
    name: 'Siswa Contoh',
    email: 'siswa@titikterampil.id',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    level: 'SMA',
    grade: 10,
  });
  assert.equal(validPass.valid, true);
  assert.equal(validPass.status, 'success');
});

test('validateRegistration memvalidasi nomor WhatsApp dan rentang jenjang baru (SD 4-6, Gap Year, Umum)', () => {
  // SD kelas 2 ditolak karena SD dimulai dari kelas 4
  const sdDua = auth.validateRegistration({
    name: 'Siswa SD',
    email: 'sd@titikterampil.id',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    whatsapp: '081234567890',
    level: 'SD',
    grade: 2,
  });
  assert.equal(sdDua.valid, false);

  // SD kelas 4 diterima
  const sdEmpat = auth.validateRegistration({
    name: 'Siswa SD',
    email: 'sd@titikterampil.id',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    whatsapp: '081234567890',
    level: 'SD',
    grade: 4,
  });
  assert.equal(sdEmpat.valid, true);
  assert.equal(sdEmpat.status, 'success');

  // SMA Gap Year diterima
  const gapYear = auth.validateRegistration({
    name: 'Siswa Gap Year',
    email: 'gap@titikterampil.id',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    whatsapp: '081234567890',
    level: 'SMA',
    grade: 'Gap Year',
  });
  assert.equal(gapYear.valid, true);
  assert.equal(gapYear.status, 'success');

  // WhatsApp tanpa awalan 08 atau 628 ditolak
  const badPrefixWa = auth.validateRegistration({
    name: 'Siswa',
    email: 'siswa@titikterampil.id',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    whatsapp: '12123123123',
    level: 'SMA',
    grade: 12,
  });
  assert.equal(badPrefixWa.valid, false);
  assert.ok(badPrefixWa.errors.some((err) => err.includes('08 atau 628')));

  // WhatsApp dengan awalan 628 diterima
  const goodPrefixWa = auth.validateRegistration({
    name: 'Siswa',
    email: 'siswa@titikterampil.id',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    whatsapp: '6281234567890',
    level: 'SMA',
    grade: 12,
  });
  assert.equal(goodPrefixWa.valid, true);
  assert.equal(goodPrefixWa.status, 'success');
});


// Fungsi validasi tetap diuji dari source halaman, tanpa membuat file logika tambahan.
// Blok data/validasi tidak mengandung JSX, React atau akses browser.
const pageSource = await readFile(new URL('../src/app/admin/users/page.jsx', import.meta.url), 'utf8');
const pureCrudCode = pageSource.split('// BAGIAN 1 — DATA DAN VALIDASI')[1].split('// BAGIAN 2 — HALAMAN DAN STATE REACT')[0];
const crud = await import('data:text/javascript;base64,' + Buffer.from(pureCrudCode + '\nexport { validateUser, isValidStoredUsers, INITIAL_USERS };').toString('base64'));

test('CRUD menolak email duplikat tetapi mengizinkan email sendiri saat edit', () => {
  const user = crud.INITIAL_USERS[2];
  assert.match(crud.validateUser({ ...user, email: user.email.toUpperCase() }, crud.INITIAL_USERS), /Email sudah/);
  assert.equal(crud.validateUser(user, crud.INITIAL_USERS, user.id), '');
});

test('CRUD memvalidasi jenjang dan kelas termasuk nilai jenjang tidak dikenal', () => {
  const user = crud.INITIAL_USERS[2];
  assert.match(crud.validateUser({ ...user, level: 'SD', grade: 12 }, []), /Jenjang/);
  assert.match(crud.validateUser({ ...user, level: '__proto__' }, []), /Jenjang/);
  assert.equal(crud.validateUser({ ...user, level: 'SMP', grade: 9 }, []), '');
});

test('CRUD melindungi admin aktif terakhir saat perubahan peran dan status', () => {
  const admin = crud.INITIAL_USERS[0];
  assert.match(crud.validateUser({ ...admin, status: 'inactive' }, crud.INITIAL_USERS, admin.id), /terakhir/);
  assert.match(crud.validateUser({ ...admin, role: 'teacher' }, crud.INITIAL_USERS, admin.id), /terakhir/);
  const withSecond = [...crud.INITIAL_USERS, { ...admin, id: 'a2', email: 'a2@example.com' }];
  assert.equal(crud.validateUser({ ...admin, status: 'inactive' }, withSecond, admin.id), '');
});

test('READ menolak storage rusak dan ID/email duplikat tanpa menghapus data sumber', () => {
  const users = structuredClone(crud.INITIAL_USERS);
  assert.equal(crud.isValidStoredUsers(users), true);
  assert.equal(crud.isValidStoredUsers({ users }), false);
  assert.equal(crud.isValidStoredUsers([...users, users[0]]), false);
  assert.equal(crud.isValidStoredUsers(users.filter((user) => user.role !== 'admin')), false);
  assert.equal(crud.isValidStoredUsers(users.map((user) => ({ ...user, createdAt: 'rusak' }))), false);
  assert.deepEqual(users, crud.INITIAL_USERS);
});

test('katalog CBT memfilter mapel dan pencarian tanpa mengubah data asal', () => {
  const packages = [
    { id: 'a', title: 'Tryout Matematika SMA', level: 'SMA', grade: 12, subject: 'Matematika' },
    { id: 'b', title: 'Latihan IPA SD', level: 'SD', grade: 6, subject: 'IPA' },
    { id: 'c', title: 'Pemahaman Bahasa SMP', level: 'SMP', grade: 9, subject: 'Bahasa Indonesia' },
  ];
  const before = structuredClone(packages);
  assert.deepEqual(cbt.filterTryouts(packages, { subject: 'matematika' }).map((item) => item.id), ['a']);
  assert.deepEqual(cbt.filterTryouts(packages, { query: 'ipa' }).map((item) => item.id), ['b']);
  assert.deepEqual(cbt.filterTryouts(packages, { level: 'SMP', grade: '9', subject: 'Bahasa Indonesia' }).map((item) => item.id), ['c']);
  assert.deepEqual(cbt.filterTryouts(packages, { query: 'tidak-ada' }), []);
  assert.deepEqual(packages, before);
});

test('voucher CBT memeriksa status, masa berlaku, kuota, dan cakupan paket', () => {
  const now = new Date('2026-11-01T10:00:00Z');
  const voucher = {
    code: 'TRYOUTGRATIS', status: 'Aktif', quota: 10, usedCount: 2,
    validUntil: '2026-12-31', applicablePackages: ['demo'],
  };
  assert.equal(cbt.validateVoucher(voucher, 'demo', now).status, 'success');
  assert.equal(cbt.validateVoucher({ ...voucher, status: 'Habis' }, 'demo', now).status, 'error');
  assert.equal(cbt.validateVoucher({ ...voucher, usedCount: 10 }, 'demo', now).status, 'error');
  assert.equal(cbt.validateVoucher({ ...voucher, validUntil: '2026-10-01' }, 'demo', now).status, 'error');
  assert.equal(cbt.validateVoucher({ ...voucher, applicablePackages: ['utbk-snbt'] }, 'demo', now).status, 'error');
  assert.equal(cbt.validateVoucher({ ...voucher, applicablePackages: ['all'] }, 'demo', now).status, 'success');
});

test('startAttempt membuat deadline tetap dari durasi paket', () => {
  const result = cbt.startAttempt(
    { id: 'demo', title: 'Tryout Demo', durationMinutes: 30, level: 'SMA', grade: 12 },
    { studentId: 's1', now: '2026-11-01T10:00:00Z' }
  );
  assert.equal(result.status, 'success');
  assert.equal(result.attempt.studentId, 's1');
  assert.equal(result.attempt.tryoutId, 'demo');
  assert.equal(result.attempt.deadline, '2026-11-01T10:30:00.000Z');
  assert.equal(cbt.computeRemainingMs(result.attempt.deadline, '2026-11-01T10:10:00Z'), 20 * 60 * 1000);
  assert.equal(cbt.formatClock(20 * 60 * 1000), '00:20:00');
  assert.equal(cbt.startAttempt('demo', {}).status, 'error');
  assert.equal(cbt.startAttempt({ id: 'demo', durationMinutes: 0 }, { studentId: 's1' }).status, 'error');
});

test('saveAnswer memvalidasi lima tipe soal dan menjaga attempt asal', () => {
  const base = { id: 'a1', studentId: 's1', tryoutId: 'demo', answers: {}, flaggedQuestionIds: [] };
  const single = { id: 'q1', type: 'single_choice', options: ['A', 'B'], correctIndex: 1 };
  const multiple = { id: 'q2', type: 'multiple_choice', options: ['A', 'B', 'C'], correctIndices: [0, 2] };
  const short = { id: 'q3', type: 'short_answer', correctAnswer: '12' };
  const essay = { id: 'q4', type: 'essay', maxScore: 20 };

  const singleResult = cbt.saveAnswer(base, single, 1);
  assert.equal(singleResult.status, 'success');
  assert.deepEqual(singleResult.attempt.answers, { q1: 1 });
  assert.deepEqual(base.answers, {});

  const multipleResult = cbt.saveAnswer(base, multiple, [2, 0, 0]);
  assert.equal(multipleResult.status, 'error');
  assert.deepEqual(cbt.saveAnswer(base, multiple, [2, 0]).value, [0, 2]);
  assert.deepEqual(cbt.saveAnswer(base, multiple, []).value, []);

  assert.equal(cbt.saveAnswer(base, short, '  12  ').value, '  12  ');
  assert.equal(cbt.saveAnswer(base, essay, 'Jawaban esai').status, 'success');
  assert.equal(cbt.saveAnswer(base, single, 5).status, 'error');
  assert.equal(cbt.saveAnswer({ ...base, submittedAt: '2026-11-01T00:00:00Z' }, single, 0).status, 'error');

  const flagged = cbt.toggleFlag(base, 'q1');
  assert.deepEqual(flagged.attempt.flaggedQuestionIds, ['q1']);
  assert.deepEqual(cbt.toggleFlag(flagged.attempt, 'q1').attempt.flaggedQuestionIds, []);
});

test('submitAttempt menilai objektif, menandai esai pending, dan idempoten', () => {
  const attempt = {
    id: 'a1', studentId: 's1', tryoutId: 'demo',
    startedAt: '2026-11-01T10:00:00Z',
    answers: { q1: 0, q2: [0, 2], q3: 0, q4: ' 12.0 ' },
    flaggedQuestionIds: ['q4'],
  };
  const questions = [
    { id: 'q1', type: 'single_choice', prompt: 'Satu', options: ['A', 'B'], correctIndex: 0, weight: 1, explanation: 'A benar.' },
    { id: 'q2', type: 'multiple_choice', prompt: 'Jamak', options: ['A', 'B', 'C'], correctIndices: [0, 2], weight: 2, explanation: 'A dan C.' },
    { id: 'q3', type: 'true_false', prompt: 'Benar salah', options: ['Benar', 'Salah'], correctIndex: 1, weight: 1, explanation: 'Salah.' },
    { id: 'q4', type: 'short_answer', prompt: 'Isian', correctAnswer: '12', weight: 1, explanation: '12.' },
    { id: 'q5', type: 'essay', prompt: 'Esai', maxScore: 20, explanation: 'Rubrik.' },
  ];
  const result = cbt.submitAttempt(attempt, questions, { now: '2026-11-01T10:10:00Z', reason: 'manual' });
  assert.equal(result.status, 'success');
  assert.equal(result.score, 80);
  assert.equal(result.attempt.status, 'submitted');
  assert.equal(result.attempt.gradingStatus, 'pending');
  assert.equal(result.summary.correct, 3);
  assert.equal(result.summary.wrong, 1);
  assert.equal(result.summary.pendingEssay, 1);
  assert.equal(result.summary.durationSeconds, 600);
  assert.equal(cbt.submitAttempt(result.attempt, questions).status, 'error');

  const review = cbt.getAttemptReview(result.attempt, questions);
  assert.equal(review.status, 'success');
  assert.equal(review.review.score, 80);
  assert.deepEqual(review.review.items.map((item) => item.status), ['correct', 'correct', 'wrong', 'correct', 'pending']);
  assert.equal(review.review.items[4].correctAnswer, null);
  assert.equal(cbt.getAttemptReview({ ...attempt, submittedAt: null }, questions).status, 'in_progress');
});

test('submitAttempt menghitung jawaban kosong dan total bobot nol', () => {
  const questions = [
    { id: 'q1', type: 'single_choice', prompt: 'Satu', options: ['A', 'B'], correctIndex: 0, weight: 1 },
    { id: 'q2', type: 'multiple_choice', prompt: 'Dua', options: ['A', 'B'], correctIndices: [0], weight: 1 },
  ];
  const empty = cbt.submitAttempt({ id: 'a1', studentId: 's1', startedAt: '2026-11-01T10:00:00Z', answers: {} }, questions);
  assert.equal(empty.status, 'success');
  assert.equal(empty.score, 0);
  assert.equal(empty.summary.empty, 2);

  const essayOnly = cbt.submitAttempt(
    { id: 'a2', studentId: 's1', startedAt: '2026-11-01T10:00:00Z', answers: { q1: 'Esai' } },
    [{ id: 'q1', type: 'essay', prompt: 'Esai', maxScore: 20 }]
  );
  assert.equal(essayOnly.score, null);
  assert.equal(essayOnly.summary.pendingEssay, 1);
});

test('getStudentHistory hanya mengambil attempt siswa dan mengurutkan terbaru', () => {
  const attempts = [
    { id: 'a1', studentId: 's1', startedAt: '2026-11-01T08:00:00Z', submittedAt: '2026-11-01T08:30:00Z' },
    { id: 'a2', studentId: 's1', startedAt: '2026-11-02T08:00:00Z', submittedAt: '2026-11-02T08:30:00Z' },
    { id: 'a3', studentId: 's2', startedAt: '2026-11-03T08:00:00Z', submittedAt: '2026-11-03T08:30:00Z' },
    { id: 'a4', studentId: 's1', startedAt: '2026-11-04T08:00:00Z', submittedAt: null },
  ];
  const result = cbt.getStudentHistory(attempts, 's1');
  assert.equal(result.status, 'success');
  assert.deepEqual(result.attempts.map((item) => item.id), ['a4', 'a2', 'a1']);
  assert.equal(result.summary.completed, 2);
  assert.equal(result.summary.active, 1);
  assert.equal(cbt.getStudentHistory([], '').status, 'error');
});

test('katalog CBT menyusun daftar tryout dari metadata paket yang tersedia', () => {
  assert.deepEqual(
    cbt.getPackageTryoutNames({
      title: 'Paket A',
      includedTryouts: ['Try Out 1', ' Try Out 2 ', ''],
    }),
    ['Try Out 1', 'Try Out 2']
  );
  assert.deepEqual(
    cbt.getPackageTryoutNames({
      title: 'Paket B',
      subtests: [{ title: 'Aljabar' }, { title: 'Geometri' }],
    }),
    ['Aljabar', 'Geometri']
  );
  assert.deepEqual(cbt.getPackageTryoutNames({ title: 'Paket C' }), ['Paket C']);
  assert.deepEqual(cbt.getPackageTryoutNames(null), []);
});

test('formatPrice menampilkan gratis dan rupiah tanpa desimal', () => {
  assert.equal(cbt.formatPrice(0), 'Gratis');
  assert.equal(cbt.formatPrice(-1), 'Gratis');
  assert.equal(cbt.formatPrice(Number.NaN), 'Gratis');
  assert.match(cbt.formatPrice(10000), /10\.000/);
});
