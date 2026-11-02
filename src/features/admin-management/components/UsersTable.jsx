import { roleLabels } from '../validation.js';
import styles from './admin.module.css';

/**
 * Menampilkan pengguna, member, dan tindakan dengan ID record yang stabil.
 * @param {Object} props - Daftar, status, akun aktif, dan callback tindakan.
 * @returns {React.ReactElement} Tabel responsif atau kondisi kosong.
 */
export function UsersTable({ users, loading, disabled, pending, currentUserId, editingId, hasFilters, onEdit, onMember, onDelete, onClear }) {
  if (!users.length) return <div className={styles.empty} role="status">
    <strong>{loading ? 'Memuat pengguna…' : hasFilters ? 'Tidak ada hasil yang cocok' : 'Belum ada pengguna'}</strong>
    <p>{loading ? 'Daftar pengguna sedang diambil dari server.' : hasFilters ? 'Coba kata pencarian atau filter yang berbeda.' : 'Tambahkan pengguna melalui form di halaman ini.'}</p>
    {!loading && hasFilters && <button className={`${styles.button} ${styles.secondary}`} type="button" onClick={onClear}>Bersihkan filter</button>}
  </div>;
  return <><p className={`${styles.hint} ${styles.tableHint}`}>Geser tabel ke samping untuk melihat member dan tindakan.</p>
    <div className={styles.scroll} tabIndex={0} role="region" aria-label="Tabel pengguna, geser ke samping untuk melihat semua kolom" aria-busy={loading}>
    <table className={styles.table}>
      <caption className="sr-only">Daftar pengguna Titik Terampil dan tindakan pengelolaan</caption>
      <thead><tr><th scope="col">Pengguna</th><th scope="col">Peran / jenjang</th><th scope="col">Member</th><th scope="col">Tindakan</th></tr></thead>
      <tbody>{users.map((user) => {
        const isSelf = user.id === currentUserId;
        return <tr key={user.id}>
          <th scope="row">{user.name}{isSelf && <span className={`${styles.badge} ml-2`}>Akun Anda</span>}
            <div className={styles.muted}>{user.email}</div><div className={styles.muted}>WA: {user.whatsapp}</div>
          </th>
          <td>{roleLabels[user.role]}{user.role === 'student' && <div className={styles.muted}>{user.level} · {typeof user.grade === 'number' ? `Kelas ${user.grade}` : user.grade}</div>}</td>
          <td>{user.role === 'student' ? <>
            <span className={`${styles.badge} ${user.isMember ? styles.member : ''}`}>{user.isMember ? 'Member aktif' : 'Nonmember'}</span>
            <div className="mt-2"><button className={`${styles.button} ${styles.secondary}`} type="button" disabled={disabled || loading || editingId === user.id}
              title={editingId === user.id ? 'Ubah status member melalui form yang sedang diedit.' : undefined}
              aria-label={`${user.isMember ? 'Cabut' : 'Aktifkan'} member ${user.name}`} onClick={() => onMember(user)}>
              {pending?.kind === 'member' && pending.id === user.id ? 'Menyimpan…' : user.isMember ? 'Cabut member' : 'Aktifkan member'}
            </button></div>
          </> : <span className={styles.muted}>Khusus peserta</span>}</td>
          <td><div className={styles.actions}>
            <button className={`${styles.button} ${styles.secondary}`} type="button" disabled={disabled || loading} aria-label={`Edit ${user.name}`} onClick={() => onEdit(user)}>Edit</button>
            <button className={`${styles.button} ${styles.danger}`} type="button" disabled={disabled || loading || isSelf}
              title={isSelf ? 'Akun yang sedang digunakan tidak dapat dihapus dari halaman ini.' : undefined}
              aria-label={`Hapus ${user.name}`} onClick={() => onDelete(user)}>
              {pending?.kind === 'delete' && pending.id === user.id ? 'Menghapus…' : 'Hapus'}
            </button>
          </div></td>
        </tr>;
      })}</tbody>
    </table>
  </div></>;
}
