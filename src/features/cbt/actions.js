/**
 * Modul: Fungsi frontend cbt
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: mengembangkan dan memverifikasi modul ini sesuai plotting COTS.
 * @todo Lengkapi integrasi backend setelah kontrak API final disepakati.
 */

/**
 * Menyamakan teks pencarian agar filter tidak bergantung besar-kecil huruf.
 * @param {unknown} value - Nilai yang akan dinormalisasi.
 * @returns {string} Teks huruf kecil tanpa spasi di awal/akhir.
 */
export function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase();
}

/**
 * Memfilter paket berdasarkan pilihan katalog.
 * @param {Array<Object>} packages - Daftar paket tryout.
 * @param {Object} filters - Filter level, grade, subject, dan query pencarian.
 * @returns {Array<Object>} Paket yang sesuai; input bukan array menghasilkan daftar kosong.
 */
export function filterTryouts(packages = [], filters = {}) {
  // 1. Tangani sumber data atau filter yang belum siap.
  if (!Array.isArray(packages)) return [];
  const criteria = filters ?? {};

  // 2. Normalisasi nilai filter dari elemen form.
  const selectedLevel = normalizeText(criteria.level);
  const hasGrade = criteria.grade !== undefined && criteria.grade !== null && String(criteria.grade).trim() !== '';
  const selectedGrade = hasGrade ? String(criteria.grade).trim() : null;
  const selectedSubject = normalizeText(criteria.subject);
  const query = normalizeText(criteria.query);

  // 3. Terapkan seluruh filter tanpa mengubah array asal.
  return packages.filter((item) => {
    if (!item) return false;
    if (selectedLevel && normalizeText(item.level) !== selectedLevel) return false;
    if (selectedGrade && String(item.grade).trim() !== selectedGrade) return false;
    if (selectedSubject && normalizeText(item.subject) !== selectedSubject) return false;
    if (query) {
      const searchable = `${item.title ?? ''} ${item.subject ?? ''} ${item.level ?? ''}`;
      if (!normalizeText(searchable).includes(query)) return false;
    }
    return true;
  });
}

/**
 * Memformat harga rupiah untuk kartu dan detail paket.
 * @param {number} value - Nominal harga.
 * @returns {string} Harga berformat rupiah atau teks gratis.
 */
export function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return 'Gratis';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Mengambil daftar nama tryout yang tercakup dalam sebuah paket.
 * @param {Object} item - Paket tryout dari API atau fixture.
 * @returns {string[]} Nama tryout; memakai metadata paket bila tersedia.
 */
export function getPackageTryoutNames(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return [];

  // 1. Prioritaskan metadata daftar tryout eksplisit.
  if (Array.isArray(item.includedTryouts) && item.includedTryouts.length > 0) {
    return item.includedTryouts
      .filter((name) => typeof name === 'string' && name.trim())
      .map((name) => name.trim());
  }

  // 2. Paket lama memakai subtes sebagai daftar tryout.
  if (Array.isArray(item.subtests) && item.subtests.length > 0) {
    return item.subtests
      .map((subtest) => (typeof subtest?.title === 'string' ? subtest.title.trim() : ''))
      .filter(Boolean);
  }

  // 3. Paket tanpa rincian tetap menampilkan dirinya sebagai satu tryout.
  return typeof item.title === 'string' && item.title.trim() ? [item.title.trim()] : [];
}

/**
 * Memeriksa apakah voucher dapat dipakai untuk sebuah paket.
 * @param {Object} voucher - Record voucher dari API atau data contoh.
 * @param {string} tryoutId - ID paket yang ingin dibuka.
 * @param {Date|string} [now=new Date()] - Waktu pemeriksaan.
 * @returns {{status: string, message: string, voucher?: Object}} Hasil validasi.
 */
export function validateVoucher(voucher, tryoutId, now = new Date()) {
  // 1. Pastikan voucher dan paket tersedia.
  if (!voucher || typeof voucher !== 'object' || Array.isArray(voucher)) {
    return { status: 'error', message: 'Kode voucher tidak ditemukan.' };
  }
  if (typeof tryoutId !== 'string' || !tryoutId.trim()) {
    return { status: 'error', message: 'Paket tryout tidak valid.' };
  }

  // 2. Periksa status, kuota, dan masa berlaku.
  if (voucher.status !== 'Aktif') {
    return { status: 'error', message: 'Voucher sudah tidak aktif.' };
  }
  if (Number(voucher.usedCount) >= Number(voucher.quota)) {
    return { status: 'error', message: 'Kuota voucher sudah habis.' };
  }
  const today = new Date(now);
  const expiry = new Date(`${voucher.validUntil}T23:59:59`);
  if (!Number.isFinite(today.getTime()) || !Number.isFinite(expiry.getTime()) || today > expiry) {
    return { status: 'error', message: 'Masa berlaku voucher sudah berakhir.' };
  }

  // 3. Pastikan voucher mencakup paket yang dipilih.
  const packages = Array.isArray(voucher.applicablePackages) ? voucher.applicablePackages : [];
  if (!packages.includes('all') && !packages.includes(tryoutId)) {
    return { status: 'error', message: 'Voucher tidak berlaku untuk paket ini.' };
  }

  return {
    status: 'success',
    message: `Voucher ${voucher.code} berhasil dipakai. Paket ini terbuka.`,
    voucher,
  };
}


/**
 * Membuat ID attempt unik tanpa bergantung pada pustaka tambahan.
 * @returns {string} ID attempt baru.
 */
function createAttemptId() {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return `attempt-${uuid}`;
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Mengubah nilai waktu menjadi milidetik yang valid.
 * @param {Date|string|number} value - Nilai waktu.
 * @returns {number} Milidetik atau NaN.
 */
function toMillis(value) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  return Date.parse(value);
}

/**
 * Menghitung sisa waktu berdasarkan deadline, bukan hitungan interval.
 * @param {Date|string|number} deadline - Batas waktu attempt.
 * @param {Date|string|number} [now=Date.now()] - Waktu pembanding.
 * @returns {number} Sisa milidetik; 0 bila sudah lewat atau tidak valid.
 */
export function computeRemainingMs(deadline, now = Date.now()) {
  const end = toMillis(deadline);
  const current = toMillis(now);
  if (!Number.isFinite(end) || !Number.isFinite(current)) return 0;
  return Math.max(0, end - current);
}

/**
 * Memformat sisa waktu menjadi HH:MM:SS.
 * @param {number} milliseconds - Sisa waktu dalam milidetik.
 * @returns {string} Waktu siap tampil.
 */
export function formatClock(milliseconds) {
  const total = Math.max(0, Math.ceil(Number(milliseconds) / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
}

/**
 * Memeriksa apakah attempt sudah melewati deadline.
 * @param {Object} attempt - Attempt dengan field deadline.
 * @param {Date|string|number} [now=Date.now()] - Waktu pembanding.
 * @returns {boolean} True bila waktu ujian habis.
 */
export function isAttemptExpired(attempt, now = Date.now()) {
  if (!attempt || typeof attempt !== 'object') return true;
  return computeRemainingMs(attempt.deadline, now) <= 0;
}

/**
 * Memulai percobaan baru dengan deadline yang tersimpan.
 * @param {string|Object} tryout - ID paket atau record paket lengkap.
 * @param {Object} [options] - Opsi pembuatan attempt.
 * @param {string} [options.studentId] - ID siswa pemilik attempt.
 * @param {Date|string|number} [options.now] - Waktu mulai untuk pengujian.
 * @param {Object} [options.tryout] - Record paket saat argumen pertama berupa ID.
 * @returns {Object} Attempt baru atau kesalahan validasi.
 */
export function startAttempt(tryout, options = {}) {
  const packageData = typeof tryout === 'string'
    ? { id: tryout, ...(options.tryout ?? {}) }
    : tryout;

  // 1. Pastikan paket dan pemilik attempt tersedia.
  if (!packageData || typeof packageData !== 'object' || typeof packageData.id !== 'string' ||
    !packageData.id.trim()) {
    return { status: 'error', message: 'ID paket wajib diisi.' };
  }
  if (typeof options.studentId !== 'string' || !options.studentId.trim()) {
    return { status: 'error', message: 'ID siswa wajib diisi sebelum memulai ujian.' };
  }

  // 2. Pastikan durasi paket dapat dipakai untuk menghitung deadline.
  const durationMinutes = Number(packageData.durationMinutes);
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return { status: 'error', message: 'Durasi paket tidak valid.' };
  }
  const startMs = toMillis(options.now ?? Date.now());
  if (!Number.isFinite(startMs)) {
    return { status: 'error', message: 'Waktu mulai tidak valid.' };
  }

  // 3. Susun attempt dengan salinan data paket untuk riwayat dan hasil.
  const attempt = {
    id: createAttemptId(),
    studentId: options.studentId.trim(),
    tryoutId: packageData.id.trim(),
    tryoutTitle: packageData.title ?? 'Paket tryout',
    tryoutLevel: packageData.level ?? '',
    tryoutGrade: packageData.grade ?? '',
    tryoutSubject: packageData.subject ?? '',
    durationMinutes,
    startedAt: new Date(startMs).toISOString(),
    deadline: new Date(startMs + durationMinutes * 60 * 1000).toISOString(),
    answers: {},
    flaggedQuestionIds: [],
    status: 'active',
    submittedAt: null,
    score: null,
    submitReason: null,
  };

  return {
    status: 'success',
    attempt,
    message: 'Percobaan dimulai. Timer berjalan sejak sekarang.',
  };
}

/**
 * Memeriksa apakah jawaban dianggap kosong.
 * @param {unknown} value - Nilai jawaban.
 * @returns {boolean} True bila belum diisi.
 */
export function isAnswerEmpty(value) {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'string') return value.trim() === '';
  return false;
}

/**
 * Memvalidasi dan menormalkan jawaban sesuai tipe soal.
 * @param {Object} question - Soal yang dijawab.
 * @param {unknown} value - Jawaban dari UI.
 * @returns {{status: string, value?: unknown, message?: string}} Hasil validasi.
 */
export function validateAnswer(question, value) {
  if (!question || typeof question !== 'object' || typeof question.id !== 'string') {
    return { status: 'error', message: 'Soal tidak valid.' };
  }
  const options = Array.isArray(question.options) ? question.options : [];

  if (question.type === 'single_choice' || question.type === 'true_false') {
    if (!Number.isInteger(value) || value < 0 || value >= options.length) {
      return { status: 'error', message: 'Pilih satu jawaban yang tersedia.' };
    }
    return { status: 'success', value };
  }

  if (question.type === 'multiple_choice') {
    if (!Array.isArray(value) || new Set(value).size !== value.length ||
      value.some((index) => !Number.isInteger(index) || index < 0 || index >= options.length)) {
      return { status: 'error', message: 'Pilihan jawaban jamak tidak valid.' };
    }
    return { status: 'success', value: [...value].sort((a, b) => a - b) };
  }

  if (question.type === 'short_answer' || question.type === 'essay') {
    if (typeof value !== 'string') {
      return { status: 'error', message: 'Jawaban harus berupa teks.' };
    }
    const limit = question.type === 'essay' ? 20000 : 500;
    if (value.length > limit) {
      return { status: 'error', message: `Jawaban melebihi ${limit} karakter.` };
    }
    return { status: 'success', value };
  }

  return { status: 'error', message: 'Tipe soal tidak dikenali.' };
}

/**
 * Menyimpan satu jawaban ke salinan attempt tanpa mengubah attempt asal.
 * @param {Object} attempt - Attempt aktif.
 * @param {Object} question - Soal yang dijawab.
 * @param {unknown} value - Jawaban baru.
 * @returns {Object} Attempt baru atau kesalahan validasi.
 */
export function saveAnswer(attempt, question, value) {
  if (!attempt || typeof attempt !== 'object' || typeof attempt.id !== 'string' || !attempt.id.trim()) {
    return { status: 'error', message: 'Attempt tidak valid.' };
  }
  if (attempt.submittedAt) {
    return { status: 'error', message: 'Attempt sudah dikumpulkan.' };
  }
  const validated = validateAnswer(question, value);
  if (validated.status !== 'success') return validated;

  return {
    status: 'success',
    attempt: {
      ...attempt,
      answers: { ...(attempt.answers ?? {}), [question.id]: validated.value },
    },
    value: validated.value,
  };
}

/**
 * Menambah atau menghapus penanda ragu-ragu pada attempt.
 * @param {Object} attempt - Attempt aktif.
 * @param {string} questionId - ID soal.
 * @returns {Object} Attempt baru atau kesalahan validasi.
 */
export function toggleFlag(attempt, questionId) {
  if (!attempt || typeof attempt !== 'object' || typeof attempt.id !== 'string') {
    return { status: 'error', message: 'Attempt tidak valid.' };
  }
  if (typeof questionId !== 'string' || !questionId.trim()) {
    return { status: 'error', message: 'ID soal tidak valid.' };
  }
  const flags = Array.isArray(attempt.flaggedQuestionIds) ? attempt.flaggedQuestionIds : [];
  const nextFlags = flags.includes(questionId)
    ? flags.filter((id) => id !== questionId)
    : [...flags, questionId];
  return {
    status: 'success',
    attempt: { ...attempt, flaggedQuestionIds: nextFlags },
  };
}

/**
 * Menilai satu jawaban objektif atau menandainya menunggu koreksi esai.
 * @param {Object} question - Soal yang dinilai.
 * @param {unknown} answer - Jawaban siswa.
 * @returns {{status: string, weight: number, correct: boolean|null}} Hasil penilaian.
 */
export function evaluateAnswer(question, answer) {
  const weight = question.type === 'essay' ? Number(question.maxScore) || 0 : Number(question.weight) || 1;
  if (question.type === 'essay') return { status: 'pending', weight: 0, correct: null };
  if (isAnswerEmpty(answer)) return { status: 'empty', weight, correct: false };

  if (question.type === 'single_choice' || question.type === 'true_false') {
    const correct = answer === question.correctIndex;
    return { status: correct ? 'correct' : 'wrong', weight, correct };
  }

  if (question.type === 'multiple_choice') {
    const expected = Array.isArray(question.correctIndices) ? [...question.correctIndices].sort((a, b) => a - b) : [];
    const actual = [...answer].sort((a, b) => a - b);
    const correct = expected.length === actual.length && expected.every((value, index) => value === actual[index]);
    return { status: correct ? 'correct' : 'wrong', weight, correct };
  }

  if (question.type === 'short_answer') {
    const normalize = (value) => normalizeText(value).replace(/\s+/g, ' ');
    const actual = normalize(answer);
    const expected = normalize(question.correctAnswer);
    const numericActual = Number(actual);
    const numericExpected = Number(expected);
    const correct = actual === expected ||
      (Number.isFinite(numericActual) && Number.isFinite(numericExpected) && numericActual === numericExpected);
    return { status: correct ? 'correct' : 'wrong', weight, correct };
  }

  return { status: 'wrong', weight, correct: false };
}

/**
 * Mengumpulkan attempt dan menghitung nilai objektif secara idempoten.
 * @param {Object} attempt - Percobaan berisi id, answers dan submittedAt.
 * @param {Array<Object>} questions - Soal, kunci dan bobot paket.
 * @param {Object} [options] - Opsi pengumpulan.
 * @param {Date|string|number} [options.now] - Waktu submit.
 * @param {string} [options.reason='manual'] - Alasan submit.
 * @returns {Object} Attempt yang sudah dinilai atau kesalahan validasi.
 */
export function submitAttempt(attempt, questions = [], options = {}) {
  // 1. Pastikan percobaan dan soal tersedia.
  if (!attempt || typeof attempt.id !== 'string' || !attempt.id.trim() ||
    !Array.isArray(questions) || questions.length === 0) {
    return { status: 'error', message: 'Percobaan dan daftar soal wajib tersedia.' };
  }

  // 2. Cegah pengumpulan ulang percobaan selesai.
  if (attempt.submittedAt || attempt.status === 'submitted') {
    return { status: 'error', code: 'already_submitted', message: 'Percobaan sudah dikumpulkan.' };
  }

  const submittedAtMs = toMillis(options.now ?? Date.now());
  if (!Number.isFinite(submittedAtMs)) {
    return { status: 'error', message: 'Waktu pengumpulan tidak valid.' };
  }

  // 3. Nilai seluruh soal dan jumlahkan bobot objektif.
  let earnedWeight = 0;
  let totalWeight = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let emptyCount = 0;
  let pendingEssayCount = 0;
  const answers = attempt.answers ?? {};

  const results = questions.map((question) => {
    const answer = answers[question.id];
    const evaluation = evaluateAnswer(question, answer);
    if (question.type === 'essay') {
      pendingEssayCount += 1;
    } else {
      totalWeight += evaluation.weight;
      if (evaluation.status === 'correct') {
        earnedWeight += evaluation.weight;
        correctCount += 1;
      } else if (evaluation.status === 'empty') {
        emptyCount += 1;
      } else {
        wrongCount += 1;
      }
    }
    return {
      questionId: question.id,
      status: evaluation.status,
      weight: evaluation.weight,
    };
  });

  // 4. Hindari pembagian nol dan bulatkan nilai ke dua desimal.
  const score = totalWeight > 0
    ? Number(((earnedWeight / totalWeight) * 100).toFixed(2))
    : null;
  const startedAtMs = toMillis(attempt.startedAt);
  const durationSeconds = Number.isFinite(startedAtMs)
    ? Math.max(0, Math.round((submittedAtMs - startedAtMs) / 1000))
    : null;

  const nextAttempt = {
    ...attempt,
    status: 'submitted',
    submittedAt: new Date(submittedAtMs).toISOString(),
    submitReason: options.reason ?? 'manual',
    score,
    gradingStatus: pendingEssayCount > 0 || score === null ? 'pending' : 'complete',
    summary: {
      total: questions.length,
      correct: correctCount,
      wrong: wrongCount,
      empty: emptyCount,
      pendingEssay: pendingEssayCount,
      earnedWeight,
      totalWeight,
      durationSeconds,
    },
    results,
  };

  return {
    status: 'success',
    attempt: nextAttempt,
    score,
    summary: nextAttempt.summary,
    message: pendingEssayCount > 0
      ? 'Jawaban objektif dinilai. Esai menunggu koreksi pengajar.'
      : 'Percobaan berhasil dikumpulkan.',
  };
}

/**
 * Menyusun hasil dan pembahasan setiap soal dari attempt yang sudah dikumpulkan.
 * @param {Object} attempt - Percobaan yang sudah dinilai.
 * @param {Array<Object>} questions - Soal yang dikerjakan.
 * @returns {Object} Status hasil, ringkasan, dan daftar pembahasan.
 */
export function getAttemptReview(attempt, questions = []) {
  // 1. Validasi identitas attempt dan daftar soal.
  if (!attempt || typeof attempt !== 'object' || typeof attempt.id !== 'string' ||
    !attempt.id.trim()) {
    return { status: 'error', message: 'ID percobaan wajib diisi.' };
  }
  if (!Array.isArray(questions)) {
    return { status: 'error', message: 'Daftar soal tidak valid.' };
  }
  if (!attempt.submittedAt) {
    return {
      status: 'in_progress',
      attempt,
      message: 'Percobaan belum dikumpulkan sehingga pembahasan belum tersedia.',
    };
  }

  const answers = attempt.answers ?? {};
  const flags = Array.isArray(attempt.flaggedQuestionIds) ? attempt.flaggedQuestionIds : [];

  // 2. Gabungkan jawaban, kunci, status, dan pembahasan tiap soal.
  const items = questions.map((question, index) => {
    const answer = answers[question.id];
    const evaluation = evaluateAnswer(question, answer);
    return {
      questionId: question.id,
      number: index + 1,
      type: question.type,
      prompt: question.prompt,
      options: Array.isArray(question.options) ? question.options : [],
      answer,
      correctAnswer: question.type === 'essay'
        ? null
        : question.type === 'multiple_choice'
          ? (Array.isArray(question.correctIndices) ? question.correctIndices : [])
          : question.type === 'short_answer'
            ? question.correctAnswer
            : question.correctIndex,
      status: question.type === 'essay' ? 'pending' : evaluation.status,
      weight: question.type === 'essay' ? question.maxScore : question.weight,
      explanation: question.explanation ?? '',
      rubric: question.rubric ?? '',
      flagged: flags.includes(question.id),
    };
  });

  // 3. Hitung ringkasan dari item agar konsisten dengan tampilan.
  const summary = {
    total: items.length,
    correct: items.filter((item) => item.status === 'correct').length,
    wrong: items.filter((item) => item.status === 'wrong').length,
    empty: items.filter((item) => item.status === 'empty').length,
    pendingEssay: items.filter((item) => item.status === 'pending').length,
    durationSeconds: attempt.summary?.durationSeconds ?? null,
  };

  return {
    status: 'success',
    review: {
      attemptId: attempt.id,
      tryoutId: attempt.tryoutId,
      tryoutTitle: attempt.tryoutTitle ?? 'Paket tryout',
      tryoutLevel: attempt.tryoutLevel ?? '',
      tryoutGrade: attempt.tryoutGrade ?? '',
      submittedAt: attempt.submittedAt,
      score: attempt.score,
      gradingStatus: attempt.gradingStatus ?? 'complete',
      submitReason: attempt.submitReason ?? 'manual',
      summary,
      items,
    },
  };
}

/**
 * Menyusun riwayat attempt milik siswa, terbaru lebih dahulu.
 * @param {Array<Object>|string} attemptsOrStudentId - Daftar attempt atau ID siswa.
 * @param {string} [studentId] - ID siswa saat argumen pertama berupa daftar.
 * @returns {Object} Daftar attempt yang sudah disaring dan diurutkan.
 */
export function getStudentHistory(attemptsOrStudentId, studentId) {
  const attempts = Array.isArray(attemptsOrStudentId) ? attemptsOrStudentId : [];
  const ownerId = Array.isArray(attemptsOrStudentId) ? studentId : attemptsOrStudentId;

  // 1. Validasi identitas siswa.
  if (typeof ownerId !== 'string' || !ownerId.trim()) {
    return { status: 'error', message: 'ID siswa wajib diisi.' };
  }

  // 2. Ambil hanya attempt milik siswa tersebut.
  const owned = attempts.filter((attempt) => attempt &&
    typeof attempt === 'object' &&
    attempt.studentId === ownerId.trim());

  // 3. Urutkan berdasarkan waktu submit, lalu waktu mulai untuk attempt aktif.
  const sorted = [...owned].sort((a, b) => {
    const left = Date.parse(a.submittedAt ?? a.startedAt ?? 0);
    const right = Date.parse(b.submittedAt ?? b.startedAt ?? 0);
    return (Number.isFinite(right) ? right : 0) - (Number.isFinite(left) ? left : 0);
  });

  return {
    status: 'success',
    studentId: ownerId.trim(),
    attempts: sorted,
    summary: {
      total: sorted.length,
      completed: sorted.filter((attempt) => Boolean(attempt.submittedAt)).length,
      active: sorted.filter((attempt) => !attempt.submittedAt).length,
    },
  };
}
