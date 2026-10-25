/**
 * Modul: Pratinjau bersama untuk kerangka halaman MVP
 * @author Tim Titik Terampil; koordinator integrasi: Kaisar dan Rayazka
 * Tanggung jawab: menyediakan tampilan awal sebelum implementasi tiap pemilik modul.
 * @todo Ganti pratinjau setiap halaman dengan komponen dan logika modul sebenarnya.
 */
import Link from 'next/link';
import { findPage, demoHref, pages } from '@/src/config/pages';
import {
  tryouts, classes, questions, assignments, users, academics, getRecord,
} from '@/src/data/mock';

const detailCollections = {
  P06: tryouts, P07: tryouts, P08: tryouts, P11: classes, P12: assignments,
};
const listCollections = {
  P05: tryouts, P10: classes, P15: classes, P19: users,
  P20: academics, P21: classes, P22: questions, P23: tryouts,
};

/**
 * Menampilkan pratinjau modul berdasarkan metadata halaman dan ID data contoh.
 * @param {Object} props - Parameter tampilan kerangka.
 * @param {string} props.pageId - ID halaman P01–P24 dari konfigurasi bersama.
 * @param {string} [props.recordId] - ID entitas untuk pratinjau halaman detail.
 * @returns {React.ReactElement} Data contoh, catatan implementasi atau pesan tidak ditemukan.
 */
export function ModulePage({ pageId, recordId }) {
  // TODO: Pemilik halaman mengganti pratinjau ini dengan UI dan logika modulnya.
  // 1. Baca metadata dan tangani ID halaman yang belum terdaftar.
  const page = findPage(pageId);
  if (!page) {
    return <section className="page-content"><h1>Modul tidak ditemukan</h1></section>;
  }
  // 2. Cari record contoh bila halaman membutuhkan ID dinamis.
  const record = recordId && detailCollections[pageId]
    ? getRecord(detailCollections[pageId], recordId)
    : null;

  // 3. Jangan menampilkan data lain sebagai pengganti ID yang tidak ditemukan.
  if (recordId && !record) {
    return (
      <section className="page-content">
        <h1>Data contoh tidak ditemukan</h1>
        <p>ID ini belum tersedia dalam data demo.</p>
        <Link href="/login">Kembali ke pilihan peran</Link>
      </section>
    );
  }

  // 4. Siapkan daftar dan tautan halaman terkait untuk memandu integrasi.
  const list = listCollections[pageId] ?? [];
  const related = pages.filter((item) => item.role === page.role && item.id !== page.id);

  // 5. TODO: Pemilik modul mengganti pratinjau dengan UI, state dan handler sebenarnya.
  return (
    <section className="page-content">
      <p className="eyebrow">TITIK TERAMPIL / {page.id}</p>
      <h1>{page.title}</h1>
      <p className="lead">{page.description}</p>
      <div className="notice">
        <strong>Kerangka frontend</strong> · Halaman ini belum mengimplementasikan
        seluruh fitur. Data yang ditampilkan adalah data contoh.
      </div>

      {record && (
        <article className="panel">
          <h2>{record.title}</h2>
          <p>{record.instructions || 'Detail data contoh untuk pengembangan halaman.'}</p>
          {pageId === 'P06' && (
            <>
              <p>{record.durationMinutes} menit · {record.level} · Kelas {record.grade}</p>
              <Link href={'/student/exams/' + record.id}>Lihat kerangka ruang ujian →</Link>
            </>
          )}
          {pageId === 'P07' && (
            <>
              <p>Timer, pemilihan jawaban dan submit belum aktif.</p>
              <h3>{questions[0].prompt}</h3>
              <ol type="A">
                {questions[0].options.map((option) => <li key={option}>{option}</li>)}
              </ol>
            </>
          )}
          {pageId === 'P11' && (
            <Link href="/student/assignments/demo">Lihat tugas contoh →</Link>
          )}
        </article>
      )}

      <div className="grid">
        {list.map((item, index) => (
          <article className="panel" key={item.id || item.level}>
            <p className="eyebrow">DATA CONTOH {String(index + 1).padStart(2, '0')}</p>
            <h2>{item.title || item.name || item.level || item.prompt}</h2>
            <p>
              {item.subject || item.role || (
                item.grades ? 'Kelas ' + item.grades.join(', ') : 'Data awal modul'
              )}
            </p>
            {pageId === 'P05' && (
              <Link href={'/student/tryouts/' + item.id}>Detail tryout →</Link>
            )}
            {pageId === 'P10' && (
              <Link href={'/student/classes/' + item.id}>Buka kelas →</Link>
            )}
          </article>
        ))}
      </div>

      <article className="panel development">
        <h2>Catatan pengembangan</h2>
        <p><strong>Penanggung jawab:</strong> {page.owner}</p>
        <p><strong>TODO:</strong> {page.todo}</p>
        <p>
          Mulai dari fungsi halaman pada{' '}
          <code>app{page.route === '/' ? '' : page.route}/page.js</code>
          {' '}dan fungsi modul di <code>src/features</code>.
        </p>
      </article>
      <details>
        <summary>Peta halaman {page.role}</summary>
        <div className="route-map">
          {related.map((item) => (
            <Link href={demoHref(item.route)} key={item.id}>{item.id} · {item.title}</Link>
          ))}
        </div>
      </details>
      {pageId === 'P03' && (
        <Link className="button" href="/login">Coba sesi demo →</Link>
      )}
    </section>
  );
}
