import Link from 'next/link';
import { tryouts } from '@/src/data/mock';
import styles from '../cbt.module.css';

export function TryoutCatalog() {
  return (
    <section className="page-content">
      <p className="eyebrow">TITIK TERAMPIL / P05</p>
      <h1>Katalog tryout</h1>
      <p className="lead">
        Pilih paket latihan sesuai jenjang dan mata pelajaran, lalu buka detailnya
        untuk melihat aturan pengerjaan.
      </p>

      <p className={styles.resultCount}>{tryouts.length} paket tersedia.</p>

      <div className="grid">
        {tryouts.map((item) => (
          <article className="panel" key={item.id}>
            <p className="eyebrow">{item.level} · Kelas {item.grade}</p>
            <h2>{item.title}</h2>
            <p className={styles.cardMeta}>{item.subject} · {item.durationMinutes} menit</p>
            <div className={styles.cardActions}>
              <Link className="button" href={'/student/tryouts/' + item.id}>Lihat detail →</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
