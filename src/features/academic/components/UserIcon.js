/**
 * Modul: Ikon antarmuka Manajemen Pengguna
 * @author Rayazka Aris (103022400096)
 * Tanggung jawab: menjaga ikon SVG satu gaya tanpa dependency tambahan.
 * @todo Ekstrak ke komponen bersama bila halaman admin lain membutuhkannya.
 */
const paths = {
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
  edit: <><path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15l-1 6Z" /></>,
  trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></>,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  left: <path d="m14 6-6 6 6 6" />,
  right: <path d="m10 6 6 6-6 6" />,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-3-5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
};

/**
 * Menggambar ikon dekoratif; nama aksesibel ditempatkan pada tombol.
 * @param {Object} props - Properti pilihan ikon.
 * @param {string} props.name - Nama ikon yang tersedia.
 * @returns {React.ReactElement} SVG ukuran 20px yang disembunyikan dari pembaca layar.
 */
export function UserIcon({ name }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}
