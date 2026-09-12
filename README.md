# 🎓 GIS FMIPA CBT - Computer Based Test System

Sistem Ujian Online Berbasis Komputer untuk Program Studi GIS FMIPA dengan integrasi **GIS Official API**.

## 🌟 Fitur Utama

### ✅ **Dual API Integration**
- **GIS Official API**: `https://api.gisofficial.com/v1/` (NEW!)
- **Existing API**: `https://ujicoba-gis-backend.karyavisual.com/api`

### ✅ **Authentication System**
- **Login**: `/login` - Halaman login dengan email & password
- **Register**: `/register` - Halaman pendaftaran peserta baru
- **Auto-redirect**: User yang belum login otomatis diarahkan ke `/login`
- **Token Management**: JWT token disimpan di localStorage

### ✅ **Questions Management**
- **Dynamic Loading**: Soal dimuat dari backend berdasarkan jenjang user
- **Multiple Types**: Support soal text dan image dari backend
- **Image Upload**: Upload gambar soal via GIS Official API
- **Real-time Sync**: Jawaban tersimpan langsung ke backend

### ✅ **Answer Management**
- **Real-time Submit**: Setiap jawaban langsung dikirim ke backend
- **Doubt System**: Fitur ragu-ragu terintegrasi dengan backend
- **Cancel Answer**: Dapat membatalkan jawaban yang sudah dipilih
- **State Sync**: Status jawaban tersinkronisasi dengan backend

### ✅ **Results Calculation**
- **Backend Scoring**: Hasil ujian dihitung di backend
- **Detailed Results**: Menampilkan benar/salah/kosong/ragu
- **Score Display**: Menampilkan skor final dari backend

## 🚀 Quick Start

### 1. **Install & Run**
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

### 2. **Test GIS Official API**
```bash
# Buka halaman test API
# http://localhost:3000/test-gis-api

# Atau gunakan komponen test di kode Anda
import GISOfficialAPITest from '@/app/components/GISOfficialAPITest';
```

### 3. **User Flow**
1. **Register** → Daftar akun baru di `/register`
2. **Login** → Masuk dengan akun di `/login`
3. **Quiz** → Otomatis diarahkan ke `/quiz` setelah login
4. **Submit** → Hasil ujian otomatis dihitung dan ditampilkan

## 📚 API Modules

### 🌐 GIS Official API (NEW!)
```javascript
import {
  pertanyaanAPI,    // Questions management
  jawabanAPI,      // Answers management
  filesAPI,        // File management
  pesertaAPI,      // Participants management
  checkGISApiConnection,
  getCompleteExamData,
  batchOperations
} from '@/app/utils/gisOfficialAPI';

// Example usage
const questions = await pertanyaanAPI.getAllPertanyaan();
const withAnswers = await pertanyaanAPI.getPertanyaanWithAnswers();
const fileUrl = filesAPI.getFileUrl('path/to/image.jpg');
```

### 📡 Existing API
```javascript
import {
  authAPI,
  questionsAPI,
  answersAPI
} from '@/app/utils/api';

// Example usage
await authAPI.login(email, password);
const questions = await questionsAPI.getQuestions('SD');
await answersAPI.submitAnswer(userId, questionId, answerId);
```

## 📋 API Endpoints

### 🌐 GIS Official API Endpoints

#### Authentication
- **Bearer Token** - Required for all endpoints
- Token disimpan di `localStorage` sebagai `authToken` atau `gisOfficialToken`

#### Pertanyaan (Questions)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/v1/master/pertanyaan` | List pertanyaan (paginated) |
| GET | `/v1/master/pertanyaan/all` | Ambil semua pertanyaan |
| GET | `/v1/master/pertanyaan/with-answers` | Pertanyaan + jawaban |
| GET | `/v1/master/pertanyaan/{id}` | Detail pertanyaan |
| POST | `/v1/master/pertanyaan` | Tambah pertanyaan baru |
| PUT | `/v1/master/pertanyaan` | Update pertanyaan |
| DELETE | `/v1/master/pertanyaan/{id}` | Hapus pertanyaan |
| POST | `/v1/master/pertanyaan/upload-gambar` | Upload gambar soal |

#### Jawaban (Answers)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/v1/master/jawaban` | List jawaban (paginated) |
| GET | `/v1/master/jawaban/all` | Ambil semua jawaban |
| GET | `/v1/master/jawaban/pertanyaan/{pertanyaanId}` | Jawaban per pertanyaan |
| GET | `/v1/master/jawaban/{id}` | Detail jawaban |
| POST | `/v1/master/jawaban` | Tambah jawaban baru |
| PUT | `/v1/master/jawaban` | Update jawaban |
| DELETE | `/v1/master/jawaban/{id}` | Hapus jawaban |

#### Files
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/v1/files/{path}` | Download file |

#### Peserta (Participants)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/v1/master/peserta` | List peserta (paginated) |
| GET | `/v1/master/peserta/all` | Ambil semua peserta |
| GET | `/v1/master/peserta/{id}` | Detail peserta |
| POST | `/v1/master/peserta` | Tambah peserta baru |
| PUT | `/v1/master/peserta` | Update peserta |
| DELETE | `/v1/master/peserta/{id}` | Hapus peserta |

### 📡 Existing API Endpoints

#### Authentication
- `POST /api/register` - Daftar akun baru
- `POST /api/login` - Login dengan email/password
- `POST /api/logout` - Logout dan hapus token
- `GET /api/users/byAuth` - Data user yang login

#### Questions & Answers
- `GET /api/exam/questions?level=SD/SMP` - Ambil soal berdasarkan jenjang
- `GET /api/exam/questions/{id}` - Detail soal tertentu
- `POST /api/exam/user-answers` - Submit jawaban
- `DELETE /api/exam/user-answers/{id}` - Batalkan jawaban
- `GET /api/exam/results/{user_id}` - Hasil ujian user

## 🛠 File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── cbt.js                    # Main quiz component
│   │   ├── GISOfficialAPITest.js     # GIS Official API test suite
│   │   └── ...
│   ├── login/
│   │   └── page.js                   # Login page
│   ├── register/
│   │   └── page.js                   # Register page
│   ├── quiz/
│   │   └── page.js                   # Quiz wrapper
│   ├── test-gis-api/
│   │   └── page.js                   # GIS Official API test page
│   ├── utils/
│   │   ├── api.js                    # Existing API utilities
│   │   └── gisOfficialAPI.js         # GIS Official API utilities (NEW!)
│   ├── page.js                       # Homepage
│   └── layout.js                     # Root layout
└── middleware.js                     # Route protection
```

## 🔐 Security Features

### Frontend Security
- **JWT Token Management**: Secure token storage & validation
- **Auto Logout**: Token expired otomatis logout
- **Protected Routes**: Quiz hanya bisa diakses setelah login
- **Anti-cheating**: Tab switching detection dengan backend logging

### Backend Integration
- **Bearer Authentication**: Semua API calls menggunakan JWT
- **User Session**: Tracking user session per ujian
- **Answer Validation**: Validasi jawaban di backend
- **Results Security**: Skor dihitung di backend, tidak bisa dimanipulasi

## 📊 Data Flow

### 1. **Login Process**
```
User Input → Frontend Validation → API Call → JWT Token → localStorage → Redirect to Quiz
```

### 2. **Question Loading**
```
User Auth → Get User Data → Fetch Questions by Jenjang → Transform Data → Display Questions
```

### 3. **Answer Submission**
```
User Select → Validate Selection → API Submit → Update Local State → Real-time Sync
```

### 4. **Final Submission**
```
Submit Button → Collect All Answers → Calculate Results (Backend) → Display Results → Back to Home
```

## ⚠️ Known Limitations

1. **Table Questions**: Backend belum support tipe soal "table", hanya text & image
2. **Timer Sync**: Timer belum tersinkronisasi dengan backend
3. **Session Management**: Belum ada endpoint untuk manage session ujian
4. **Bulk Answer**: Submit jawaban individual, belum ada bulk submit

## 🚀 Next Development Steps

1. ✅ **GIS Official API Integration** - COMPLETED!
2. **Add Session Management**: Implement exam session dengan waktu mulai/selesai
3. **Timer Synchronization**: Sync timer dengan backend time
4. **Enhanced Anti-cheating**: Log tab switching ke backend
5. **Offline Support**: Cache questions untuk offline capability
6. **Performance Optimization**: Lazy loading & caching strategies

## 🐛 Troubleshooting

### Common Issues:
1. **CORS Error**: Pastikan backend mengizinkan origin frontend
2. **Token Expired**: User otomatis logout, login ulang diperlukan
3. **Network Error**: Cek koneksi internet dan status backend
4. **Question Loading**: Refresh halaman jika soal tidak muncul
5. **GIS API Connection**: Test koneksi di `/test-gis-api`

### Debug Mode:
- Buka Developer Console untuk melihat API errors
- Check Network tab untuk monitoring API calls
- LocalStorage berisi `authToken` yang bisa dicek manual
- Test GIS Official API di `/test-gis-api`

## 📖 Documentation

- **[GIS Official API Guide](./GIS_OFFICIAL_API_GUIDE.md)** - Complete GIS Official API documentation
- **[API Integration Guide](./API_INTEGRATION.md)** - Existing API documentation
- **Swagger UI**: https://api.gisofficial.com/swagger/index.html

## 🔗 Useful Links

- **Development**: `http://localhost:3000`
- **API Test**: `http://localhost:3000/test-gis-api`
- **Swagger Docs**: `https://api.gisofficial.com/swagger`
- **GIS Official API**: `https://api.gisofficial.com/v1/`

---

**🎉 Status**: GIS Official API Integration Completed! System ready for dual API operation.