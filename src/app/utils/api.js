// API utility functions for backend integration
// Use relative URL to leverage Next.js proxy and avoid CORS
const API_BASE_URL = '/api';
// Fallback direct URL for development testing - MUST match the proxy URL
const API_DIRECT_URL = 'https://gis-backend.karyavisual.com/api';

// Get token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Set token to localStorage
const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Remove token from localStorage
const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// Generic API call function with fallback
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Try proxy first (for production)
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.warn('Proxy API call failed, trying direct URL...', error.message);
    
    // Fallback to direct URL (for development)
    try {
      const directConfig = {
        ...config,
        mode: 'cors',
        credentials: 'omit', // Remove credentials for direct CORS request
      };
      
      const response = await fetch(`${API_DIRECT_URL}${endpoint}`, directConfig);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (directError) {
      // Enhanced error handling for network/CORS issues
      if (directError.name === 'TypeError' && directError.message.includes('Failed to fetch')) {
        throw new Error('Koneksi ke server gagal. Periksa koneksi internet Anda.');
      }
      if (directError.message.includes('CORS')) {
        throw new Error('Masalah akses server. Silakan coba lagi atau hubungi administrator.');
      }
      throw directError;
    }
  }
};

// Auth API functions
export const authAPI = {
  login: async (email, password) => {
    const response = await apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
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
    return await apiCall('/users/byAuth');
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
  return !!getToken();
};

// Helper function to get current user ID from token (you might need to decode JWT)
export const getCurrentUserId = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    // Simple JWT decode (you might want to use a proper JWT library)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub || payload.user_id || payload.id;
    console.log('Extracted userId from token:', userId, typeof userId);
    return userId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export { getToken, setToken, removeToken };
