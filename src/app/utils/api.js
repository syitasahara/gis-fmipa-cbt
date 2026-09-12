// API utility functions for backend integration
// Direct call ke GIS API (tanpa proxy Next.js).
// CATATAN: BE harus mengizinkan CORS untuk origin frontend ini.
const API_BASE_URL = 'https://api.gisofficial.com/v1';

// Get token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    console.log('🔍 TOKEN GET: Retrieved token:', token ? '✅ Token exists' : '❌ No token found');
    return token;
  }
  console.log('🔍 TOKEN GET: Window not available');
  return null;
};

// Set token to localStorage and cookies
const setToken = (token) => {
  if (typeof window !== 'undefined') {
    console.log('💾 TOKEN SET: Storing token...');
    localStorage.setItem('authToken', token);
    // Also set in cookies for middleware
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`; // 24 hours
    console.log('💾 TOKEN SET: Token stored in localStorage and cookies');
    console.log('💾 TOKEN SET: Verification - get token:', getToken() ? '✅ Success' : '❌ Failed');
  } else {
    console.log('💾 TOKEN SET: Window not available');
  }
};

// Remove token from localStorage and cookies
const removeToken = () => {
  if (typeof window !== 'undefined') {
    console.log('🗑️ TOKEN REMOVE: Removing token...');
    localStorage.removeItem('authToken');
    // Also remove the stored user id and peserta id
    localStorage.removeItem('authUserId');
    localStorage.removeItem('authPesertaId');
    // Also remove from cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    console.log('🗑️ TOKEN REMOVE: Token removed');
  }
};

// User id helpers — BE tidak punya endpoint byAuth, jadi id dari user
// disimpan saat login dan dipakai untuk fetch user via /auth/user/{id}
const setUserId = (id) => {
  if (typeof window !== 'undefined') {
    if (id === null || id === undefined) {
      localStorage.removeItem('authUserId');
    } else {
      localStorage.setItem('authUserId', String(id));
      console.log('💾 USER ID SET: Stored user id:', id);
    }
  }
};

const getUserId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authUserId');
  }
  return null;
};

// Peserta id helpers — response login membawa pesertaId (lihat swagger
// auth.ResponseLoginUser), dipakai untuk fetch /master/peserta/{id}
const setPesertaId = (id) => {
  if (typeof window !== 'undefined') {
    if (id === null || id === undefined) {
      localStorage.removeItem('authPesertaId');
    } else {
      localStorage.setItem('authPesertaId', String(id));
      console.log('💾 PESERTA ID SET: Stored pesertaId:', id);
    }
  }
};

const getPesertaId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authPesertaId');
  }
  return null;
};

// Generic API call function (direct ke GIS API)
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      err.status = response.status; // supaya pemanggil bisa bedakan 404/401/dll
      throw err;
    }

    return response.json();
  } catch (error) {
    // Enhanced error handling for network/CORS issues
    // (TypeError 'Failed to fetch' = koneksi gagal ATAU respons diblokir CORS)
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Koneksi ke server gagal. Periksa koneksi internet Anda.');
    }
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  login: async (email, password) => {
    console.log('🔐 AUTH API: Attempting login for:', email);

    try {
      // Direct call ke GIS API
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('🔐 AUTH API: Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      console.log("token", data)
      // Normalisasi bentuk response GIS API (top-level atau nested di `data` / `authorization`)
      const token = data?.data?.token?.AccessToken || data.access_token || data.authorizationToken
        || data.data?.token || data.data?.access_token || data.authorization?.token || null;

      const user = data.user || data.data?.user || data.userData || null;

      // BE tidak punya endpoint byAuth — id disimpan saat login
      // dan dipakai untuk fetch user via /auth/user/{id}
      let userId = user?.id ?? user?.userId ?? user?.user_id
        ?? data.userId ?? data.user_id
        ?? data.data?.userId ?? data.data?.user_id
        ?? null;

      // Fallback: response Cognito/JWT sering tidak membawa id terpisah —
      // ambil dari payload token (sub/username)
      if (!userId && token) {
        try {
          const payload = decodeJWTPayload(token);
          userId = payload?.sub || payload?.username || payload?.user_id || payload?.id || null;
          if (userId) {
            console.log('🔐 AUTH API: userId extracted from token payload:', userId);
          }
        } catch (decodeError) {
          console.warn('🔐 AUTH API: Could not extract userId from token:', decodeError.message);
        }
      }

      // Store token if present
      if (token) {
        console.log('🔐 AUTH API: Token received, storing...');
        setToken(token);
        console.log('🔐 AUTH API: Token stored successfully');
        console.log('🔐 AUTH API: Token verification:', getToken());
      } else {
        console.warn('🔐 AUTH API: No token in response!', data);
      }

      // Store user id if present (dipakai getCurrentUser via /auth/user/{id})
      if (userId) {
        setUserId(userId);
      } else {
        console.warn('🔐 AUTH API: No user id in response!', data);
      }

      // Simpan pesertaId dari response login (dipakai fetch /master/peserta/{id})
      const pesertaId = user?.pesertaId ?? user?.peserta_id
        ?? data.pesertaId ?? data.data?.user?.pesertaId ?? data.data?.pesertaId
        ?? null;
      if (pesertaId) {
        setPesertaId(pesertaId);
      } else {
        console.warn('🔐 AUTH API: No pesertaId in response!', data);
      }

      return { token, user, userId, pesertaId, message: data.message || 'Login successful' };
    } catch (error) {
      console.error('🔐 AUTH API: Login failed:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Koneksi ke server gagal. Periksa koneksi internet Anda.');
      }
      throw error;
    }
  },

  register: async (userData) => {
    return await apiCall('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    try {
      await apiCall('/logout', { method: 'POST' });
    } finally {
      removeToken();
    }
  },

  getCurrentUser: async () => {
    console.log('👤 AUTH API: Getting current user...');

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // BE tidak punya endpoint byAuth — pakai /auth/user/{id}. Id utama dari
      // localStorage (disimpan saat login); fallback decode dari token JWT
      const userId = getUserId() || getCurrentUserId();
      if (!userId) {
        throw new Error('No user id found. Please login again.');
      }

      // Direct call ke GIS API
      const response = await fetch(`${API_BASE_URL}/auth/user/${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));
      console.log('👤 AUTH API: Current user response:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to get user data');
      }

      // Normalize response: user object bisa langsung, atau dibungkus `data` / `user`
      return data.user || data.data || data;
    } catch (error) {
      console.error('👤 AUTH API: Get current user failed:', error);
      throw error;
    }
  },

  // GET /v1/master/peserta/{id} pakai Bearer token.
  // Response BE dibungkus: { data: { nama, jenjang (int), sekolah, kelas, ... } }
  getPeserta: async (pesertaIdOverride = null) => {
    console.log('🧑‍🎓 AUTH API: Getting peserta data...');

    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const pesertaId = pesertaIdOverride || getPesertaId();
    if (!pesertaId) {
      throw new Error('No peserta id found. Please login again.');
    }

    // Direct call ke GIS API
    const response = await fetch(`${API_BASE_URL}/master/peserta/${encodeURIComponent(pesertaId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => ({}));
    console.log('🧑‍🎓 AUTH API: Peserta response:', data);

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to get peserta data');
    }

    // Normalisasi: peserta object bisa langsung atau dibungkus `data`
    return data.data || data;
  },

  // User + data peserta sekaligus. Jenjang yang valid untuk fetch soal ada di
  // record peserta (integer) — bukan di user. Kalau fetch peserta gagal,
  // tetap kembalikan data user dasar.
  getCurrentUserWithPeserta: async () => {
    const user = await authAPI.getCurrentUser();
    console.log('👤 AUTH API: Base user:', user);

    try {
      const peserta = await authAPI.getPeserta(user?.pesertaId);
      const merged = { ...user, peserta };

      if (peserta?.nama) merged.nama = peserta.nama;
      if (peserta?.sekolah) merged.sekolah = peserta.sekolah;
      if (peserta?.kelas) merged.kelas = peserta.kelas;
      if (peserta?.jenjang !== undefined && peserta?.jenjang !== null) {
        const label = questionsAPI.jenjangIdToLabel(peserta.jenjang);
        if (label) merged.jenjang = label;
      }

      console.log('👤 AUTH API: User merged with peserta:', merged);
      return merged;
    } catch (error) {
      console.warn('👤 AUTH API: Peserta data unavailable, using base user:', error.message);
      return user;
    }
  },

  forgotPassword: async (email) => {
    return await apiCall('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (email, token, password, passwordConfirmation) => {
    return await apiCall('/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });
  },
};

// Questions API functions
export const questionsAPI = {
  // Mapping jenjang ('sd'/'smp'/'1'/'2') → ID integer di BE.
  // Nilai ID dari .env (konfirmasi ke admin BE).
  // Dipakai bersama oleh module mode (simulasi/tryout/penyisihan).
  jenjangToId: (jenjang) => {
    if (jenjang === null || jenjang === undefined) return null;
    const s = String(jenjang).trim().toLowerCase();
    if (s === 'sd' || s === '1') return parseInt(process.env.NEXT_PUBLIC_JENJANG_SD_ID, 10) || 1;
    if (s === 'smp' || s === '2') return parseInt(process.env.NEXT_PUBLIC_JENJANG_SMP_ID, 10) || 2;
    return null;
  },

  // Kebalikan jenjangToId: ID integer BE → label 'sd'/'smp'
  jenjangIdToLabel: (id) => {
    if (id === null || id === undefined) return null;
    const sdId = parseInt(process.env.NEXT_PUBLIC_JENJANG_SD_ID, 10) || 1;
    const smpId = parseInt(process.env.NEXT_PUBLIC_JENJANG_SMP_ID, 10) || 2;
    const n = parseInt(id, 10);
    if (n === sdId) return 'sd';
    if (n === smpId) return 'smp';
    return null;
  },

  // GET /v1/master/pertanyaan/with-answers?jenjang={int}&jenis_soal={int}
  // Response BE: { data: [{ id, soal, jenjang, jenisSoal, gambar, jawaban: [{id, jawaban, benar}] }] }
  // Dinormalisasi ke bentuk yang dikonsumsi transformApiQuestions() di cbt.js
  getWithAnswers: async (jenjangId, jenisSoalId) => {
    const params = new URLSearchParams();
    if (jenjangId) params.append('jenjang', String(jenjangId));
    if (jenisSoalId) params.append('jenis_soal', String(jenisSoalId));
    const qs = params.toString();

    console.log(`📚 QUESTIONS API: Fetching with-answers (jenjang=${jenjangId}, jenis_soal=${jenisSoalId})`);
    const response = await apiCall(`/master/pertanyaan/with-answers${qs ? `?${qs}` : ''}`);

    const list = Array.isArray(response) ? response : (response.data || []);
    if (!Array.isArray(list)) {
      throw new Error('Format response soal tidak dikenal');
    }

    // Normalisasi: field BE → bentuk internal cbt (question_text/answers[].answer_text)
    return list.map((q) => ({
      id: q.id,
      question_text: q.soal || '',
      type: q.gambar ? 'image' : 'text',
      level: q.jenjang === 1 ? 'SD' : q.jenjang === 2 ? 'SMP' : '',
      question_img: q.gambar || null,
      answers: Array.isArray(q.jawaban)
        ? q.jawaban.map((a) => ({
            id: a.id,
            answer_text: a.jawaban || '',
            // catatan: flag `benar` sengaja TIDAK diteruskan ke client
          }))
        : [],
    }));
  },

  getQuestions: async (level = null) => {
    const queryParam = level ? `?level=${level}` : '';
    return await apiCall(`/exam/questions${queryParam}`);
  },

  // Get all questions for a specific level (for randomization)
  getAllQuestions: async (level = null) => {
    const queryParam = level ? `?level=${level}&all=true` : '?all=true';
    return await apiCall(`/exam/questions${queryParam}`);
  },

  // Get randomized questions for user
  getRandomizedQuestions: async (level = null, userId = null, limit = null) => {
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (userId) params.append('user_id', userId);
    if (limit) params.append('limit', limit);
    params.append('randomized', 'true');
    
    const queryParam = params.toString() ? `?${params.toString()}` : '';
    return await apiCall(`/exam/questions${queryParam}`);
  },

  getQuestion: async (id) => {
    return await apiCall(`/exam/questions/${id}`);
  },

  createQuestion: async (questionData) => {
    return await apiCall('/exam/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  },

  updateQuestion: async (id, questionData) => {
    return await apiCall(`/exam/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
  },

  deleteQuestion: async (id) => {
    return await apiCall(`/exam/questions/${id}`, {
      method: 'DELETE',
    });
  },

  getQuestionCount: async (level = null) => {
    const queryParam = level ? `?level=${level}` : '';
    return await apiCall(`/exam/questions/count${queryParam}`);
  },
};

// User Answers API functions — BE: /v1/transaction/jawaban-user
export const answersAPI = {
  // POST /v1/transaction/jawaban-user — simpan satu jawaban peserta.
  // Body (swagger RequestJawabanUserFormat): { pesertaId, pertanyaanId, jawabanId }
  submitAnswer: async (pesertaId, pertanyaanId, jawabanId) => {
    const response = await apiCall('/transaction/jawaban-user', {
      method: 'POST',
      body: JSON.stringify({
        pesertaId,
        pertanyaanId,
        jawabanId,
      }),
    });
    // Response BE dibungkus response.Base: { data: { id, ... } } — buka supaya
    // pemanggil bisa langsung baca `id` record-nya (dipakai untuk DELETE saat batal)
    return response?.data ?? response;
  },

  // DELETE /v1/transaction/jawaban-user/{id} — hapus record jawaban peserta.
  // ⚠️ id = id RECORD jawaban-user (dari POST / refetch), bukan id jawaban
  cancelAnswer: async (answerId) => {
    console.log('Calling cancelAnswer API for recordId:', answerId);
    try {
      const result = await apiCall(`/transaction/jawaban-user/${answerId}`, {
        method: 'DELETE',
      });
      console.log('cancelAnswer API success:', result);
      return result;
    } catch (error) {
      console.error('cancelAnswer API error:', error);
      throw error;
    }
  },

  // GET /v1/transaction/jawaban-user/{id} — detail satu record jawaban peserta.
  // Dipakai untuk cek apakah peserta sudah/belum menjawab soal tertentu.
  // Return: record { id, pesertaId, pertanyaanId, jawabanId, ... },
  // atau null kalau record tidak ditemukan (404 → belum/batal menjawab)
  getAnswerById: async (jawabanUserRecordId) => {
    try {
      const response = await apiCall(`/transaction/jawaban-user/${jawabanUserRecordId}`);
      return response?.data ?? response;
    } catch (error) {
      if (error.status === 404) {
        console.log('📋 ANSWERS: Record jawaban tidak ditemukan (belum/batal menjawab):', jawabanUserRecordId);
        return null;
      }
      throw error;
    }
  },

  // GET /v1/transaction/jawaban-user/peserta/{pesertaId} — semua jawaban peserta.
  // Field BE (pertanyaanId/jawabanId) dinormalisasi ke question_id/answer_id
  // sesuai bentuk yang dikonsumsi cbt.js (loadUserAnswers / refetchAnswers)
  getUserAnswers: async (pesertaId) => {
    const response = await apiCall(`/transaction/jawaban-user/peserta/${pesertaId}`);
    const list = Array.isArray(response) ? response : (response.data || []);
    return (Array.isArray(list) ? list : []).map((a) => ({
      id: a.id,
      question_id: a.pertanyaanId ?? a.pertanyaan_id,
      answer_id: a.jawabanId ?? a.jawaban_id,
    }));
  },

  toggleDoubt: async (answerId) => {
    console.log('Calling toggleDoubt API for answerId:', answerId);
    try {
      const result = await apiCall(`/exam/user-answers/${answerId}/toggle-doubt`, {
        method: 'PATCH',
      });
      console.log('toggleDoubt API success:', result);
      return result;
    } catch (error) {
      console.error('toggleDoubt API error:', error);
      throw error;
    }
  },

  unsetDoubt: async (answerId) => {
    return await apiCall(`/exam/user-answers/${answerId}/unset-doubt`, {
      method: 'PATCH',
    });
  },

  getResults: async (userId) => {
    console.log('Getting results for userId:', userId, typeof userId);
    if (typeof userId === 'object') {
      console.error('userId is an object:', userId);
      throw new Error('Invalid userId: expected string or number, got object');
    }
    return await apiCall(`/exam/results/${userId}`);
  },

  // POST /v1/transaction/log-submit — catat submit peserta (swagger: "Mencatat submit peserta").
  // Payload (RequestLogSubmitFormat): { durasiWaktu, id, isAutosubmit, pelanggaran, pesertaId }
  // Respons BE tidak membawa hasil skor — endpoint ini hanya MENCATAT submit.
  submitExam: async (pesertaId, { durationInMinutes, totalViolations, isAutoSubmit }) => {
    const response = await apiCall('/transaction/log-submit', {
      method: 'POST',
      body: JSON.stringify({
        // ⚠️ Format durasiWaktu belum terdokumentasi di swagger — kirim menit sebagai
        // string. Sesuaikan di sini kalau BE minta format lain (mis. "HH:MM:SS").
        durasiWaktu: String(durationInMinutes),
        isAutosubmit: Boolean(isAutoSubmit),
        pelanggaran: typeof totalViolations === 'number' ? totalViolations : parseInt(totalViolations, 10) || 0,
        pesertaId,
      }),
    });
    return response;
  },
};

// Decode payload JWT dengan aman (base64url: '-'→'+', '_'→'/', + padding).
// Token Cognito/JWT sering mengandung karakter base64url yang bikin atob() polos gagal.
const decodeJWTPayload = (token) => {
  const part = token.split('.')[1];
  if (!part) return null;
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return JSON.parse(atob(padded));
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  console.log('🔐 AUTH CHECK: Checking if user is authenticated...');

  const token = getToken();
  if (!token) {
    console.log('🔐 AUTH CHECK: ❌ No token found');
    return false;
  }

  console.log('🔐 AUTH CHECK: ✅ Token found, validating...');

  try {
    // Decode JWT untuk cek kadaluarsa. Kalau bukan JWT (decode gagal),
    // anggap valid dan biarkan server memvalidasi via getCurrentUser()
    const payload = decodeJWTPayload(token);

    if (!payload) {
      console.warn('🔐 AUTH CHECK: ⚠️ Token is not a JWT, assuming valid');
      return true;
    }

    console.log('🔐 AUTH CHECK: Token payload:', payload);

    // Check if token has expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.log('🔐 AUTH CHECK: ❌ Token has expired');
      removeToken();
      return false;
    }

    console.log('🔐 AUTH CHECK: ✅ Token is valid');
    return true;
  } catch (error) {
    // Non-JWT (opaque) token: keep it, server-side validation will reject if truly invalid
    console.warn('🔐 AUTH CHECK: ⚠️ Token is not a standard JWT, assuming valid:', error.message);
    return true;
  }
};

// Helper function to get current user ID — pakai id yang disimpan saat login;
// fallback decode JWT kalau id belum tersimpan (misal session lama)
export const getCurrentUserId = () => {
  const storedId = getUserId();
  if (storedId) {
    console.log('🆔 USER ID: ✅ Using stored userId:', storedId);
    return storedId;
  }

  console.log('🆔 USER ID: No stored userId, trying to extract from token...');

  const token = getToken();
  if (!token) {
    console.log('🆔 USER ID: ❌ No token found');
    return null;
  }

  try {
    const payload = decodeJWTPayload(token);
    console.log('🆔 USER ID: Token payload:', payload);

    // Cognito: `sub` (UUID) atau `username`; JWT umum: user_id / id
    const userId = payload?.sub || payload?.username || payload?.user_id || payload?.id || null;
    console.log('🆔 USER ID: ✅ Extracted userId:', userId, typeof userId);
    return userId;
  } catch (error) {
    console.error('🆔 USER ID: ❌ Error decoding token:', error);
    return null;
  }
};

// Export token management functions
export { getToken, setToken, removeToken, getUserId, setUserId, getPesertaId, setPesertaId };
