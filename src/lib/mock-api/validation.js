/** Modul: Validasi kontrak data yang dipakai bersama oleh operasi mock API. */
import { academics } from '../../data/mock.js';
import { ensure } from './errors.js';

export const roles = ['student', 'teacher', 'admin'];
export const levels = academics.map((item) => item.level);
export const questionTypes = [
  'single_choice', 'multiple_choice', 'true_false', 'short_answer', 'essay',
];
export const packageStatuses = ['Draf', 'Terbit', 'Arsip'];
export const transactionStatuses = ['Menunggu', 'Berhasil', 'Gagal', 'Kedaluwarsa'];
export const gradingStatuses = ['Perlu Dinilai', 'Selesai'];
export const voucherStatuses = ['Aktif', 'Habis', 'Nonaktif'];

const fields = {
  users: ['name', 'email', 'whatsapp', 'role', 'level', 'grade', 'isMember', 'readiness', 'studyTargets'],
  tryouts: ['title', 'level', 'grade', 'subject', 'durationMinutes', 'price', 'isFree', 'questionCount', 'subtests', 'status', 'maxAttempts', 'autoAdvance', 'noReturn'],
  questions: ['tryoutId', 'type', 'prompt', 'options', 'correctIndex', 'correctIndices', 'correctAnswer', 'weight', 'maxScore', 'rubric', 'explanation', 'image'],
  vouchers: ['code', 'title', 'quota', 'usedCount', 'validUntil', 'applicablePackages', 'status'],
  transactions: ['studentId', 'tryoutId', 'studentName', 'packageTitle', 'amount', 'paymentMethod', 'status', 'date'],
  grading: ['score', 'feedback'],
};

/**
 * Memeriksa angka tanpa menerima string, null, NaN, atau nilai negatif.
 * @param {unknown} value - Nilai masukan.
 * @param {string} field - Nama field.
 * @param {number} minimum - Batas minimum.
 * @param {boolean} integer - Apakah harus bilangan bulat.
 * @returns {void} Melempar error bila tidak valid.
 */
export function numberField(value, field, minimum = 0, integer = false) {
  ensure(typeof value === 'number' && Number.isFinite(value) && value >= minimum &&
    (!integer || Number.isInteger(value)), `${field} harus berupa angka ${integer ? 'bulat ' : ''}minimal ${minimum}.`);
}

/**
 * Memeriksa teks yang wajib diisi.
 * @param {unknown} value - Nilai field.
 * @param {string} field - Nama field.
 * @returns {void} Melempar error bila kosong atau bukan string.
 */
export function textField(value, field) {
  ensure(typeof value === 'string' && value.trim().length > 0,
    `${field} wajib berupa teks yang tidak kosong.`);
}

/**
 * Memastikan jenjang serta kelas merupakan pasangan yang disediakan fixture.
 * @param {Object} record - Record dengan level dan grade.
 * @returns {void} Melempar error bila tidak sesuai.
 */
export function academicFields(record) {
  const academic = academics.find((item) => item.level === record.level);
  ensure(Boolean(academic), `level harus salah satu dari ${levels.join(', ')}.`);
  ensure(academic.grades.includes(record.grade), 'grade tidak sesuai dengan level. Gunakan angka untuk kelas numerik.');
}

/**
 * Memvalidasi akun serta keunikan email terhadap state terbaru.
 * @param {Object} record - Pengguna kandidat.
 * @param {Object} state - State demo.
 * @returns {void} Memvalidasi dan menormalkan akun kandidat.
 */
function validateUser(record, state) {
  ['name', 'email', 'whatsapp', 'role'].forEach((key) => textField(record[key], key));
  record.email = record.email.toLowerCase();
  ensure(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email), 'Format email tidak valid.');
  ensure(/^(?:08|628|\+628)\d{7,12}$/.test(record.whatsapp), 'whatsapp harus nomor Indonesia yang valid.');
  ensure(roles.includes(record.role), 'role harus student, teacher, atau admin.');
  ensure(!state.collections.users.some((user) => user.id !== record.id &&
    user.email.toLowerCase() === record.email), 'Email sudah digunakan.', 409);
  if (record.isMember !== undefined) ensure(typeof record.isMember === 'boolean', 'isMember harus boolean.');
  if (record.role === 'student') {
    academicFields(record);
    record.isMember ??= false;
  } else {
    ensure(!record.isMember, 'Status member hanya berlaku untuk student.');
    ['level', 'grade', 'readiness', 'studyTargets', 'isMember'].forEach((key) => delete record[key]);
  }
  if (record.readiness !== undefined) {
    ensure(['Masih mencari arah', 'Cukup siap', 'Sangat siap'].includes(record.readiness), 'readiness tidak valid.');
  }
  if (record.studyTargets !== undefined) {
    ensure(Array.isArray(record.studyTargets) && record.studyTargets.length <= 3 &&
      record.studyTargets.every((target) => typeof target === 'string' && target.trim()),
    'studyTargets harus berupa maksimal tiga teks target studi.');
    ensure(!record.studyTargets.length || record.level === 'SMA', 'Target studi hanya untuk SMA/SMK dan Gap Year.');
  }
}

/**
 * Memvalidasi paket dan subtes sebelum masuk penyimpanan demo.
 * @param {Object} record - Paket kandidat.
 * @returns {void} Melempar error jika kontrak paket tidak terpenuhi.
 */
function validateTryout(record) {
  ['title', 'subject'].forEach((key) => textField(record[key], key));
  academicFields(record);
  numberField(record.durationMinutes, 'durationMinutes', 1, true);
  numberField(record.price, 'price');
  ensure(typeof record.isFree === 'boolean', 'isFree harus boolean.');
  ensure(record.isFree === (record.price === 0), 'isFree harus sesuai dengan price (gratis bernilai 0).');
  numberField(record.questionCount, 'questionCount', 0, true);
  if (record.status !== undefined) ensure(packageStatuses.includes(record.status), 'status paket tidak valid.');
  if (record.maxAttempts !== undefined) numberField(record.maxAttempts, 'maxAttempts', 1, true);
  ['autoAdvance', 'noReturn'].forEach((key) => {
    if (record[key] !== undefined) ensure(typeof record[key] === 'boolean', `${key} harus boolean.`);
  });
  if (record.subtests !== undefined) {
    ensure(Array.isArray(record.subtests), 'subtests harus array.');
    const ids = new Set();
    record.subtests.forEach((subtest) => {
      ensure(subtest && typeof subtest === 'object' && !Array.isArray(subtest), 'Subtes harus objek.');
      ['id', 'title'].forEach((key) => textField(subtest[key], `subtests.${key}`));
      ensure(!ids.has(subtest.id), 'ID subtes tidak boleh duplikat.');
      ids.add(subtest.id);
      numberField(subtest.durationMinutes, 'subtests.durationMinutes', 1, true);
      numberField(subtest.questionCount, 'subtests.questionCount', 0, true);
    });
    if (record.subtests.length) {
      ensure(record.subtests.reduce((sum, item) => sum + item.durationMinutes, 0) === record.durationMinutes,
        'Total durasi subtes harus sama dengan durationMinutes paket.');
      ensure(record.subtests.reduce((sum, item) => sum + item.questionCount, 0) === record.questionCount,
        'Total jumlah soal subtes harus sama dengan questionCount paket.');
    }
  }
}

/**
 * Memeriksa lima tipe soal berikut bentuk kunci jawabannya.
 * @param {Object} record - Soal kandidat.
 * @param {Object} state - State untuk mengecek paket rujukan.
 * @returns {void} Melempar error jika soal tidak valid.
 */
function validateQuestion(record, state) {
  textField(record.prompt, 'prompt');
  textField(record.explanation, 'explanation');
  ensure(state.collections.tryouts.some((item) => item.id === record.tryoutId), 'tryoutId tidak ditemukan.');
  ensure(questionTypes.includes(record.type), 'type soal tidak valid.');
  if (record.type === 'essay') {
    numberField(record.maxScore, 'maxScore', 1);
    if (record.rubric !== undefined) textField(record.rubric, 'rubric');
    return;
  }
  numberField(record.weight, 'weight', 0.01);
  if (record.type === 'short_answer') {
    textField(record.correctAnswer, 'correctAnswer');
    return;
  }
  ensure(Array.isArray(record.options) && record.options.length >= 2 &&
    record.options.every((option) => typeof option === 'string' && option.trim()), 'options minimal dua teks pilihan.');
  if (record.type === 'true_false') ensure(record.options.length === 2, 'Soal benar/salah harus memiliki dua pilihan.');
  if (record.type === 'multiple_choice') {
    ensure(Array.isArray(record.correctIndices) && record.correctIndices.length > 0 &&
      new Set(record.correctIndices).size === record.correctIndices.length &&
      record.correctIndices.every((index) => Number.isInteger(index) && index >= 0 && index < record.options.length),
    'correctIndices harus berisi indeks pilihan unik dan valid, dimulai dari 0.');
  } else {
    ensure(Number.isInteger(record.correctIndex) && record.correctIndex >= 0 &&
      record.correctIndex < record.options.length, 'correctIndex harus indeks pilihan valid, dimulai dari 0.');
  }
}

/**
 * Memeriksa kode voucher, kuota, tanggal kalender, dan paket yang dicakup.
 * @param {Object} record - Voucher kandidat.
 * @param {Object} state - State demo.
 * @returns {void} Melempar error jika voucher tidak valid.
 */
function validateVoucher(record, state) {
  ['code', 'title', 'validUntil'].forEach((key) => textField(record[key], key));
  record.code = record.code.toUpperCase();
  ensure(/^[A-Z0-9_-]+$/.test(record.code), 'code hanya menerima huruf, angka, tanda - dan _.');
  ensure(!state.collections.vouchers.some((item) => item.id !== record.id &&
    item.code.toUpperCase() === record.code), 'Kode voucher sudah digunakan.', 409);
  numberField(record.quota, 'quota', 1, true);
  numberField(record.usedCount, 'usedCount', 0, true);
  ensure(record.usedCount <= record.quota, 'usedCount tidak boleh melebihi quota.');
  const date = new Date(`${record.validUntil}T00:00:00Z`);
  ensure(/^\d{4}-\d{2}-\d{2}$/.test(record.validUntil) && Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === record.validUntil, 'validUntil harus tanggal valid YYYY-MM-DD.');
  ensure(voucherStatuses.includes(record.status), 'status voucher tidak valid.');
  ensure(Array.isArray(record.applicablePackages) && record.applicablePackages.length > 0 &&
    new Set(record.applicablePackages).size === record.applicablePackages.length &&
    record.applicablePackages.every((id) => id === 'all' || state.collections.tryouts.some((item) => item.id === id)),
  'applicablePackages harus berisi ID paket yang tersedia atau all.');
  ensure(!record.applicablePackages.includes('all') || record.applicablePackages.length === 1,
    'all tidak boleh digabung dengan ID paket lain.');
}

/**
 * Memvalidasi transaksi simulasi tanpa menghubungi layanan pembayaran.
 * @param {Object} record - Transaksi kandidat.
 * @param {Object} state - State demo.
 * @returns {void} Melempar error untuk transaksi tidak valid.
 */
function validateTransaction(record, state) {
  ['studentName', 'packageTitle', 'paymentMethod', 'date'].forEach((key) => textField(record[key], key));
  numberField(record.amount, 'amount');
  ensure(transactionStatuses.includes(record.status), 'status transaksi tidak valid.');
  ensure(Number.isFinite(Date.parse(record.date)), 'date transaksi tidak valid.');
  if (record.studentId !== undefined) ensure(state.collections.users.some((user) =>
    user.id === record.studentId && user.role === 'student'), 'studentId harus merujuk peserta yang tersedia.');
  if (record.tryoutId !== undefined) ensure(state.collections.tryouts.some((item) =>
    item.id === record.tryoutId), 'tryoutId tidak ditemukan.');
}

/**
 * Menggabungkan field yang diizinkan, lalu memvalidasi kandidat lengkap.
 * @param {string} collection - Nama resource.
 * @param {Object} input - JSON body dari pemanggil.
 * @param {Object} state - State terkunci saat mutasi.
 * @param {Object} base - Record awal atau record lama.
 * @returns {Object} Record tervalidasi yang siap disimpan.
 */
export function validateRecord(collection, input, state, base) {
  ensure(input && typeof input === 'object' && !Array.isArray(input), 'Body harus objek JSON.');
  const keys = Object.keys(input);
  ensure(keys.length > 0, 'Body tidak boleh kosong.');
  ensure(keys.every((key) => fields[collection].includes(key)), 'Body berisi field yang tidak didukung atau ID yang tidak boleh diubah.');
  const clean = Object.fromEntries(Object.entries(input).map(([key, value]) =>
    [key, typeof value === 'string' ? value.trim() : value]));
  const record = { ...base, ...clean };
  const validators = { users: validateUser, tryouts: validateTryout, questions: validateQuestion,
    vouchers: validateVoucher, transactions: validateTransaction };
  if (collection === 'grading') {
    numberField(record.score, 'score');
    ensure(record.score <= record.maxScore, `score tidak boleh melebihi bobot ${record.maxScore}.`);
    if (record.feedback !== undefined) ensure(typeof record.feedback === 'string', 'feedback harus berupa teks.');
    record.status = 'Selesai';
  } else {
    validators[collection](record, state);
  }
  return record;
}
