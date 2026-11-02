/** Modul: Kontrak fetch admin, termasuk error API dan pembatalan permintaan. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAdminApi, usersQuery } from '../src/features/admin-management/api.js';

const user = { id: 'student-a', name: 'Peserta Tes', email: 'tes@example.test', whatsapp: '081234567890', role: 'student' };

test('query pengguna membuang filter kosong dan mengodekan karakter khusus', () => {
  const params = new URLSearchParams(usersQuery({ q: ' Tes & Baru ', role: 'student', isMember: false }));
  assert.equal(params.get('q'), 'Tes & Baru');
  assert.equal(params.get('isMember'), 'false');
  assert.equal(usersQuery({ q: ' ', role: '' }), '');
});

test('client membedakan daftar, detail, POST, PATCH, member, dan DELETE', async () => {
  const seen = [];
  const api = createAdminApi(async (path, options) => {
    seen.push({ path, ...options });
    return Response.json({ status: 'success', data: options.method === 'DELETE' ? { id: user.id } : path === '/api/users' && options.method === 'GET' ? [user] : user });
  });
  await api.users(''); await api.user(user.id); await api.save({ name: 'Baru' });
  await api.save({ name: 'Edit' }, user.id); await api.member(user.id, true); await api.remove(user.id);
  assert.deepEqual(seen.map((item) => item.method), ['GET', 'GET', 'POST', 'PATCH', 'PATCH', 'DELETE']);
  assert.equal(seen[2].headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(seen[4].body), { isMember: true });
  assert.ok(seen.every((item) => item.cache === 'no-store'));
});

test('client meneruskan pesan 409 dan menolak JSON serta bentuk data rusak', async () => {
  const conflict = createAdminApi(async () => Response.json({ status: 'error', message: 'Email sudah digunakan.' }, { status: 409 }));
  await assert.rejects(conflict.save({}), (error) => error.status === 409 && error.message === 'Email sudah digunakan.');
  const malformed = createAdminApi(async () => new Response('<html>gagal</html>'));
  await assert.rejects(malformed.users(''), /tidak dapat dibaca/);
  const wrongShape = createAdminApi(async () => Response.json({ status: 'success', data: [null] }));
  await assert.rejects(wrongShape.users(''), /Bentuk data/);
});

test('kegagalan jaringan mutasi tidak diklaim gagal tersimpan dan AbortError tetap dikenali', async () => {
  const offline = createAdminApi(async () => { throw new TypeError('offline'); });
  await assert.rejects(offline.users(''), /Tidak dapat terhubung/);
  await assert.rejects(offline.save({}), /belum dapat dipastikan/);
  const aborted = createAdminApi(async () => { throw new DOMException('dibatalkan', 'AbortError'); });
  await assert.rejects(aborted.users(''), (error) => error.name === 'AbortError');
});

test('client memeriksa respons akademik dan menolak ringkasan angka tidak valid', async () => {
  const academic = createAdminApi(async () => Response.json({ status: 'success', data: [{ level: 'SD', grades: [4, 5, 6] }] }));
  assert.equal((await academic.academics())[0].level, 'SD');
  const invalid = createAdminApi(async () => Response.json({ status: 'success', data: { totalUsers: -1 } }));
  await assert.rejects(invalid.summary(), /Bentuk data/);
});
