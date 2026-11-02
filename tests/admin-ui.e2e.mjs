/**
 * Pengujian browser admin pada server dengan state demo terpisah.
 * Jalankan setelah build dan server uji port 3157 siap. Playwright Core dipasang
 * sementara di .next/cache/admin-e2e, memakai Chrome lokal tanpa unduhan browser.
 */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { users as fixtures } from '../src/data/mock.js';

assert.equal(process.env.ADMIN_E2E_ALLOW_WRITES, 'true', 'Gunakan server uji dengan state demo terpisah terlebih dahulu.');
const { chromium } = await import(pathToFileURL(join(process.cwd(), '.next/cache/admin-e2e/node_modules/playwright-core/index.mjs')).href);
const output = join(process.cwd(), '.next/cache/admin-ui-check');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true,
  executablePath: process.env.ADMIN_E2E_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const context = await browser.newContext({ baseURL: process.env.ADMIN_E2E_BASE_URL || 'http://localhost:3157',
  viewport: { width: 1280, height: 900 }, locale: 'id-ID', reducedMotion: 'reduce' });
await context.addInitScript(() => sessionStorage.setItem('titikterampil_active_session', JSON.stringify({
  id: 'admin-demo', name: 'Admin Titik Terampil', email: 'admin@titikterampil.id', role: 'admin',
})));
const page = await context.newPage();
const errors = [];
const results = [];
page.on('pageerror', (error) => errors.push(error.message));

/**
 * Menjalankan skenario dan mencatat buktinya.
 * @param {string} title - Nama skenario.
 * @param {Function} action - Langkah dan assertion browser.
 * @returns {Promise<void>} Hasil assertion.
 */
async function check(title, action) {
  await action(); results.push(title); console.log(`PASS ${title}`);
}

/**
 * Memastikan halaman tidak bergulir horizontal; tabel boleh bergulir sendiri.
 * @returns {Promise<void>} Assertion lebar dokumen.
 */
async function noOverflow() {
  const sizes = await page.evaluate(() => ({ width: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth }));
  assert.ok(sizes.scroll <= sizes.width + 1, JSON.stringify(sizes));
}

try {
  await page.goto('/admin/users');
  await page.getByText('6 pengguna', { exact: true }).waitFor();
  await check('Daftar API dan perlindungan akun aktif', async () => {
    assert.equal(await page.getByRole('button', { name: 'Hapus Admin Titik Terampil', exact: true }).isDisabled(), true);
    assert.equal(await page.getByRole('row').count(), 7);
  });
  await check('Pencarian dan filter memakai AND', async () => {
    await page.locator('#users-role-filter').selectOption('teacher');
    await page.locator('#users-search').fill('nadia');
    await page.getByText('Tidak ada hasil yang cocok', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Bersihkan filter', exact: true }).first().click();
    await page.getByText('6 pengguna', { exact: true }).waitFor();
  });
  await check('Pengguna ditambah melalui form dan bertahan sesudah refresh', async () => {
    await page.locator('#user-name').fill('Peserta Uji Integrasi');
    await page.locator('#user-email').fill('admin-ui@example.test');
    await page.locator('#user-whatsapp').fill('081234567899');
    await page.locator('#user-level').selectOption('SMA');
    await page.locator('#user-grade').selectOption('Gap Year');
    await page.getByRole('button', { name: 'Tambah pengguna', exact: true }).click();
    await page.getByText('Pengguna baru berhasil ditambahkan.', { exact: true }).waitFor();
    await page.reload(); await page.getByText('7 pengguna', { exact: true }).waitFor();
    assert.equal(await page.getByRole('row').filter({ hasText: 'admin-ui@example.test' }).count(), 1);
  });
  await check('Member dan dashboard membaca perubahan dari sumber yang sama', async () => {
    const row = page.getByRole('row').filter({ hasText: 'admin-ui@example.test' });
    await row.getByRole('button', { name: 'Aktifkan member Peserta Uji Integrasi', exact: true }).click();
    await row.getByText('Member aktif', { exact: true }).waitFor();
    await page.goto('/admin/dashboard');
    await page.getByRole('button', { name: 'Muat ulang ringkasan', exact: true }).waitFor();
    const value = await page.locator('dt').filter({ hasText: /^Member aktif$/ }).evaluate((node) => node.nextElementSibling.textContent);
    assert.equal(value, '3');
    await page.goto('/admin/users'); await page.getByText('7 pengguna', { exact: true }).waitFor();
  });
  await check('Edit memuat detail, mempertahankan input saat email duplikat, lalu berhasil', async () => {
    await page.getByRole('row').filter({ hasText: 'admin-ui@example.test' }).getByRole('button', { name: 'Edit Peserta Uji Integrasi', exact: true }).click();
    await page.getByRole('heading', { name: 'Edit pengguna', exact: true }).waitFor();
    await page.locator('#user-name').fill('Peserta Uji Diperbarui');
    await page.locator('#user-email').fill('guru@titikterampil.id');
    await page.getByRole('button', { name: 'Simpan perubahan', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'Email sudah digunakan.' }).waitFor();
    assert.equal(await page.locator('#user-name').inputValue(), 'Peserta Uji Diperbarui');
    await page.locator('#user-email').fill('admin-ui@example.test');
    await page.getByRole('button', { name: 'Simpan perubahan', exact: true }).click();
    await page.getByText('Perubahan pengguna tersimpan.', { exact: true }).waitFor();
  });
  await check('Hapus membutuhkan konfirmasi, pembatalan mempertahankan data', async () => {
    page.once('dialog', (dialog) => dialog.dismiss());
    await page.getByRole('button', { name: 'Hapus Peserta Uji Diperbarui', exact: true }).click();
    assert.equal(await page.getByRole('row').filter({ hasText: 'admin-ui@example.test' }).count(), 1);
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Hapus Peserta Uji Diperbarui', exact: true }).click();
    await page.getByText('6 pengguna', { exact: true }).waitFor();
  });
  await check('Penghapusan pengajar yang masih dirujuk menampilkan konflik', async () => {
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Hapus Pengajar Contoh', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'Pengguna masih dirujuk kelas atau transaksi.' }).waitFor();
  });
  await check('Error daftar dan kondisi kosong memiliki pemulihan', async () => {
    await page.route('**/api/users', (route) => route.fulfill({ status: 500, json: { status: 'error', message: 'Server uji sedang tidak tersedia.' } }));
    await page.getByRole('button', { name: 'Muat ulang daftar', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'Server uji sedang tidak tersedia.' }).waitFor();
    await page.unroute('**/api/users');
    await page.getByRole('button', { name: 'Coba muat daftar lagi', exact: true }).click();
    await page.getByText('6 pengguna', { exact: true }).waitFor();
    await page.route('**/api/users', (route) => route.fulfill({ json: { status: 'success', count: 0, data: [] } }));
    await page.getByRole('button', { name: 'Muat ulang daftar', exact: true }).click();
    await page.getByText('Belum ada pengguna', { exact: true }).waitFor();
    await page.unroute('**/api/users');
    await page.getByRole('button', { name: 'Muat ulang daftar', exact: true }).click();
    await page.getByText('6 pengguna', { exact: true }).waitFor();
  });
  await check('Respons pencarian lama tidak menimpa pencarian terbaru', async () => {
    await page.route('**/api/users?*', async (route) => {
      const query = new URL(route.request().url()).searchParams.get('q');
      if (!['Nadia', 'Farhan'].includes(query)) return route.continue();
      await new Promise((resolve) => setTimeout(resolve, query === 'Nadia' ? 700 : 20));
      await route.fulfill({ json: { status: 'success', count: 1, data: fixtures.filter((user) => user.name.includes(query)) } }).catch(() => {});
    });
    const oldRequest = page.waitForRequest((request) => request.url().includes('q=Nadia'));
    await page.locator('#users-search').fill('Nadia'); await oldRequest;
    await page.locator('#users-search').fill('Farhan');
    await page.getByText('1 pengguna sesuai filter', { exact: true }).waitFor();
    await page.waitForTimeout(850);
    assert.equal(await page.getByRole('row').filter({ hasText: 'Farhan Maulana' }).count(), 1);
    assert.equal(await page.getByRole('row').filter({ hasText: 'Nadia Salsabila' }).count(), 0);
    await page.unroute('**/api/users?*');
    await page.getByRole('button', { name: 'Bersihkan filter', exact: true }).click();
    await page.getByText('6 pengguna', { exact: true }).waitFor();
  });
  await check('Kegagalan referensi akademik membatasi form tanpa menyembunyikan daftar', async () => {
    await page.route('**/api/academics', (route) => route.fulfill({ status: 503, json: { status: 'error', message: 'Referensi akademik sedang tidak tersedia.' } }));
    await page.reload();
    await page.getByText('6 pengguna', { exact: true }).waitFor();
    await page.getByRole('alert').filter({ hasText: 'Referensi akademik sedang tidak tersedia.' }).waitFor();
    assert.equal(await page.locator('#user-name').isDisabled(), true);
    await page.unroute('**/api/academics');
    await page.getByRole('button', { name: 'Coba muat pilihan lagi', exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('#user-name').matches(':disabled'));
  });
  await check('Simpan saat debounce berjalan memuat ulang filter terbaru', async () => {
    await page.locator('#user-name').fill('Peserta Uji Race');
    await page.locator('#user-email').fill('admin-race@example.test');
    await page.locator('#user-whatsapp').fill('081234567899');
    await page.locator('#user-level').selectOption('SMA');
    await page.locator('#user-grade').selectOption('12');
    await page.route('**/api/users', async (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      const response = await route.fetch();
      await new Promise((resolve) => setTimeout(resolve, 700));
      await route.fulfill({ response });
    });
    await page.locator('#users-search').fill('Peserta Uji Race');
    await page.getByRole('button', { name: 'Tambah pengguna', exact: true }).click();
    await page.getByText('Pengguna baru berhasil ditambahkan.', { exact: true }).waitFor();
    await page.getByText('1 pengguna sesuai filter', { exact: true }).waitFor();
    await page.unroute('**/api/users');
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Hapus Peserta Uji Race', exact: true }).click();
    await page.getByText('Tidak ada hasil yang cocok', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Bersihkan filter', exact: true }).first().click();
    await page.getByText('6 pengguna', { exact: true }).waitFor();
  });
  await check('Desktop, tablet, dan ponsel tidak menyebabkan overflow halaman', async () => {
    for (const route of ['/admin/users', '/admin/dashboard']) {
      await page.goto(route);
      if (route.endsWith('users')) await page.getByText('6 pengguna', { exact: true }).waitFor();
      else await page.getByRole('button', { name: 'Muat ulang ringkasan', exact: true }).waitFor();
      for (const width of [1280, 768, 360]) {
        await page.setViewportSize({ width, height: 900 });
        await noOverflow();
        if (width === 1280 && route.endsWith('users')) {
          const table = page.getByRole('region', { name: 'Tabel pengguna, geser ke samping untuk melihat semua kolom' });
          const dimensions = await table.evaluate((node) => ({ width: node.clientWidth, scroll: node.scrollWidth }));
          assert.ok(dimensions.scroll <= dimensions.width + 1, 'Tindakan tabel harus terlihat penuh pada desktop.');
        }
        if (width !== 768) await page.screenshot({ path: join(output, `${route.endsWith('users') ? 'users' : 'dashboard'}-${width}.png`), fullPage: true });
      }
    }
  });
  assert.deepEqual(errors, [], 'Tidak ada error JavaScript pada browser.');
  await writeFile(join(output, 'results.json'), JSON.stringify({ passed: results, pageErrors: errors }, null, 2));
  console.log(`Completed ${results.length} browser scenarios; screenshots: ${output}`);
} finally {
  await browser.close();
}
