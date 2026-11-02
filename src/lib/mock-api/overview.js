/** Modul: Referensi akademik, leaderboard fixture, dan ringkasan dashboard admin. */
import { academics, leaderboards } from '../../data/mock.js';
import { ensure } from './errors.js';
import { json, respond } from './handlers.js';
import { normalize, validateParams } from './queries.js';
import { readState } from './store.js';

/**
 * Mengambil pilihan jenjang dan kelas, opsional per jenjang.
 * @param {Request} request - Permintaan GET dengan parameter level.
 * @returns {Promise<Response>} Referensi akademik.
 */
export function academicList(request) {
  return respond(async () => {
    const params = new URL(request.url).searchParams;
    validateParams(params, ['level']);
    const level = normalize(params.get('level'));
    const data = level ? academics.filter((item) => normalize(item.level) === level) : academics;
    ensure(!level || data.length > 0, 'level tidak valid.');
    return json({ status: 'success', count: data.length, data });
  });
}

/**
 * Menyajikan leaderboard fixture per jenjang tanpa membuat nilai baru.
 * @param {Request} request - Permintaan GET dengan level dan limit opsional.
 * @returns {Promise<Response>} Peringkat statis demo, default SMA.
 */
export function leaderboardList(request) {
  return respond(async () => {
    const params = new URL(request.url).searchParams;
    validateParams(params, ['level', 'limit']);
    const input = normalize(params.get('level')) || 'sma';
    const level = Object.keys(leaderboards).find((key) => normalize(key) === input);
    ensure(Boolean(level), 'level leaderboard tidak valid.');
    const rawLimit = params.get('limit');
    const limit = rawLimit === null ? leaderboards[level].length : Number(rawLimit);
    ensure(rawLimit === null || (/^[1-9]\d*$/.test(rawLimit) && Number.isSafeInteger(limit)),
      'limit harus bilangan bulat positif.');
    const data = leaderboards[level].slice(0, limit);
    return json({ status: 'success', level, count: data.length, data });
  });
}

/**
 * Menghitung statistik dari state terbaru, bukan angka tetap pada UI.
 * @param {Request} request - Permintaan GET.
 * @returns {Promise<Response>} Ringkasan admin dengan status paket yang diketahui.
 */
export function adminSummary(request) {
  return respond(async () => {
    validateParams(new URL(request.url).searchParams, []);
    const { collections: data } = await readState();
    const students = data.users.filter((user) => user.role === 'student');
    const successful = data.transactions.filter((item) => item.status === 'Berhasil');
    return json({ status: 'success', data: {
      totalUsers: data.users.length,
      totalStudents: students.length,
      totalTeachers: data.users.filter((user) => user.role === 'teacher').length,
      totalAdmins: data.users.filter((user) => user.role === 'admin').length,
      activeMembers: students.filter((user) => user.isMember === true).length,
      totalPackages: data.tryouts.length,
      publishedPackages: data.tryouts.filter((item) => item.status === 'Terbit').length,
      unclassifiedPackages: data.tryouts.filter((item) => !item.status).length,
      totalQuestions: data.questions.length,
      totalTransactions: data.transactions.length,
      successfulTransactions: successful.length,
      pendingTransactions: data.transactions.filter((item) => item.status === 'Menunggu').length,
      estimatedRevenue: successful.reduce((sum, item) => sum + item.amount, 0),
      pendingEssays: data.grading.filter((item) => item.status !== 'Selesai').length,
    } });
  });
}
