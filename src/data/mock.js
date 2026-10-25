/**
 * Modul: Kontrak data contoh frontend
 * @author Tim Titik Terampil; koordinator integrasi: Kaisar dan Rayazka
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Kunci jawaban hanya untuk demo; kelak penilaian harus berlangsung di server.
 */
export const tryouts = [
 { id: 'demo', title: 'Tryout Matematika SMA', level: 'SMA', grade: 12, subject: 'Matematika', durationMinutes: 30 },
 { id: 'smp-demo', title: 'Latihan Matematika SMP', level: 'SMP', grade: 9, subject: 'Matematika', durationMinutes: 20 },
 { id: 'sd-demo', title: 'Latihan Matematika SD', level: 'SD', grade: 6, subject: 'Matematika', durationMinutes: 15 },
];
export const classes = [{ id: 'demo', title: 'Matematika · Persiapan Kelas 12', level: 'SMA', grade: 12, teacherId: 'teacher-demo' }];
export const questions = [{ id: 'question-demo', tryoutId: 'demo', prompt: 'Jika 2x + 4 = 10, berapakah nilai x?', options: ['2', '3', '4', '5'], correctIndex: 1, weight: 1, explanation: '2x = 10 − 4 = 6, sehingga x = 3.' }];
export const assignments = [{ id: 'demo', classId: 'demo', title: 'Latihan persamaan linear', instructions: 'Jelaskan langkah menyelesaikan persamaan 2x + 4 = 10.' }];
export const users = [{ id: 'student-demo', name: 'Siswa Contoh', role: 'student', level: 'SMA', grade: 12 }, { id: 'teacher-demo', name: 'Pengajar Contoh', role: 'teacher' }];
export const academics = [{ level: 'SD', grades: [1,2,3,4,5,6] }, { level: 'SMP', grades: [7,8,9] }, { level: 'SMA', grades: [10,11,12] }];

/**
 * Mencari satu record pada koleksi data contoh tanpa mengubah isinya.
 * @param {Array<Object>} collection - Koleksi dengan field id berupa string.
 * @param {string} id - ID record yang diminta.
 * @returns {Object|null} Record ditemukan atau null bila input/ID tidak tersedia.
 */
export function getRecord(collection, id) {
  // 1. Tangani sumber data atau ID yang belum siap.
  if (!Array.isArray(collection) || typeof id !== 'string') return null;
  // 2. Cari ID persis; abaikan item null pada koleksi demo.
  const record = collection.find((item) => item?.id === id) ?? null;
  // 3. TODO: Ganti sumber dengan adapter frontend bila persistence disepakati.
  // 4. Pemanggil membedakan null dari data kosong dan menampilkan pesan yang sesuai.
  return record;
}
