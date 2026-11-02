import { roleLabels } from '../validation.js';
import styles from './admin.module.css';

/**
 * Menampilkan kontrol filter dengan label yang tetap terbaca pada layar kecil.
 * @param {Object} props - Nilai filter, callback, ref pencarian, dan status sibuk.
 * @returns {React.ReactElement} Kontrol pencarian dan filter.
 */
export function UserFilters({ filters, onChange, onClear, disabled, searchRef }) {
  return <section className={styles.toolbar} aria-label="Pencarian dan filter pengguna">
    <div className={styles.filterGrid}>
      <div>
        <label className={styles.label} htmlFor="users-search">Cari pengguna</label>
        <input ref={searchRef} className={styles.input} id="users-search" type="search" value={filters.q}
          placeholder="Nama atau email" disabled={disabled} onChange={(event) => onChange('q', event.target.value)} />
      </div>
      <div>
        <label className={styles.label} htmlFor="users-role-filter">Peran</label>
        <select className={styles.input} id="users-role-filter" value={filters.role} disabled={disabled}
          onChange={(event) => onChange('role', event.target.value)}>
          <option value="">Semua peran</option>
          {Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div>
        <label className={styles.label} htmlFor="users-member-filter">Status member</label>
        <select className={styles.input} id="users-member-filter" value={filters.isMember}
          disabled={disabled || Boolean(filters.role && filters.role !== 'student')}
          onChange={(event) => onChange('isMember', event.target.value)}>
          <option value="">Semua status</option><option value="true">Member aktif</option><option value="false">Nonmember</option>
        </select>
      </div>
      <button className={`${styles.button} ${styles.secondary}`} type="button" disabled={disabled} onClick={onClear}>Bersihkan filter</button>
    </div>
  </section>;
}
