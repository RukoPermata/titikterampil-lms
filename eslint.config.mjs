/**
 * Modul: Konfigurasi pemeriksaan kode frontend
 * @author Tim Titik Terampil; koordinator Kaisar dan Rayazka
 * Tanggung jawab: menjaga pemeriksaan React dan Next.js tetap konsisten.
 * @todo Sepakati aturan tambahan ketika kebutuhan tim berkembang.
 */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // 1. Gunakan aturan resmi Next.js dan React.
  // 2. Abaikan output build supaya pemeriksaan hanya membaca source.
  globalIgnores([
    // TODO: Tambahkan folder output alat lain bila benar-benar digunakan.
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
