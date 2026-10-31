
/**
 * Modul: Fungsi frontend tryout-management
 * @author Farrel Irham Adzkaar Susanto (103022400105)
 * Tanggung jawab: validasi bank soal, paket tryout, dan laporan.
 *
 * Catatan:
 * Fungsi ini memvalidasi dan menyiapkan data.
 * Penyimpanan serta pembaruan state dilakukan oleh halaman pemanggil.
 */

/**
 * Memvalidasi dan menyiapkan soal pilihan ganda.
 * @param {Object} question
 * @returns {{status: string, data?: Object, message?: string}}
 */
export function saveQuestion(question) {
  if (
    !question ||
    typeof question.prompt !== 'string' ||
    !question.prompt.trim()
  ) {
    return {
      status: 'error',
      message: 'Teks soal wajib diisi.',
    };
  }

  if (
    !Array.isArray(question.options) ||
    question.options.length < 2 ||
    question.options.some(
      (option) => typeof option !== 'string' || !option.trim()
    )
  ) {
    return {
      status: 'error',
      message: 'Minimal dua opsi jawaban wajib diisi.',
    };
  }

  if (
    !Number.isInteger(question.correctIndex) ||
    question.correctIndex < 0 ||
    question.correctIndex >= question.options.length
  ) {
    return {
      status: 'error',
      message: 'Pilih kunci jawaban yang valid.',
    };
  }

  const weight = Number(question.weight);

  if (!Number.isFinite(weight) || weight <= 0) {
    return {
      status: 'error',
      message: 'Bobot soal harus lebih besar dari nol.',
    };
  }

  const options = question.options.map((option) => option.trim());

  if (new Set(options.map((option) => option.toLowerCase())).size !== options.length) {
    return {
      status: 'error',
      message: 'Opsi jawaban tidak boleh duplikat.',
    };
  }

  if (
    question.explanation !== undefined &&
    typeof question.explanation !== 'string'
  ) {
    return {
      status: 'error',
      message: 'Pembahasan harus berupa teks.',
    };
  }

  const data = {
    ...question,
    prompt: question.prompt.trim(),
    options,
    weight,
    explanation: question.explanation?.trim() ?? '',
  };

  return {
    status: 'success',
    data,
    message: 'Soal valid dan siap diproses.',
  };
}

/**
 * Memvalidasi dan menyiapkan paket tryout.
 * questionIds dan jadwal bersifat opsional agar kompatibel
 * dengan form paket yang belum menyediakan field tersebut.
 *
 * @param {Object} tryout
 * @returns {{status: string, data?: Object, message?: string}}
 */
export function saveTryoutPackage(tryout) {
  if (
    !tryout ||
    typeof tryout.title !== 'string' ||
    !tryout.title.trim()
  ) {
    return {
      status: 'error',
      message: 'Judul paket tryout wajib diisi.',
    };
  }

  const durationMinutes = Number(tryout.durationMinutes);

  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return {
      status: 'error',
      message: 'Durasi harus berupa angka lebih besar dari nol.',
    };
  }

  if (
    tryout.questionIds !== undefined &&
    (
      !Array.isArray(tryout.questionIds) ||
      tryout.questionIds.some(
        (id) => typeof id !== 'string' || !id.trim()
      )
    )
  ) {
    return {
      status: 'error',
      message: 'Daftar soal tidak valid.',
    };
  }

  const opensAt = tryout.opensAt;
  const closesAt = tryout.closesAt;

  if ((opensAt && !closesAt) || (!opensAt && closesAt)) {
    return {
      status: 'error',
      message: 'Jadwal mulai dan selesai harus diisi berpasangan.',
    };
  }

  if (opensAt && closesAt) {
    const openTime = Date.parse(opensAt);
    const closeTime = Date.parse(closesAt);

    if (
      !Number.isFinite(openTime) ||
      !Number.isFinite(closeTime) ||
      openTime >= closeTime
    ) {
      return {
        status: 'error',
        message: 'Jadwal mulai harus lebih awal dari jadwal selesai.',
      };
    }
  }

  const data = {
    ...tryout,
    title: tryout.title.trim(),
    durationMinutes,
    ...(tryout.questionIds !== undefined && {
      questionIds: [...new Set(tryout.questionIds)],
    }),
  };

  return {
    status: 'success',
    data,
    message: 'Paket tryout valid dan siap diproses.',
  };
}

/**
 * Membuat rekap dari hasil percobaan CBT.
 *
 * Field yang dikenali:
 * - score: nilai numerik
 * - status: jika tersedia, hanya status selesai yang dihitung
 * - level, grade, tryoutId: filter opsional
 * - completedAt atau submittedAt: tanggal hasil
 *
 * @param {Array<Object>} attempts
 * @param {Object} filters
 * @returns {Object}
 */
export function buildReport(attempts, filters = {}) {
  if (!Array.isArray(attempts)) {
    return {
      status: 'error',
      message: 'Sumber hasil harus berupa daftar percobaan.',
    };
  }

  const criteria = filters ?? {};
  const startDate = criteria.startDate
    ? Date.parse(criteria.startDate)
    : null;
  const endDate = criteria.endDate
    ? Date.parse(criteria.endDate)
    : null;

  if (
    (criteria.startDate && !Number.isFinite(startDate)) ||
    (criteria.endDate && !Number.isFinite(endDate))
  ) {
    return {
      status: 'error',
      message: 'Rentang tanggal tidak valid.',
    };
  }

  if (startDate !== null && endDate !== null && startDate > endDate) {
    return {
      status: 'error',
      message: 'Tanggal mulai tidak boleh melewati tanggal akhir.',
    };
  }

  const rows = attempts.filter((attempt) => {
    if (!attempt || typeof attempt !== 'object') return false;

    // Jika status tersedia, hanya hitung percobaan yang selesai.
    if (
      attempt.status !== undefined &&
      !['completed', 'submitted', 'finished', 'selesai'].includes(
        String(attempt.status).toLowerCase()
      )
    ) {
      return false;
    }

    if (criteria.level && attempt.level !== criteria.level) return false;

    if (
      criteria.grade !== undefined &&
      criteria.grade !== '' &&
      Number(attempt.grade) !== Number(criteria.grade)
    ) {
      return false;
    }

    if (
      criteria.tryoutId &&
      attempt.tryoutId !== criteria.tryoutId
    ) {
      return false;
    }

    const dateValue = attempt.completedAt ?? attempt.submittedAt;

    if (startDate !== null || endDate !== null) {
      if (!dateValue) return false;

      const attemptDate = Date.parse(dateValue);

      if (!Number.isFinite(attemptDate)) return false;

      if (startDate !== null && attemptDate < startDate) return false;
      if (endDate !== null && attemptDate > endDate) return false;
    }

    return Number.isFinite(Number(attempt.score));
  });

  const scores = rows.map((attempt) => Number(attempt.score));

  const attemptCount = scores.length;
  const averageScore = attemptCount
    ? Number(
        (scores.reduce((total, score) => total + score, 0) / attemptCount)
          .toFixed(2)
      )
    : 0;
  const highestScore = attemptCount ? Math.max(...scores) : 0;

  return {
    status: 'success',
    filters: criteria,
    summary: {
      attemptCount,
      averageScore,
      highestScore,
    },
    rows,
  };
}
