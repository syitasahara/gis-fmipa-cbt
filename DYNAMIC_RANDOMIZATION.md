# Sistem Randomisasi Soal Dinamis

Sistem ini telah diupgrade untuk mengambil soal secara dinamis dari API dan melakukan randomisasi berdasarkan user dan level.

## Fitur Utama

### 1. **Pengambilan Soal Dinamis**
- Soal diambil langsung dari API backend
- Tidak menggunakan data statis
- Mendukung caching untuk performa yang lebih baik

### 2. **Randomisasi Konsisten per User**
- Setiap user mendapat urutan soal yang berbeda
- User yang sama akan selalu mendapat urutan yang sama (konsisten)
- Randomisasi berdasarkan user ID + level + tanggal

### 3. **Randomisasi Jawaban**
- Urutan jawaban dalam setiap soal juga diacak
- Konsisten untuk user yang sama
- Tetap mempertahankan jawaban yang benar

## Struktur File

### `/src/app/utils/questionRandomizer.js`
Utilitas untuk randomisasi dengan fitur:
- `randomizeQuestionsAndAnswers()` - Fungsi utama untuk randomisasi
- `generateUserSeed()` - Generate seed unik per user
- `shuffleArray()` - Algoritma Fisher-Yates dengan seed
- `transformApiQuestions()` - Transform data API ke format internal

### `/src/app/utils/api.js`
API functions yang telah diupdate:
- `questionsAPI.getAllQuestions()` - Ambil semua soal untuk level tertentu
- `questionsAPI.getRandomizedQuestions()` - Langsung ambil soal yang sudah diacak

### `/src/app/api/exam/questions/route.js`
Endpoint API baru yang mendukung:
- Parameter `all=true` untuk ambil semua soal
- Parameter `randomized=true` untuk server-side randomization
- Caching untuk performa
- Filter berdasarkan level

### `/src/app/utils/testQuestions.js`
Utilitas untuk testing dan debugging:
- Test randomization untuk multiple users
- Debug struktur soal
- Compare API endpoints
- Test performance

## Cara Menggunakan

### 1. **Di Komponen CBT**
```javascript
import { 
  randomizeQuestionsAndAnswers, 
  transformApiQuestions 
} from '../utils/questionRandomizer';

// Dalam useEffect loadQuestions
const questionsData = await questionsAPI.getAllQuestions(user.jenjang);
const transformedQuestions = transformApiQuestions(questionsData);
const randomizedQuestions = randomizeQuestionsAndAnswers(
  transformedQuestions, 
  userId, 
  user.jenjang
);
```

### 2. **Testing di Browser Console**
```javascript
// Test randomization
await window.questionTests.testRandomization('SD');

// Debug questions
await window.questionTests.debugQuestions('SD', 3);

// Run all tests
await window.questionTests.runAllTests('SD');
```

### 3. **API Calls**
```javascript
// Ambil semua soal SD
const allQuestions = await questionsAPI.getAllQuestions('SD');

// Ambil soal SD yang sudah diacak untuk user tertentu
const randomizedQuestions = await questionsAPI.getRandomizedQuestions('SD', 'user123');
```

## Parameter API

### GET `/api/exam/questions`

| Parameter | Type | Description |
|-----------|------|-------------|
| `level` | string | Level pendidikan (SD, SMP, SMA) |
| `all` | boolean | `true` untuk ambil semua soal |
| `randomized` | boolean | `true` untuk server-side randomization |
| `user_id` | string | ID user untuk consistent randomization |
| `limit` | number | Batasi jumlah soal |

**Contoh:**
```
GET /api/exam/questions?level=SD&all=true&randomized=true&user_id=user123&limit=50
```

## Keunggulan Sistem Baru

### ✅ **Dinamis**
- Soal diambil real-time dari database
- Mudah untuk menambah/edit soal tanpa deploy ulang
- Mendukung multiple level pendidikan

### ✅ **Konsisten**
- User yang sama selalu mendapat urutan soal yang sama
- Penting untuk fairness dalam ujian
- Menggunakan seeded random dengan user ID

### ✅ **Performant**
- Caching di server untuk mengurangi load database
- Transform data hanya sekali di client
- Lazy loading untuk soal yang belum ditampilkan

### ✅ **Scalable**
- Mudah ditambah level pendidikan baru
- Mendukung berbagai jenis soal (text, image)
- API terpisah memungkinkan microservice architecture

### ✅ **Debuggable**
- Extensive logging untuk troubleshooting
- Testing utilities untuk verify randomization
- Performance monitoring built-in

## Troubleshooting

### Problem: Semua user mendapat urutan soal yang sama
**Solution:** Pastikan `userId` unik dan valid diteruskan ke fungsi randomization

### Problem: User mendapat urutan soal berbeda setiap reload
**Solution:** Check konsistensi `userId` dan pastikan menggunakan seed yang sama

### Problem: Soal tidak ter-load
**Solution:** 
1. Check koneksi ke backend API
2. Verify parameter `level` sesuai dengan data di database
3. Check cache status di server

### Problem: Performance lambat
**Solution:**
1. Enable caching di server
2. Gunakan `limit` parameter untuk membatasi jumlah soal
3. Check network latency ke backend

## Development Tips

1. **Gunakan testing utilities** untuk verify randomization bekerja dengan benar
2. **Monitor console logs** untuk debug issues
3. **Test dengan multiple users** untuk pastikan randomization berbeda
4. **Check browser network tab** untuk monitor API calls
5. **Gunakan React DevTools** untuk monitor state changes

## Future Improvements

- [ ] Redis caching untuk production
- [ ] WebSocket untuk real-time soal updates
- [ ] Analytics untuk track user behavior
- [ ] A/B testing untuk compare randomization algorithms
- [ ] Offline support dengan service workers
