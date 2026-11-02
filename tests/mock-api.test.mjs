/** Modul: Pengujian kontrak HTTP dan persistensi mock API tanpa database. */
import { test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, unlink, rmdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { users } from '../src/data/mock.js';
import { listResource, detailResource, postResource, patchResource, removeResource } from '../src/lib/mock-api/handlers.js';
import { academicList, adminSummary, leaderboardList } from '../src/lib/mock-api/overview.js';

const testRoot = join(process.cwd(), '.next', 'cache');
await mkdir(testRoot, { recursive: true });
const temporary = await mkdtemp(join(testRoot, 'mock-api-tests-'));
const file = join(temporary, 'state.json');
const previousPath = process.env.TITIKTERAMPIL_MOCK_DATA_FILE;
process.env.TITIKTERAMPIL_MOCK_DATA_FILE = file;
const fixturesBefore = JSON.stringify(users);

beforeEach(async () => {
  await unlink(file).catch((error) => { if (error.code !== 'ENOENT') throw error; });
});

after(async () => {
  assert.equal(JSON.stringify(users), fixturesBefore, 'Fixture sumber tidak boleh termutasi.');
  await unlink(file).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  await rmdir(temporary);
  if (previousPath === undefined) delete process.env.TITIKTERAMPIL_MOCK_DATA_FILE;
  else process.env.TITIKTERAMPIL_MOCK_DATA_FILE = previousPath;
});

/**
 * Membuat permintaan standar untuk menguji handler HTTP.
 * @param {string} url - Path URL.
 * @param {string} method - Metode HTTP.
 * @param {Object} body - Body opsional.
 * @returns {Request} Permintaan lokal.
 */
function request(url, method = 'GET', body) {
  return new Request(`http://localhost${url}`, {
    method,
    ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  });
}

/**
 * Membuat konteks parameter dinamis sesuai kontrak route Next.js.
 * @param {string} id - ID record.
 * @returns {Object} Konteks dengan Promise params.
 */
function context(id) {
  return { params: Promise.resolve({ id }) };
}

/**
 * Menyediakan pengguna demo baru yang memenuhi kontrak.
 * @param {string} suffix - Pembeda email untuk tes.
 * @returns {Object} Body pembuatan pengguna.
 */
function student(suffix = 'baru') {
  return { name: 'Peserta Baru', email: `${suffix}@example.test`, whatsapp: '081234567891',
    role: 'student', level: 'SMA', grade: 12, isMember: false };
}

test('filter pengguna memakai AND dan parameter q yang benar', async () => {
  const all = await listResource('users', request('/api/users'));
  assert.equal(all.headers.get('cache-control'), 'no-store');
  assert.equal((await all.json()).count, 6);
  assert.equal((await (await listResource('users', request('/api/users?role=student'))).json()).count, 4);
  assert.equal((await (await listResource('users', request('/api/users?q=NADIA'))).json()).count, 1);
  assert.deepEqual((await (await listResource('users', request('/api/users?role=teacher&q=nadia'))).json()).data, []);
  for (const query of ['role=manager', 'isMember=yes', 'query=nadia', 'role=teacher&role=student', 'level=SD&grade=12']) {
    assert.equal((await listResource('users', request(`/api/users?${query}`))).status, 400, query);
  }
});

test('semua koleksi fixture dapat dibaca dan detail salah menghasilkan 404', async () => {
  for (const collection of ['users', 'tryouts', 'questions', 'vouchers', 'transactions', 'grading', 'classes', 'assignments']) {
    const response = await listResource(collection, request(`/api/${collection}`));
    const body = await response.json();
    assert.equal(response.status, 200, collection);
    assert.equal(body.count, body.data.length);
    assert.ok(body.count > 0);
    const detail = await detailResource(collection, request(`/api/${collection}/${body.data[0].id}`), context(body.data[0].id));
    assert.equal((await detail.json()).data.id, body.data[0].id);
    assert.equal((await detailResource(collection, request(`/api/${collection}/unknown`), context('unknown'))).status, 404);
  }
  assert.equal((await listResource('grading', request('/api/grading?id=unknown'))).status, 404);
  assert.equal((await (await listResource('grading', request('/api/grading?id=sub-01'))).json()).data.id, 'sub-01');
});

test('jenjang akademik dan leaderboard tidak mengalihkan filter salah ke SMA', async () => {
  assert.deepEqual((await (await academicList(request('/api/academics?level=sd'))).json()).data[0].grades, [4, 5, 6]);
  assert.equal((await academicList(request('/api/academics?level=kuliah'))).status, 400);
  assert.equal((await (await leaderboardList(request('/api/leaderboard?level=Umum&limit=1'))).json()).count, 1);
  assert.equal((await leaderboardList(request('/api/leaderboard?level=kuliah'))).status, 400);
  assert.equal((await leaderboardList(request('/api/leaderboard?limit=1.5'))).status, 400);
  assert.equal((await leaderboardList(request('/api/leaderboard?tryoutId=demo'))).status, 400);
});

test('CRUD pengguna tersimpan dan ringkasan mengikuti perubahan member', async () => {
  const created = await postResource('users', request('/api/users', 'POST', student()));
  assert.equal(created.status, 201);
  const user = (await created.json()).data;
  const update = await patchResource('users', request(`/api/users/${user.id}`, 'PATCH', { isMember: true }), context(user.id));
  assert.equal((await update.json()).data.isMember, true);
  const summary = (await (await adminSummary(request('/api/admin/summary'))).json()).data;
  assert.equal(summary.totalStudents, 5);
  assert.equal(summary.activeMembers, 3);
  assert.equal((await (await listResource('users', request('/api/users?q=baru%40example.test'))).json()).count, 1);
  assert.equal((await removeResource('users', request(`/api/users/${user.id}`, 'DELETE'), context(user.id))).status, 200);
  assert.equal((await detailResource('users', request(`/api/users/${user.id}`), context(user.id))).status, 404);
  assert.equal((await removeResource('users', request('/api/users/teacher-demo', 'DELETE'), context('teacher-demo'))).status, 409);
});

test('validasi body, email unik, kelas, dan perubahan ID', async () => {
  assert.equal((await postResource('users', request('/api/users', 'POST', { ...student(), email: 'SISWA@TITIKTERAMPIL.ID' }))).status, 409);
  assert.equal((await postResource('users', request('/api/users', 'POST', { ...student(), level: 'SD', grade: 12 }))).status, 400);
  assert.equal((await postResource('users', request('/api/users', 'POST', { ...student(), isMember: 'false' }))).status, 400);
  assert.equal((await patchResource('users', request('/api/users/student-demo', 'PATCH', { id: 'changed' }), context('student-demo'))).status, 400);
  assert.equal((await patchResource('users', request('/api/users/student-demo', 'PATCH', {}), context('student-demo'))).status, 400);
  assert.equal((await postResource('users', new Request('http://localhost/api/users', { method: 'POST', body: '{}' }))).status, 415);
  assert.equal((await postResource('users', new Request('http://localhost/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken' }))).status, 400);
});

test('nilai esai dibatasi bobot dan hasil tersimpan setelah diambil ulang', async () => {
  assert.equal((await patchResource('grading', request('/api/grading/sub-01', 'PATCH', { score: 21 }), context('sub-01'))).status, 400);
  assert.equal((await patchResource('grading', request('/api/grading/sub-01', 'PATCH', { score: -1 }), context('sub-01'))).status, 400);
  const saved = await patchResource('grading', request('/api/grading/sub-01', 'PATCH', { score: 18, feedback: 'Langkah sudah jelas.' }), context('sub-01'));
  assert.equal(saved.status, 200);
  const detail = (await (await detailResource('grading', request('/api/grading/sub-01'), context('sub-01'))).json()).data;
  assert.equal(detail.score, 18);
  assert.equal(detail.status, 'Selesai');
  assert.equal((await (await adminSummary(request('/api/admin/summary'))).json()).data.pendingEssays, 0);
});

test('pembayaran simulasi memperbarui pendapatan dari transaksi berhasil saja', async () => {
  const initial = (await (await adminSummary(request('/api/admin/summary'))).json()).data;
  assert.equal(initial.estimatedRevenue, 85000);
  assert.equal(initial.unclassifiedPackages, 7);
  assert.equal(initial.publishedPackages, 0);
  assert.equal((await patchResource('transactions', request('/api/transactions/trx-003', 'PATCH', { status: 'Berhasil' }), context('trx-003'))).status, 200);
  assert.equal((await (await adminSummary(request('/api/admin/summary'))).json()).data.estimatedRevenue, 110000);
  assert.equal((await patchResource('transactions', request('/api/transactions/trx-003', 'PATCH', { amount: -1 }), context('trx-003'))).status, 400);
});

test('paket, lima tipe soal, publikasi, dan relasi penghapusan divalidasi', async () => {
  const created = await postResource('tryouts', request('/api/tryouts', 'POST', {
    title: 'Paket Tes', subject: 'Matematika', level: 'SMA', grade: 12, durationMinutes: 10, questionCount: 1,
  }));
  assert.equal(created.status, 201);
  const id = (await created.json()).data.id;
  assert.equal((await patchResource('tryouts', request(`/api/tryouts/${id}`, 'PATCH', { status: 'Terbit' }), context(id))).status, 400);
  const question = await postResource('questions', request('/api/questions', 'POST', {
    tryoutId: id, prompt: 'Pilih jawaban benar.', options: ['A', 'B'], correctIndex: 0, explanation: 'A benar.',
  }));
  assert.equal(question.status, 201);
  const questionId = (await question.json()).data.id;
  assert.equal((await patchResource('tryouts', request(`/api/tryouts/${id}`, 'PATCH', { status: 'Terbit' }), context(id))).status, 200);
  assert.equal((await postResource('questions', request('/api/questions', 'POST', {
    tryoutId: id, prompt: 'Soal tambahan', options: ['A', 'B'], correctIndex: 0, explanation: 'A benar.',
  }))).status, 409);
  assert.equal((await patchResource('questions', request('/api/questions/q-single-1', 'PATCH', { tryoutId: id }), context('q-single-1'))).status, 409);
  assert.equal((await removeResource('questions', request(`/api/questions/${questionId}`, 'DELETE'), context(questionId))).status, 409);
  assert.equal((await removeResource('tryouts', request(`/api/tryouts/${id}`, 'DELETE'), context(id))).status, 409);
  const base = { tryoutId: 'demo', prompt: 'Soal tes', explanation: 'Pembahasan', weight: 1 };
  for (const answer of [
    { type: 'multiple_choice', options: ['A', 'B'], correctIndices: [0, 1] },
    { type: 'true_false', options: ['Benar', 'Salah'], correctIndex: 0 },
    { type: 'short_answer', correctAnswer: '12' },
    { type: 'essay', maxScore: 20 },
  ]) assert.equal((await postResource('questions', request('/api/questions', 'POST', { ...base, ...answer }))).status, 201);
  assert.equal((await postResource('questions', request('/api/questions', 'POST', { ...base, type: 'multiple_choice', options: ['A', 'B'], correctIndices: [0, 0] }))).status, 400);
});

test('voucher memeriksa tanggal kalender, paket, dan kode duplikat', async () => {
  const voucher = { code: 'TEST', title: 'Voucher tes', quota: 10, validUntil: '2026-12-31', applicablePackages: ['demo'] };
  assert.equal((await postResource('vouchers', request('/api/vouchers', 'POST', { ...voucher, validUntil: '2026-02-31' }))).status, 400);
  assert.equal((await postResource('vouchers', request('/api/vouchers', 'POST', { ...voucher, applicablePackages: ['unknown'] }))).status, 400);
  assert.equal((await postResource('vouchers', request('/api/vouchers', 'POST', { ...voucher, code: 'tryoutgratis' }))).status, 409);
  assert.equal((await postResource('vouchers', request('/api/vouchers', 'POST', voucher))).status, 201);
});

test('permintaan paralel tidak kehilangan perubahan dan proses baru membaca state sama', async () => {
  const responses = await Promise.all(Array.from({ length: 8 }, (_, i) =>
    postResource('users', request('/api/users', 'POST', student(`parallel-${i}`)))));
  assert.ok(responses.every((response) => response.status === 201));
  assert.equal((await (await listResource('users', request('/api/users'))).json()).count, 14);
  const storeUrl = pathToFileURL(join(process.cwd(), 'src/lib/mock-api/store.js')).href;
  const output = execFileSync(process.execPath, ['--input-type=module', '-e',
    `const {readState}=await import(${JSON.stringify(storeUrl)}); console.log((await readState()).collections.users.length);`],
  { encoding: 'utf8', env: process.env });
  assert.equal(output.trim(), '14');
  assert.equal(JSON.parse(await readFile(file, 'utf8')).collections.users.length, 14);
});

test('cache rusak tidak menghapus perubahan dengan mengembalikan fixture diam-diam', async () => {
  await writeFile(file, '{broken', 'utf8');
  assert.equal((await listResource('users', request('/api/users'))).status, 500);
  assert.equal((await readFile(file, 'utf8')), '{broken');
});

test('API melindungi admin terakhir dan relasi peran dari perubahan langsung', async () => {
  assert.equal((await removeResource('users', request('/api/users/admin-demo', 'DELETE'), context('admin-demo'))).status, 409);
  assert.equal((await patchResource('users', request('/api/users/admin-demo', 'PATCH', { role: 'teacher' }), context('admin-demo'))).status, 409);
  assert.equal((await patchResource('users', request('/api/users/teacher-demo', 'PATCH', { role: 'admin' }), context('teacher-demo'))).status, 409);
});

test('dua penghapusan admin paralel menyisakan tepat satu administrator', async () => {
  const created = await postResource('users', request('/api/users', 'POST', {
    name: 'Admin Kedua', email: 'admin2@example.test', whatsapp: '081234567892', role: 'admin',
  }));
  const secondId = (await created.json()).data.id;
  const results = await Promise.all(['admin-demo', secondId].map((id) =>
    removeResource('users', request(`/api/users/${id}`, 'DELETE'), context(id))));
  assert.deepEqual(results.map((response) => response.status).sort(), [200, 409]);
  const body = await (await listResource('users', request('/api/users?role=admin'))).json();
  assert.equal(body.count, 1);
});
