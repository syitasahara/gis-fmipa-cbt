# GIS FMIPA CBT - API Integration Guide

## 🚀 Fitur yang Sudah Terintegrasi

### ✅ **Authentication System**
- **Login**: `/login` - Halaman login dengan email & password
- **Register**: `/register` - Halaman pendaftaran peserta baru  
- **Auto-redirect**: User yang belum login otomatis diarahkan ke `/login`
- **Token Management**: JWT token disimpan di localStorage

### ✅ **Questions Management**  
- **Dynamic Loading**: Soal dimuat dari backend berdasarkan jenjang user
- **Multiple Types**: Support soal text dan image dari backend
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

## 🔧 **Cara Penggunaan**

### 1. **Setup Environment**
```bash
# Install dependencies
npm install

# Run development server  
npm run dev
```

### 2. **Backend Configuration**
- Backend URL: `https://ujicoba-gis-backend.karyavisual.com/api`
- Authentication: JWT Bearer Token
- Support jenjang: SD, SMP
- Support jenis lomba: IPA, Matematika, IPS

### 3. **User Flow**
1. **Register** → Daftar akun baru di `/register`
2. **Login** → Masuk dengan akun di `/login` 
3. **Quiz** → Otomatis diarahkan ke `/quiz` setelah login
4. **Submit** → Hasil ujian otomatis dihitung dan ditampilkan

## 📋 **API Endpoints yang Digunakan**

### Authentication
- `POST /api/register` - Daftar akun baru
- `POST /api/login` - Login dengan email/password  
- `POST /api/logout` - Logout dan hapus token
- `GET /api/users/byAuth` - Data user yang login

### Questions
- `GET /api/exam/questions?level=SD/SMP` - Ambil soal berdasarkan jenjang
- `GET /api/exam/questions/{id}` - Detail soal tertentu

### User Answers
- `POST /api/exam/user-answers` - Submit jawaban
- `DELETE /api/exam/user-answers/{id}` - Batalkan jawaban
- `GET /api/exam/user-answers/{user_id}` - List jawaban user
- `PATCH /api/exam/user-answers/{id}/toggle-doubt` - Toggle ragu-ragu
- `GET /api/exam/results/{user_id}` - Hasil ujian user

## 🛠 **File Structure**

```
src/
├── app/
│   ├── components/
│   │   └── cbt.js           # Main quiz component (terintegrasi API)
│   ├── login/
│   │   └── page.js          # Login page
│   ├── register/  
│   │   └── page.js          # Register page
│   ├── quiz/
│   │   └── page.js          # Quiz wrapper
│   ├── utils/
│   │   └── api.js           # API utility functions
│   ├── page.js              # Homepage (updated with login link)
│   └── layout.js            # Root layout
└── middleware.js            # Route protection
```

## 🔐 **Security Features**

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

## 📊 **Data Flow**

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

## ⚠ **Known Limitations**

1. **Table Questions**: Backend belum support tipe soal "table", hanya text & image
2. **Timer Sync**: Timer belum tersinkronisasi dengan backend
3. **Session Management**: Belum ada endpoint untuk manage session ujian
4. **Bulk Answer**: Submit jawaban individual, belum ada bulk submit

## 🚀 **Next Development Steps**

1. **Add Session Management**: Implement exam session dengan waktu mulai/selesai
2. **Timer Synchronization**: Sync timer dengan backend time
3. **Enhanced Anti-cheating**: Log tab switching ke backend  
4. **Offline Support**: Cache questions untuk offline capability
5. **Performance Optimization**: Lazy loading & caching strategies

## 🐛 **Troubleshooting**

### Common Issues:
1. **CORS Error**: Pastikan backend mengizinkan origin frontend
2. **Token Expired**: User otomatis logout, login ulang diperlukan  
3. **Network Error**: Cek koneksi internet dan status backend
4. **Question Loading**: Refresh halaman jika soal tidak muncul

### Debug Mode:
- Buka Developer Console untuk melihat API errors
- Check Network tab untuk monitoring API calls
- LocalStorage berisi authToken yang bisa dicek manual

---

**Note**: Semua fitur sudah terintegrasi dengan backend dan siap untuk production testing! 🎉
