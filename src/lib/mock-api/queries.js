/** Modul: Filter daftar dengan validasi parameter yang konsisten. */
import { ensure } from './errors.js';
import { academics } from '../../data/mock.js';
import { levels, roles, questionTypes, packageStatuses, transactionStatuses,
  voucherStatuses, gradingStatuses } from './validation.js';

const filters = {
  users: ['role', 'level', 'grade', 'isMember'],
  tryouts: ['level', 'grade', 'subject', 'status', 'isFree'],
  questions: ['tryoutId', 'type'],
  vouchers: ['status', 'code', 'tryoutId'],
  transactions: ['status', 'studentId', 'tryoutId'],
  grading: ['status'],
  classes: ['level', 'grade', 'teacherId'],
  assignments: ['classId'],
};
const textFields = {
  users: ['name', 'email', 'whatsapp'],
  tryouts: ['title', 'subject'],
  questions: ['prompt', 'explanation'],
  vouchers: ['code', 'title'],
  transactions: ['studentName', 'packageTitle', 'paymentMethod'],
  grading: ['studentName', 'packageName', 'essayPrompt'],
  classes: ['title'],
  assignments: ['title', 'instructions'],
};

/**
 * Menyamakan teks untuk pencarian dan perbandingan filter.
 * @param {unknown} value - Nilai yang akan dibandingkan.
 * @returns {string} Teks huruf kecil tanpa spasi luar.
 */
export function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

/**
 * Menolak parameter tak dikenal atau duplikat agar salah ketik tidak diabaikan.
 * @param {URLSearchParams} params - Query URL.
 * @param {string[]} allowed - Daftar nama parameter.
 * @returns {void} Melempar error bila kontrak query dilanggar.
 */
export function validateParams(params, allowed) {
  for (const key of params.keys()) {
    ensure(allowed.includes(key), `Parameter ${key} tidak didukung.${allowed.length ? ` Gunakan ${allowed.join(', ')}.` : ''}`);
    ensure(params.getAll(key).length === 1, `Parameter ${key} tidak boleh berulang.`);
  }
}

/**
 * Memeriksa pilihan filter enum yang dikenali resource.
 * @param {string} collection - Nama resource.
 * @param {URLSearchParams} params - Query URL.
 * @returns {void} Melempar error untuk filter yang tidak valid.
 */
function validateChoices(collection, params) {
  const statuses = { tryouts: packageStatuses, vouchers: voucherStatuses,
    transactions: transactionStatuses, grading: gradingStatuses };
  const choices = { role: roles, level: levels, type: questionTypes,
    status: statuses[collection], isMember: ['true', 'false'], isFree: ['true', 'false'] };
  for (const key of filters[collection]) {
    const value = normalize(params.get(key));
    if (value && choices[key]) {
      ensure(choices[key].some((choice) => normalize(choice) === value),
        `${key} harus salah satu dari ${choices[key].join(', ')}.`);
    }
  }
  const grade = params.get('grade')?.trim();
  if (grade) {
    const valid = academics.some((item) => item.grades.some((value) => normalize(value) === normalize(grade)));
    ensure(valid, 'grade tidak tersedia pada jenjang akademik.');
    const level = params.get('level')?.trim();
    if (level) ensure(academics.find((item) => normalize(item.level) === normalize(level))
      ?.grades.some((value) => normalize(value) === normalize(grade)), 'grade tidak sesuai dengan level.');
  }
}

/**
 * Menyaring koleksi dengan gabungan AND antarfilter dan OR antarfield pencarian.
 * @param {string} collection - Nama resource.
 * @param {Object[]} records - Daftar dari state terbaru.
 * @param {URLSearchParams} params - Query URL.
 * @returns {Object[]} Daftar hasil filter tanpa mengubah data awal.
 */
export function filterRecords(collection, records, params) {
  validateParams(params, ['q', ...filters[collection]]);
  validateChoices(collection, params);
  const query = normalize(params.get('q'));
  return records.filter((record) => {
    const matchesQuery = !query || textFields[collection].some((field) =>
      normalize(record[field]).includes(query));
    return matchesQuery && filters[collection].every((field) => {
      const value = normalize(params.get(field));
      if (!value) return true;
      if (collection === 'vouchers' && field === 'tryoutId') {
        return record.applicablePackages.includes('all') || record.applicablePackages.includes(params.get(field).trim());
      }
      if (field.endsWith('Id')) return record[field] === params.get(field).trim();
      return normalize(record[field]) === value;
    });
  });
}
