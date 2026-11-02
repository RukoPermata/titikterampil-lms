'use client';

/**
 * Modul: Kartu paket tryout (P05)
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menampilkan ringkasan paket, isi tryout, harga, dan status akses.
 */
import Link from 'next/link';
import { formatPrice, getPackageTryoutNames } from '../actions';
import {
  ArrowRightIcon,
  BookIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  FlaskIcon,
  ListIcon,
} from './CatalogIcons';
import styles from '../cbt.module.css';

const MAX_VISIBLE_TRYOUTS = 3;

/**
 * Menyusun deskripsi cadangan saat paket belum memiliki deskripsi khusus.
 * @param {Object} item - Paket tryout.
 * @returns {string} Deskripsi singkat paket.
 */
function fallbackDescription(item) {
  const subject = item?.subject || 'tryout';
  const level = item?.level ? ` ${item.level}` : '';
  const grade = item?.grade !== undefined && item?.grade !== null ? ` kelas ${item.grade}` : '';
  return `Paket ${subject}${level}${grade} untuk persiapan ujian.`;
}

/**
 * Menampilkan satu paket tryout dalam bentuk card katalog.
 * @param {Object} props - Properti komponen.
 * @param {Object} props.item - Paket tryout dari API atau fixture.
 * @param {string} [props.accessLabel=''] - Label akses yang sudah dimiliki siswa.
 * @param {string} props.href - Tujuan tombol dan judul paket.
 * @returns {React.ReactElement} Card paket tryout.
 */
export function PackageCard({ item, accessLabel = '', href }) {
  const tryoutNames = getPackageTryoutNames(item);
  const visibleTryouts = tryoutNames.slice(0, MAX_VISIBLE_TRYOUTS);
  const remainingTryouts = Math.max(0, tryoutNames.length - visibleTryouts.length);
  const tryoutCount = tryoutNames.length || 1;
  const category = item.category || `FOKUS ${item.level ?? 'TRYOUT'}`;
  const description = item.description || fallbackDescription(item);
  const activePeriod = item.activePeriod || 'Permanen';
  const questionCount = Number(item.questionCount) || 0;
  const priceLabel = formatPrice(item.price);
  const owned = Boolean(accessLabel);
  const openOnly = accessLabel === 'Gratis';

  return (
    <article className={`${styles.packageCard} ${owned ? styles.packageCardOwned : ''}`}>
      <div className={styles.packageHeader}>
        <span className={styles.packageIcon}>
          <FlaskIcon size={22} />
        </span>
        <div className={styles.packageHeading}>
          <span className={styles.packageBadge}>{category}</span>
          <h3 className={styles.packageTitle}>
            <Link href={href}>{item.title}</Link>
          </h3>
          <p className={styles.packageDescription}>{description}</p>
        </div>
      </div>

      <dl className={styles.packageInfo}>
        <div className={styles.packageInfoRow}>
          <dt><ListIcon size={14} /><span>Jumlah tryout</span></dt>
          <dd>{tryoutCount} tryout</dd>
        </div>
        <div className={styles.packageInfoRow}>
          <dt><ClockIcon size={14} /><span>Masa aktif</span></dt>
          <dd>{activePeriod}</dd>
        </div>
        <div className={styles.packageInfoRow}>
          <dt><BookIcon size={14} /><span>Soal tersedia</span></dt>
          <dd>{questionCount} soal</dd>
        </div>
      </dl>

      <ul className={styles.packageTryouts}>
        {visibleTryouts.map((name, index) => (
          <li key={`${item.id}-tryout-${index}`}>
            <CheckIcon size={13} />
            <span>{name}</span>
          </li>
        ))}
        {remainingTryouts > 0 && (
          <li className={styles.packageMore}>+{remainingTryouts} tryout lainnya</li>
        )}
      </ul>

      <div className={styles.packageFooter}>
        <span className={styles.packagePrice}>{priceLabel}</span>
        {owned && !openOnly ? (
          <span className={styles.packageOwned}>
            <CheckCircleIcon size={15} />
            {accessLabel}
          </span>
        ) : (
          <Link
            aria-label={`Buka paket ${item.title}`}
            className={styles.packageBuy}
            href={href}
          >
            {openOnly ? 'Buka paket' : 'Beli Paket'}
            <ArrowRightIcon size={14} />
          </Link>
        )}
      </div>
    </article>
  );
}
