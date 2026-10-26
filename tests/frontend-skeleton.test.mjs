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

test('CBT menolak submit ganda dan soal kosong tanpa menghasilkan nilai', () => {
  const questions = [{ id: 'q1', weight: 1, correctIndex: 0, options: ['A', 'B'] }];
  assert.equal(cbt.submitAttempt({ id: 'a1', submittedAt: '2026-10-26T00:00:00Z' }, questions).status, 'error');
  assert.equal(cbt.submitAttempt({ id: 'a1' }, []).status, 'error');
  const unfinished = cbt.submitAttempt({ id: 'a1', answers: { q1: 0 } }, questions);
  assert.equal(unfinished.status, 'not_implemented');
  assert.equal(unfinished.score, null);
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
  assert.equal(management.saveQuestion(question).status, 'not_implemented');
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
