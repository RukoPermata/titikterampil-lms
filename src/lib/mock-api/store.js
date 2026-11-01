/** Modul: Penyimpanan demo bersama, terpisah dari fixture dan database produksi. */
import { mkdir, open, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import * as fixtures from '../../data/mock.js';
import { MockApiError } from './errors.js';

export const collectionNames = [
  'users', 'tryouts', 'questions', 'vouchers', 'transactions', 'grading',
  'classes', 'assignments',
];

/**
 * Menentukan lokasi state demo; tes dapat menggunakan direktori sementara.
 * @returns {string} Jalur JSON yang tidak masuk source control.
 */
function dataFile() {
  return process.env.TITIKTERAMPIL_MOCK_DATA_FILE ||
    join(process.cwd(), '.next', 'cache', 'mock-api', 'state.json');
}

/**
 * Menyalin data awal tanpa mengubah array pada mock.js.
 * @returns {Object} State demo baru.
 */
function initialState() {
  return structuredClone({
    version: 1,
    collections: Object.fromEntries(collectionNames.map((name) => [
      name, name === 'grading' ? fixtures.submissions : fixtures[name],
    ])),
  });
}

/**
 * Membaca state terbaru; cache rusak tidak diam-diam diganti data awal.
 * @returns {Promise<Object>} State tersimpan atau salinan fixture awal.
 */
export async function readState() {
  try {
    const state = JSON.parse(await readFile(dataFile(), 'utf8'));
    if (state.version !== 1 || !collectionNames.every((name) =>
      Array.isArray(state.collections?.[name]))) {
      throw new Error('Format state tidak cocok.');
    }
    return state;
  } catch (error) {
    if (error.code === 'ENOENT') return initialState();
    throw new MockApiError(500, 'Data demo tidak dapat dibaca. Periksa file cache mock API.');
  }
}

/**
 * Mengunci penulisan agar dua permintaan tidak menimpa perubahan satu sama lain.
 * @param {string} file - Jalur state yang dikunci.
 * @returns {Promise<Object>} Handle lock yang harus ditutup pemanggil.
 */
async function acquireLock(file) {
  await mkdir(dirname(file), { recursive: true });
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      return await open(`${file}.lock`, 'wx');
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }
  throw new MockApiError(503, 'Penyimpanan demo sedang sibuk. Coba kembali.');
}

/**
 * Membaca, mengubah, lalu menyimpan state secara atomik dalam satu lock.
 * @param {Function} change - Operasi sinkron terhadap state terkunci.
 * @returns {Promise<unknown>} Hasil operasi setelah penyimpanan sukses.
 */
export async function changeState(change) {
  const file = dataFile();
  let lock;
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    lock = await acquireLock(file);
    const state = await readState();
    const result = change(state);
    await writeFile(temporary, JSON.stringify(state, null, 2), 'utf8');
    await rename(temporary, file);
    return result;
  } catch (error) {
    if (error instanceof MockApiError) throw error;
    throw new MockApiError(500, 'Perubahan data demo gagal disimpan.', { cause: error });
  } finally {
    await unlink(temporary).catch(() => {});
    if (lock) {
      await lock.close();
      await unlink(`${file}.lock`);
    }
  }
}
