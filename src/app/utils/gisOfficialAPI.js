// GIS Official API utility functions
// Base URL: https://api.gisofficial.com/v1/

const GIS_API_BASE_URL = 'https://api.gisofficial.com/v1';

// Get token from localStorage (reuse existing auth system)
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken') || localStorage.getItem('gisOfficialToken');
  }
  return null;
};

// Set GIS Official token to localStorage
const setGISOfficialToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gisOfficialToken', token);
  }
};

// Remove GIS Official token from localStorage
const removeGISOfficialToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gisOfficialToken');
  }
};

// Generic API call function for GIS Official API
const gisApiCall = async (endpoint, options = {}) => {
  const token = getToken();

  if (!token) {
    throw new Error('Authentication token required. Please login first.');
  }

  const config = {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${GIS_API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `GIS API error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Enhanced error handling
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Koneksi ke GIS Official API gagal. Periksa koneksi internet Anda.');
    }
    if (error.message.includes('CORS')) {
      throw new Error('Masalah akses GIS Official API. Periksa konfigurasi CORS atau hubungi administrator.');
    }
    throw error;
  }
};

// ============== PERTANYAAN (QUESTIONS) API ==============
export const pertanyaanAPI = {
  // Get list pertanyaan (paginated)
  getPertanyaan: async (page = 1, perPage = 10) => {
    const queryParam = `?page=${page}&per_page=${perPage}`;
    return await gisApiCall(`/master/pertanyaan${queryParam}`);
  },

  // Get all pertanyaan
  getAllPertanyaan: async () => {
    return await gisApiCall('/master/pertanyaan/all');
  },

  // Get pertanyaan with answers
  getPertanyaanWithAnswers: async () => {
    return await gisApiCall('/master/pertanyaan/with-answers');
  },

  // Get single pertanyaan by ID
  getPertanyaanById: async (id) => {
    return await gisApiCall(`/master/pertanyaan/${id}`);
  },

  // Create new pertanyaan
  createPertanyaan: async (pertanyaanData) => {
    return await gisApiCall('/master/pertanyaan', {
      method: 'POST',
      body: JSON.stringify(pertanyaanData),
    });
  },

  // Update pertanyaan
  updatePertanyaan: async (id, pertanyaanData) => {
    return await gisApiCall('/master/pertanyaan', {
      method: 'PUT',
      body: JSON.stringify({
        id,
        ...pertanyaanData
      }),
    });
  },

  // Delete pertanyaan
  deletePertanyaan: async (id) => {
    return await gisApiCall(`/master/pertanyaan/${id}`, {
      method: 'DELETE',
    });
  },

  // Upload gambar untuk pertanyaan
  uploadGambarPertanyaan: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getToken();
    const response = await fetch(`${GIS_API_BASE_URL}/master/pertanyaan/upload-gambar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `GIS API error! status: ${response.status}`);
    }

    return response.json();
  },
};

// ============== JAWABAN (ANSWERS) API ==============
export const jawabanAPI = {
  // Get list jawaban (paginated)
  getJawaban: async (page = 1, perPage = 10) => {
    const queryParam = `?page=${page}&per_page=${perPage}`;
    return await gisApiCall(`/master/jawaban${queryParam}`);
  },

  // Get all jawaban
  getAllJawaban: async () => {
    return await gisApiCall('/master/jawaban/all');
  },

  // Get jawaban by pertanyaan ID
  getJawabanByPertanyaanId: async (pertanyaanId) => {
    return await gisApiCall(`/master/jawaban/pertanyaan/${pertanyaanId}`);
  },

  // Get single jawaban by ID
  getJawabanById: async (id) => {
    return await gisApiCall(`/master/jawaban/${id}`);
  },

  // Create new jawaban
  createJawaban: async (jawabanData) => {
    return await gisApiCall('/master/jawaban', {
      method: 'POST',
      body: JSON.stringify(jawabanData),
    });
  },

  // Update jawaban
  updateJawaban: async (id, jawabanData) => {
    return await gisApiCall('/master/jawaban', {
      method: 'PUT',
      body: JSON.stringify({
        id,
        ...jawabanData
      }),
    });
  },

  // Delete jawaban
  deleteJawaban: async (id) => {
    return await gisApiCall(`/master/jawaban/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============== FILES API ==============
export const filesAPI = {
  // Download file by path
  downloadFile: async (path) => {
    const token = getToken();
    const response = await fetch(`${GIS_API_BASE_URL}/files/${encodeURIComponent(path)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status}`);
    }

    return response.blob();
  },

  // Get file URL for direct access
  getFileUrl: (path) => {
    return `${GIS_API_BASE_URL}/files/${encodeURIComponent(path)}`;
  },
};

// ============== PESERTA (PARTICIPANTS) API ==============
// Note: Endpoints are partially visible in screenshot, adding common patterns
export const pesertaAPI = {
  // Get list peserta (paginated) - common pattern
  getPeserta: async (page = 1, perPage = 10) => {
    const queryParam = `?page=${page}&per_page=${perPage}`;
    return await gisApiCall(`/master/peserta${queryParam}`);
  },

  // Get all peserta
  getAllPeserta: async () => {
    return await gisApiCall('/master/peserta/all');
  },

  // Get peserta by ID
  getPesertaById: async (id) => {
    return await gisApiCall(`/master/peserta/${id}`);
  },

  // Create new peserta
  createPeserta: async (pesertaData) => {
    return await gisApiCall('/master/peserta', {
      method: 'POST',
      body: JSON.stringify(pesertaData),
    });
  },

  // Update peserta
  updatePeserta: async (id, pesertaData) => {
    return await gisApiCall(`/master/peserta`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        ...pesertaData
      }),
    });
  },

  // Delete peserta
  deletePeserta: async (id) => {
    return await gisApiCall(`/master/peserta/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============== UTILITY FUNCTIONS ==============

// Check if GIS Official API is accessible
export const checkGISApiConnection = async () => {
  try {
    const token = getToken();
    if (!token) {
      return { connected: false, error: 'No authentication token' };
    }

    // Try to fetch a simple endpoint to check connection
    await gisApiCall('/master/pertanyaan/all');
    return { connected: true };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};

// Get complete exam data (questions with answers)
export const getCompleteExamData = async () => {
  try {
    const [pertanyaanWithAnswers] = await Promise.all([
      pertanyaanAPI.getPertanyaanWithAnswers(),
    ]);

    return {
      success: true,
      data: pertanyaanWithAnswers,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Batch operations for efficient data loading
export const batchOperations = {
  // Load all necessary data for exam
  loadExamData: async () => {
    try {
      const [pertanyaan, jawaban] = await Promise.all([
        pertanyaanAPI.getAllPertanyaan(),
        jawabanAPI.getAllJawaban(),
      ]);

      return {
        success: true,
        pertanyaan: pertanyaan.data || pertanyaan,
        jawaban: jawaban.data || jawaban,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Create complete question with answers
  createQuestionWithAnswers: async (pertanyaanData, jawabanList) => {
    try {
      // Create pertanyaan first
      const pertanyaan = await pertanyaanAPI.createPertanyaan(pertanyaanData);

      // Create all jawaban for this pertanyaan
      const jawabanPromises = jawabanList.map(jawabanData =>
        jawabanAPI.createJawaban({
          pertanyaan_id: pertanyaan.data?.id || pertanyaan.id,
          ...jawabanData
        })
      );

      const jawabanResults = await Promise.all(jawabanPromises);

      return {
        success: true,
        pertanyaan,
        jawaban: jawabanResults,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

// Export token management functions
export { getToken, setGISOfficialToken, removeGISOfficialToken };

// Export API base URL for reference
export { GIS_API_BASE_URL };
