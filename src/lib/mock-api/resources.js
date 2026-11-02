/** Modul: Operasi CRUD terhadap state demo bersama. */
import { randomUUID } from 'node:crypto';
import { changeState, readState } from './store.js';
import { ensure } from './errors.js';
import { validateRecord } from './validation.js';

/**
 * Mencari record tanpa mengembalikan pengguna atau record pengganti.
 * @param {Object} state - State demo.
 * @param {string} collection - Nama resource.
 * @param {string} id - ID yang dicari.
 * @returns {Object} Record yang ditemukan.
 */
export function findRecord(state, collection, id) {
  const record = state.collections[collection].find((item) => item.id === id);
  ensure(Boolean(record), 'Data tidak ditemukan.', 404);
  return record;
}

/**
 * Membaca satu record dari penyimpanan terkini.
 * @param {string} collection - Nama resource.
 * @param {string} id - ID record.
 * @returns {Promise<Object>} Record yang ditemukan.
 */
export async function getRecord(collection, id) {
  return findRecord(await readState(), collection, id);
}

/**
 * Menetapkan nilai awal record baru tanpa mengubah fixture.
 * @param {string} collection - Nama resource.
 * @returns {Object} ID dan default khusus resource.
 */
function defaults(collection) {
  const values = {
    users: {},
    tryouts: { price: 0, isFree: true, questionCount: 0, status: 'Draf' },
    questions: { type: 'single_choice', weight: 1 },
    vouchers: { usedCount: 0, status: 'Aktif' },
    transactions: { status: 'Menunggu', date: new Date().toISOString() },
  };
  return { id: `${collection}-${randomUUID()}`, ...values[collection] };
}

/**
 * Memvalidasi kelengkapan bank soal ketika paket dinyatakan terbit.
 * @param {Object} record - Paket yang akan diterbitkan.
 * @param {Object} state - State demo.
 * @returns {void} Menolak publikasi paket yang belum lengkap.
 */
function validatePublication(record, state) {
  if (record.status !== 'Terbit') return;
  const questionCount = state.collections.questions.filter((item) => item.tryoutId === record.id).length;
  ensure(questionCount > 0 && questionCount === record.questionCount,
    'Paket terbit harus memiliki soal sesuai questionCount.');
}

/**
 * Membuat record dengan validasi di dalam lock penyimpanan.
 * @param {string} collection - Nama resource.
 * @param {Object} input - Body JSON.
 * @returns {Promise<Object>} Record baru yang tersimpan.
 */
export async function createRecord(collection, input) {
  return changeState((state) => {
    const record = validateRecord(collection, input, state, defaults(collection));
    if (collection === 'tryouts') validatePublication(record, state);
    if (collection === 'questions') validateQuestionPackage(state, record.tryoutId);
    state.collections[collection].push(record);
    return record;
  });
}

/**
 * Memperbarui record sambil mempertahankan ID serta field lain.
 * @param {string} collection - Nama resource.
 * @param {string} id - ID record yang diperbarui.
 * @param {Object} input - Field perubahan.
 * @returns {Promise<Object>} Record hasil pembaruan.
 */
export async function updateRecord(collection, id, input) {
  return changeState((state) => {
    const previous = findRecord(state, collection, id);
    const record = validateRecord(collection, input, state, previous);
    if (collection === 'users' && previous.role !== record.role) {
      validateUserTransition(state, previous);
      ensure(!state.collections.classes.some((item) => item.teacherId === id),
        'Pengajar masih ditugaskan pada kelas; ubah penugasan sebelum mengganti peran.', 409);
      ensure(!state.collections.transactions.some((item) => item.studentId === id),
        'Peserta masih dirujuk transaksi; perannya belum dapat diganti.', 409);
    }
    if (collection === 'tryouts') validatePublication(record, state);
    if (collection === 'questions') {
      validateQuestionPackage(state, previous.tryoutId);
      validateQuestionPackage(state, record.tryoutId);
    }
    const index = state.collections[collection].findIndex((item) => item.id === id);
    state.collections[collection][index] = record;
    return record;
  });
}

/**
 * Menghindari perubahan bank soal pada paket yang sedang terbit.
 * @param {Object} state - State demo.
 * @param {string} tryoutId - ID paket asal atau tujuan soal.
 * @returns {void} Melempar konflik jika paket masih terbit.
 */
function validateQuestionPackage(state, tryoutId) {
  const linked = state.collections.tryouts.find((item) => item.id === tryoutId);
  ensure(linked?.status !== 'Terbit', 'Arsipkan paket sebelum mengubah bank soalnya.', 409);
}

/**
 * Menolak penghapusan record yang masih dipakai resource lain.
 * @param {Object} state - State demo.
 * @param {string} collection - Nama resource.
 * @param {string} id - ID record.
 * @returns {void} Melempar konflik jika masih direferensikan.
 */
function validateDeletion(state, collection, id) {
  const data = state.collections;
  if (collection === 'users') {
    validateUserTransition(state, findRecord(state, collection, id));
    ensure(!data.classes.some((item) => item.teacherId === id) &&
      !data.transactions.some((item) => item.studentId === id), 'Pengguna masih dirujuk kelas atau transaksi.', 409);
  }
  if (collection === 'tryouts') {
    ensure(!data.questions.some((item) => item.tryoutId === id) &&
      !data.transactions.some((item) => item.tryoutId === id) &&
      !data.vouchers.some((item) => item.applicablePackages.includes(id)),
    'Paket masih dirujuk soal, transaksi, atau voucher.', 409);
  }
  if (collection === 'questions') {
    const question = findRecord(state, collection, id);
    validateQuestionPackage(state, question.tryoutId);
  }
}

/**
 * Menjaga minimal satu admin dalam state terkunci, termasuk mutasi paralel.
 * @param {Object} state - State terbaru di dalam lock penyimpanan.
 * @param {Object} previous - Pengguna yang akan dihapus atau berubah peran.
 * @returns {void} Melempar konflik jika admin terakhir akan hilang.
 */
function validateUserTransition(state, previous) {
  if (previous.role === 'admin') {
    ensure(state.collections.users.filter((user) => user.role === 'admin').length > 1,
      'Administrator terakhir tidak boleh dihapus atau diganti peran.', 409);
  }
}

/**
 * Menghapus record setelah hubungan data diperiksa.
 * @param {string} collection - Nama resource.
 * @param {string} id - ID record.
 * @returns {Promise<Object>} ID record yang berhasil dihapus.
 */
export async function deleteRecord(collection, id) {
  return changeState((state) => {
    findRecord(state, collection, id);
    validateDeletion(state, collection, id);
    state.collections[collection] = state.collections[collection].filter((item) => item.id !== id);
    return { id };
  });
}
