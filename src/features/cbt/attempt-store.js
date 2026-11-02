/**
 * Modul: Penyimpanan lokal percobaan CBT
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menyimpan attempt, jawaban, penanda, dan akses voucher di browser.
 * @remarks Data hanya untuk demo frontend; validasi dan penilaian final tetap di server.
 */

const ATTEMPT_KEY = 'titikterampil_cbt_attempts_v1';
const ACCESS_KEY = 'titikterampil_cbt_access_v1';

/**
 * Memeriksa ketersediaan localStorage tanpa melempar error di server.
 * @returns {boolean} True bila browser menyediakan storage.
 */
function hasStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

/**
 * Membaca JSON dari storage dengan fallback aman.
 * @param {string} key - Kunci storage.
 * @param {unknown} fallback - Nilai pengganti saat data tidak valid.
 * @returns {unknown} Data hasil parse atau fallback.
 */
function readJson(key, fallback) {
  if (!hasStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Menulis JSON ke storage.
 * @param {string} key - Kunci storage.
 * @param {unknown} value - Data yang disimpan.
 * @returns {boolean} True bila penyimpanan berhasil.
 */
function writeJson(key, value) {
  if (!hasStorage()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Memastikan record attempt memiliki identitas minimum yang dapat dipakai.
 * @param {unknown} attempt - Kandidat record.
 * @returns {boolean} True bila bentuk record dikenali.
 */
function isAttemptRecord(attempt) {
  return Boolean(attempt) &&
    typeof attempt === 'object' &&
    !Array.isArray(attempt) &&
    typeof attempt.id === 'string' &&
    typeof attempt.studentId === 'string' &&
    typeof attempt.tryoutId === 'string';
}

/**
 * Membaca seluruh attempt yang tersimpan.
 * @returns {Array<Object>} Daftar attempt valid.
 */
export function readAttempts() {
  const data = readJson(ATTEMPT_KEY, []);
  if (!Array.isArray(data)) return [];
  return data.filter(isAttemptRecord);
}

/**
 * Menyimpan seluruh attempt.
 * @param {Array<Object>} attempts - Daftar attempt yang akan ditulis.
 * @returns {boolean} True bila penyimpanan berhasil.
 */
export function writeAttempts(attempts) {
  if (!Array.isArray(attempts)) return false;
  return writeJson(ATTEMPT_KEY, attempts.filter(isAttemptRecord));
}

/**
 * Menyimpan atau memperbarui satu attempt.
 * @param {Object} attempt - Attempt yang disimpan.
 * @returns {boolean} True bila penyimpanan berhasil.
 */
export function saveAttempt(attempt) {
  if (!isAttemptRecord(attempt)) return false;
  const attempts = readAttempts();
  const index = attempts.findIndex((item) => item.id === attempt.id);
  if (index >= 0) attempts[index] = attempt;
  else attempts.push(attempt);
  return writeAttempts(attempts);
}

/**
 * Mengambil attempt berdasarkan ID.
 * @param {string} attemptId - ID attempt.
 * @returns {Object|null} Attempt yang ditemukan atau null.
 */
export function getAttempt(attemptId) {
  if (typeof attemptId !== 'string' || !attemptId.trim()) return null;
  return readAttempts().find((item) => item.id === attemptId) ?? null;
}

/**
 * Mencari attempt aktif milik siswa untuk sebuah paket.
 * @param {string} studentId - ID siswa.
 * @param {string} tryoutId - ID paket.
 * @returns {Object|null} Attempt aktif terbaru atau null.
 */
export function findActiveAttempt(studentId, tryoutId) {
  if (!studentId || !tryoutId) return null;
  return readAttempts()
    .filter((item) => item.studentId === studentId && item.tryoutId === tryoutId && !item.submittedAt)
    .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))[0] ?? null;
}

/**
 * Mengambil seluruh attempt milik siswa.
 * @param {string} studentId - ID siswa.
 * @returns {Array<Object>} Attempt milik siswa.
 */
export function getStudentAttempts(studentId) {
  if (typeof studentId !== 'string' || !studentId.trim()) return [];
  return readAttempts().filter((item) => item.studentId === studentId);
}

/**
 * Membaca daftar paket yang telah dibuka dengan voucher per siswa.
 * @returns {Object<string, string[]>} Peta ID siswa ke daftar ID paket.
 */
function readAccessMap() {
  const data = readJson(ACCESS_KEY, {});
  return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
}

/**
 * Memeriksa apakah paket sudah dibuka dengan voucher oleh siswa.
 * @param {string} studentId - ID siswa.
 * @param {string} tryoutId - ID paket.
 * @returns {boolean} True bila akses tersimpan.
 */
export function isTryoutUnlocked(studentId, tryoutId) {
  if (!studentId || !tryoutId) return false;
  const access = readAccessMap();
  return Array.isArray(access[studentId]) && access[studentId].includes(tryoutId);
}

/**
 * Menyimpan akses paket setelah voucher berhasil ditukar.
 * @param {string} studentId - ID siswa.
 * @param {string} tryoutId - ID paket.
 * @returns {boolean} True bila akses berhasil disimpan.
 */
export function unlockTryout(studentId, tryoutId) {
  if (!studentId || !tryoutId) return false;
  const access = readAccessMap();
  const current = Array.isArray(access[studentId]) ? access[studentId] : [];
  access[studentId] = [...new Set([...current, tryoutId])];
  return writeJson(ACCESS_KEY, access);
}
