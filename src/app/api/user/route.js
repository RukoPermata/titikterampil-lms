/** Modul: Kompatibilitas endpoint profil tunggal /api/user?id=... */
import { getRecord } from '@/src/lib/mock-api/resources';
import { json, respond } from '@/src/lib/mock-api/handlers';
import { validateParams } from '@/src/lib/mock-api/queries';

/**
 * Membaca profil demo tanpa mengganti ID salah dengan pengguna pertama.
 * @param {Request} request - Permintaan GET dengan id opsional.
 * @returns {Promise<Response>} Profil yang diminta atau HTTP 404.
 */
export async function GET(request) {
  return respond(async () => {
    const params = new URL(request.url).searchParams;
    validateParams(params, ['id']);
    const id = params.has('id') ? params.get('id').trim() : 'student-demo';
    return json({ status: 'success', data: await getRecord('users', id) });
  });
}
