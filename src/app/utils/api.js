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
    // Also remove the stored user id
    localStorage.removeItem('authUserId');
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
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
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

      const data = await response.json().catch(() => ({}));
      console.log('🔐 AUTH API: Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      // Normalisasi bentuk response GIS API (top-level atau nested di `data` / `authorization`)
      const token = data.token || data.access_token || data.authorizationToken
        || data.data?.token || data.data?.access_token || data.authorization?.token || null;

      const user = data.user || data.data?.user || data.userData || null;

      // BE tidak punya endpoint byAuth — id disimpan saat login
      // dan dipakai untuk fetch user via /auth/user/{id}
      const userId = user?.id ?? user?.userId ?? user?.user_id
        ?? data.userId ?? data.user_id
        ?? data.data?.userId ?? data.data?.user_id
        ?? null;

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

      return { token, user, userId, message: data.message || 'Login successful' };
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

      // BE tidak punya endpoint byAuth — pakai /auth/user/{id} dengan id yang
      // disimpan saat login
      const userId = getUserId();
      if (!userId) {
        throw new Error('No user id found. Please login again.');
      }

      // Direct call ke GIS API
      const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
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

// User Answers API functions
export const answersAPI = {
  submitAnswer: async (userId, questionId, answerId) => {
    return await apiCall('/exam/user-answers', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        question_id: questionId,
        answer_id: answerId,
      }),
    });
  },

  cancelAnswer: async (answerId) => {
    console.log('Calling cancelAnswer API for answerId:', answerId);
    try {
      const result = await apiCall(`/exam/user-answers/${answerId}`, {
        method: 'DELETE',
      });
      console.log('cancelAnswer API success:', result);
      return result;
    } catch (error) {
      console.error('cancelAnswer API error:', error);
      throw error;
    }
  },

  getUserAnswers: async (userId) => {
    return await apiCall(`/exam/user-answers/${userId}`);
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

  // Submit final exam with additional data
  submitExam: async (userId, examData) => {
    return await apiCall('/exam/submit', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        ...examData
      })
    });
  },
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
    // Simple JWT decode to check if token is valid format
    // Note: token might not be a standard JWT (e.g. opaque token) — in that case
    // treat it as valid and let the server validate it via getCurrentUser()
    const payload = JSON.parse(atob(token.split('.')[1]));

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
    // Simple JWT decode (you might want to use a proper JWT library)
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('🆔 USER ID: Token payload:', payload);

    const userId = payload.sub || payload.user_id || payload.id;
    console.log('🆔 USER ID: ✅ Extracted userId:', userId, typeof userId);
    return userId;
  } catch (error) {
    console.error('🆔 USER ID: ❌ Error decoding token:', error);
    return null;
  }
};

// Export token management functions
export { getToken, setToken, removeToken, getUserId, setUserId };
