/** Modul: Penanganan HTTP bersama agar semua endpoint memakai kontrak yang sama. */
import { MockApiError, ensure } from './errors.js';
import { readState } from './store.js';
import { filterRecords, validateParams } from './queries.js';
import { getRecord, createRecord, updateRecord, deleteRecord } from './resources.js';

/**
 * Membuat respons tanpa cache agar perubahan demo segera terlihat.
 * @param {Object} body - Isi JSON respons.
 * @param {number} status - Kode HTTP.
 * @returns {Response} Respons JSON.
 */
export function json(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

/**
 * Membungkus operasi agar error mempunyai format HTTP yang konsisten.
 * @param {Function} action - Operasi asinkron yang menghasilkan respons.
 * @returns {Promise<Response>} Respons sukses atau error.
 */
export async function respond(action) {
  try {
    return await action();
  } catch (error) {
    const status = error instanceof MockApiError ? error.status : 500;
    const message = error instanceof MockApiError ? error.message : 'Terjadi kesalahan pada mock API.';
    return json({ status: 'error', message }, status);
  }
}

/**
 * Membaca objek JSON, termasuk menangani JSON rusak dan body kosong.
 * @param {Request} request - Permintaan dengan JSON body.
 * @returns {Promise<Object>} Objek masukan.
 */
async function readBody(request) {
  ensure(request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() === 'application/json',
    'Gunakan Content-Type: application/json.', 415);
  let body;
  try {
    body = await request.json();
  } catch {
    throw new MockApiError(400, 'Body JSON tidak valid.');
  }
  ensure(body && typeof body === 'object' && !Array.isArray(body), 'Body harus objek JSON.');
  return body;
}

/**
 * Mengambil daftar resource, dengan kompatibilitas query id pada grading lama.
 * @param {string} collection - Nama resource.
 * @param {Request} request - Permintaan GET.
 * @returns {Promise<Response>} Daftar hasil filter atau satu submission.
 */
export function listResource(collection, request) {
  return respond(async () => {
    const params = new URL(request.url).searchParams;
    if (collection === 'grading' && params.has('id')) {
      validateParams(params, ['id']);
      return json({ status: 'success', data: await getRecord(collection, params.get('id').trim()) });
    }
    const state = await readState();
    const data = filterRecords(collection, state.collections[collection], params);
    return json({ status: 'success', count: data.length, data });
  });
}

/**
 * Mengambil satu resource dari parameter folder dinamis Next.js.
 * @param {string} collection - Nama resource.
 * @param {Request} request - Permintaan GET.
 * @param {Object} context - Konteks yang memuat params.
 * @returns {Promise<Response>} Detail atau HTTP 404.
 */
export function detailResource(collection, request, context) {
  return respond(async () => {
    validateParams(new URL(request.url).searchParams, []);
    const { id } = await context.params;
    return json({ status: 'success', data: await getRecord(collection, id) });
  });
}

/**
 * Menambahkan resource dan mengembalikan HTTP 201 setelah tersimpan.
 * @param {string} collection - Nama resource.
 * @param {Request} request - Permintaan POST.
 * @returns {Promise<Response>} Record baru atau error validasi.
 */
export function postResource(collection, request) {
  return respond(async () => {
    validateParams(new URL(request.url).searchParams, []);
    const data = await createRecord(collection, await readBody(request));
    return json({ status: 'success', data }, 201);
  });
}

/**
 * Menyimpan sebagian perubahan, termasuk perubahan member dan nilai esai.
 * @param {string} collection - Nama resource.
 * @param {Request} request - Permintaan PATCH.
 * @param {Object} context - Parameter route dinamis.
 * @returns {Promise<Response>} Record yang diperbarui.
 */
export function patchResource(collection, request, context) {
  return respond(async () => {
    validateParams(new URL(request.url).searchParams, []);
    const { id } = await context.params;
    const data = await updateRecord(collection, id, await readBody(request));
    return json({ status: 'success', data });
  });
}

/**
 * Menghapus resource setelah pemeriksaan relasi data.
 * @param {string} collection - Nama resource.
 * @param {Request} request - Permintaan DELETE.
 * @param {Object} context - Parameter route dinamis.
 * @returns {Promise<Response>} ID yang dihapus.
 */
export function removeResource(collection, request, context) {
  return respond(async () => {
    validateParams(new URL(request.url).searchParams, []);
    const { id } = await context.params;
    return json({ status: 'success', data: await deleteRecord(collection, id) });
  });
}
