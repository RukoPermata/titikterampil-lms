/**
 * Modul: Ikon katalog tryout
 * @author Fauzan Zulfa Muhammad (103022400032)
 * Tanggung jawab: menyediakan ikon SVG lokal agar katalog tidak bergantung pada pustaka baru.
 */

/**
 * Membungkus SVG dengan atribut aksesibilitas yang konsisten.
 * @param {Object} props - Properti ikon.
 * @param {React.ReactNode} props.children - Path ikon.
 * @param {number} [props.size=16] - Ukuran sisi ikon dalam piksel.
 * @param {string} [props.className] - Kelas tambahan.
 * @returns {React.ReactElement} Ikon SVG dekoratif.
 */
function Icon({ children, size = 16, className }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  );
}

/**
 * Ikon labu untuk identitas paket.
 * @param {Object} props - Properti ikon.
 * @returns {React.ReactElement} Ikon flask.
 */
export function FlaskIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 3h6" />
      <path d="M10 3v5.4L4.9 17a2 2 0 0 0 1.7 3h10.8a2 2 0 0 0 1.7-3L14 8.4V3" />
      <path d="M7.5 15h9" />
    </Icon>
  );
}

/**
 * Ikon daftar untuk jumlah tryout.
 * @param {Object} props - Properti ikon.
 * @returns {React.ReactElement} Ikon list.
 */
export function ListIcon(props) {
  return (
    <Icon {...props}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </Icon>
  );
}

/**
 * Ikon jam untuk masa aktif.
 * @param {Object} props - Properti ikon.
 * @returns {React.ReactElement} Ikon clock.
 */
export function ClockIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  );
}

/**
 * Ikon buku untuk jumlah soal.
 * @param {Object} props - Properti ikon.
 * @returns {React.ReactElement} Ikon book.
 */
export function BookIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </Icon>
  );
}

/**
 * Ikon centang untuk item tryout.
 * @param {Object} props - Properti ikon.
 * @returns {React.ReactElement} Ikon check.
 */
export function CheckIcon(props) {
  return (
    <Icon {...props}>
      <path d="m5 12 4 4L19 6" />
    </Icon>
  );
}

/**
 * Ikon centang dalam lingkaran untuk status dimiliki.
 * @param {Object} props - Properti ikon.
 * @returns {React.ReactElement} Ikon check-circle.
 */
export function CheckCircleIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </Icon>
  );
}

/**
 * Ikon panah untuk tombol beli.
 * @param {Object} props - Properti ikon.
 * @returns {React.ReactElement} Ikon arrow-right.
 */
export function ArrowRightIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Icon>
  );
}
