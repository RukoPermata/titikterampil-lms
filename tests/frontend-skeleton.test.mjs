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

// Aturan P19 diuji terpisah dari React agar kegagalan validasi mudah dilacak.
const directory = await loadModule('src/features/academic/user-management.js');
const { demoUsers } = await loadModule('src/features/academic/data/demo-users.js');

test('email unik mengabaikan kapitalisasi, tetapi record yang diedit tidak dianggap duplikat', () => {
  const original = demoUsers[2];
  const duplicate = directory.validateUserForm({ ...original, email: original.email.toUpperCase() }, demoUsers);
  assert.ok(duplicate.errors.email);
  const editing = directory.validateUserForm({ ...original, email: original.email.toUpperCase() }, demoUsers, original.id);
  assert.deepEqual(editing.errors, {});
  assert.equal(editing.candidate.email, original.email);
});

test('form siswa menolak kelas lintas jenjang dan role pengajar membersihkan field akademik', () => {
  const form = { ...demoUsers[2], level: 'SD', grade: '12' };
  assert.ok(directory.validateUserForm(form, demoUsers, form.id).errors.grade);
  const teacher = directory.validateUserForm({ ...form, role: 'teacher' }, demoUsers, form.id);
  assert.deepEqual(teacher.errors, {});
  assert.equal(teacher.candidate.level, '');
  assert.equal(teacher.candidate.grade, null);
});

test('admin aktif terakhir tidak dapat dihapus, dinonaktifkan atau diganti peran', () => {
  const admin = demoUsers[0];
  assert.ok(directory.getDeleteError(demoUsers, admin.id));
  assert.ok(directory.validateUserForm({ ...admin, status: 'inactive' }, demoUsers, admin.id).errors.form);
  assert.ok(directory.validateUserForm({ ...admin, role: 'teacher' }, demoUsers, admin.id).errors.form);
  const withSecondAdmin = [...demoUsers, { ...admin, id: 'admin-2', email: 'second@example.com' }];
  assert.equal(directory.getDeleteError(withSecondAdmin, admin.id), null);
  assert.deepEqual(directory.validateUserForm({ ...admin, status: 'inactive' }, withSecondAdmin, admin.id).errors, {});
});

test('data storage rusak, identitas duplikat dan direktori tanpa admin ditolak', () => {
  assert.equal(directory.isValidUserList(demoUsers), true);
  assert.equal(directory.isValidUserList({ users: demoUsers }), false);
  assert.equal(directory.isValidUserList([...demoUsers, demoUsers[0]]), false);
  assert.equal(directory.isValidUserList(demoUsers.map((user) => ({ ...user, status: 'inactive' }))), false);
  assert.equal(directory.isValidUserList(demoUsers.map((user) => ({ ...user, createdAt: 'tanggal-rusak' }))), false);
});

test('pencarian dan filter P19 digabung tanpa mengubah urutan data sumber', () => {
  const before = structuredClone(demoUsers);
  const matches = directory.filterUsers(demoUsers, { query: 'CITRA', role: 'student', status: 'inactive' });
  assert.deepEqual(matches.map((user) => user.id), ['s-004']);
  assert.equal(directory.filterUsers(demoUsers, { query: 'tidak-ada' }).length, 0);
  const alphabetic = directory.filterUsers(demoUsers, { sort: 'name' });
  assert.equal(alphabetic[0].name, 'Aditya Pratama');
  assert.deepEqual(demoUsers, before);
});

test('penyimpanan P19 tetap stabil, tersinkron, dan tidak menganggap storage gagal sebagai sukses', (t) => {
  // Mock browser agar penyimpanan yang telah digabung dapat diuji tanpa mengubah data asli.
  const originalWindow = globalThis.window;
  let storedRaw = null;
  let failWrite = false;
  let notifications = 0;
  const browser = new EventTarget();
  browser.localStorage = {
    getItem: () => storedRaw,
    setItem: (key, value) => {
      if (failWrite) throw new Error('Storage penuh');
      storedRaw = value;
    },
  };
  globalThis.window = browser;
  t.after(() => {
    unsubscribe(); // Lepas listener sebelum mock window dipulihkan.
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  });
  const unsubscribe = directory.subscribeUserDirectory(() => { notifications += 1; });

  const initial = directory.readUserDirectory(demoUsers);
  assert.equal(initial.ready, true);
  assert.equal(initial.error, '');
  assert.strictEqual(directory.readUserDirectory(demoUsers), initial);

  const edited = demoUsers.map((user, index) => index === 1 ? { ...user, name: 'Pengajar Diperbarui' } : user);
  assert.equal(directory.persistUsers(edited).ok, true);
  assert.equal(notifications, 1);
  assert.equal(directory.readUserDirectory(demoUsers).users[1].name, 'Pengajar Diperbarui');

  const beforeFailure = storedRaw;
  failWrite = true;
  assert.equal(directory.persistUsers(demoUsers).ok, false);
  assert.equal(storedRaw, beforeFailure);
  assert.equal(notifications, 1);

  storedRaw = '{json-rusak';
  browser.dispatchEvent(new Event('tt:user-directory-changed'));
  const recovered = directory.readUserDirectory(demoUsers);
  assert.ok(recovered.error);
  assert.deepEqual(recovered.users, demoUsers);
  assert.equal(storedRaw, '{json-rusak'); // Pembacaan tidak menimpa data rusak diam-diam.
});
