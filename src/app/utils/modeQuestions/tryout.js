import { questionsAPI } from '../api';

// Mode TRYOUT — ambil soal dari BE:
// GET /v1/master/pertanyaan/with-answers?jenjang={int}&jenis_soal={int}
// ID jenis_soal dari .env (⚠️ konfirmasi nilai integer-nya ke admin BE)
const JENIS_SOAL_ID = parseInt(process.env.NEXT_PUBLIC_JENIS_SOAL_TRYOUT, 10) || 2;

export const modeKey = 'tryout';
export const label = 'Tryout';

// Ambil daftar soal mode Tryout untuk jenjang ('sd'/'smp').
// Return: array soal ter-normalisasi siap dipakai cbt.js (transformApiQuestions).
export async function getQuestions(jenjang) {
  const jenjangId = questionsAPI.jenjangToId(jenjang);
  if (!jenjangId) {
    throw new Error(`Jenjang tidak dikenal: ${jenjang}`);
  }
  return questionsAPI.getWithAnswers(jenjangId, JENIS_SOAL_ID);
}
