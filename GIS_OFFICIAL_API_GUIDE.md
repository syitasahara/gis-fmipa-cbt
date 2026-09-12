# 🌐 GIS Official API Integration Guide

## 📖 Overview

Project ini sekarang sudah terintegrasi dengan **GIS Official API** yang menyediakan endpoint untuk mengelola data CBT (Computer Based Test) termasuk pertanyaan, jawaban, peserta, dan file management.

## 🔗 Base URL

```
https://api.gisofficial.com/v1/
```

## 🔐 Authentication

Semua endpoint memerlukan **Bearer Token** yang tersimpan di localStorage. Sistem menggunakan authentication yang sama dengan existing project.

### Token Management

```javascript
import { getToken, setGISOfficialToken, removeGISOfficialToken } from '@/app/utils/gisOfficialAPI';

// Set token (setelah login)
setGISOfficialToken('your-token-here');

// Get token
const token = getToken();

// Remove token (logout)
removeGISOfficialToken();
```

## 📚 Available API Modules

### 1. **PertanyaanAPI** - Questions Management

```javascript
import { pertanyaanAPI } from '@/app/utils/gisOfficialAPI';

// Get all questions
const pertanyaan = await pertanyaanAPI.getAllPertanyaan();

// Get questions with answers
const withAnswers = await pertanyaanAPI.getPertanyaanWithAnswers();

// Get single question
const detail = await pertanyaanAPI.getPertanyaanById(123);

// Create question
const newQuestion = await pertanyaanAPI.createPertanyaan({
  text: "Apa ibukota Indonesia?",
  category: "geografi",
  points: 10
});

// Update question
await pertanyaanAPI.updatePertanyaan(123, {
  text: "Apa ibukota Indonesia yang baru?",
  points: 15
});

// Delete question
await pertanyaanAPI.deletePertanyaan(123);

// Upload gambar untuk soal
const file = document.querySelector('input[type="file"]').files[0];
const uploaded = await pertanyaanAPI.uploadGambarPertanyaan(file);
```

### 2. **JawabanAPI** - Answers Management

```javascript
import { jawabanAPI } from '@/app/utils/gisOfficialAPI';

// Get all answers
const jawaban = await jawabanAPI.getAllJawaban();

// Get answers by question ID
const answers = await jawabanAPI.getJawabanByPertanyaanId(123);

// Get single answer
const detail = await jawabanAPI.getJawabanById(456);

// Create answer
const newAnswer = await jawabanAPI.createJawaban({
  pertanyaan_id: 123,
  text: "Jakarta",
  is_correct: true
});

// Update answer
await jawabanAPI.updateJawaban(456, {
  text: "Jakarta (Ibu Kota)",
  is_correct: true
});

// Delete answer
await jawabanAPI.deleteJawaban(456);
```

### 3. **FilesAPI** - File Management

```javascript
import { filesAPI } from '@/app/utils/gisOfficialAPI';

// Download file
const blob = await filesAPI.downloadFile('path/to/file.jpg');

// Get file URL for display
const imageUrl = filesAPI.getFileUrl('path/to/image.jpg');
// Result: https://api.gisofficial.com/v1/files/path/to/image.jpg
```

### 4. **PesertaAPI** - Participants Management

```javascript
import { pesertaAPI } from '@/app/utils/gisOfficialAPI';

// Get all participants
const peserta = await pesertaAPI.getAllPeserta();

// Get single participant
const detail = await pesertaAPI.getPesertaById(789);

// Create participant
const newPeserta = await pesertaAPI.createPeserta({
  name: "John Doe",
  email: "john@example.com",
  jenjang: "SMA"
});

// Update participant
await pesertaAPI.updatePeserta(789, {
  name: "John Doe Updated"
});

// Delete participant
await pesertaAPI.deletePeserta(789);
```

## 🚀 Utility Functions

### Check API Connection

```javascript
import { checkGISApiConnection } from '@/app/utils/gisOfficialAPI';

const { connected, error } = await checkGISApiConnection();

if (connected) {
  console.log('✅ GIS Official API connected!');
} else {
  console.error('❌ Connection failed:', error);
}
```

### Get Complete Exam Data

```javascript
import { getCompleteExamData } from '@/app/utils/gisOfficialAPI';

const { success, data, error } = await getCompleteExamData();

if (success) {
  console.log('Questions with answers:', data);
}
```

### Batch Operations

```javascript
import { batchOperations } from '@/app/utils/gisOfficialAPI';

// Load all exam data at once
const { success, pertanyaan, jawaban, error } = await batchOperations.loadExamData();

// Create complete question with answers
const { success, pertanyaan, jawaban } = await batchOperations.createQuestionWithAnswers(
  {
    text: "Apa ibukota Indonesia?",
    category: "geografi",
    points: 10
  },
  [
    { text: "Jakarta", is_correct: true },
    { text: "Bandung", is_correct: false },
    { text: "Surabaya", is_correct: false },
    { text: "Medan", is_correct: false }
  ]
);
```

## 📝 Usage Examples

### Example 1: Load Questions for Quiz

```javascript
'use client';

import { useState, useEffect } from 'react';
import { pertanyaanAPI, jawabanAPI } from '@/app/utils/gisOfficialAPI';

export default function QuizLoader() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        const data = await pertanyaanAPI.getPertanyaanWithAnswers();
        setQuestions(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Quiz Questions</h2>
      {questions.map((q) => (
        <div key={q.id}>
          <p>{q.text}</p>
          {q.jawaban && q.jawaban.map((a) => (
            <div key={a.id}>{a.text}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Submit Answer

```javascript
import { useState } from 'react';
import { jawabanAPI } from '@/app/utils/gisOfficialAPI';

export default function AnswerSubmit({ questionId }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleSubmit = async () => {
    try {
      await jawabanAPI.createJawaban({
        pertanyaan_id: questionId,
        jawaban_id: selectedAnswer,
      });
      alert('Jawaban submitted!');
    } catch (error) {
      alert('Error submitting answer: ' + error.message);
    }
  };

  return (
    <div>
      <select onChange={(e) => setSelectedAnswer(e.target.value)}>
        <option value="">Pilih jawaban</option>
        <option value="1">Option A</option>
        <option value="2">Option B</option>
      </select>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

### Example 3: Upload Question Image

```javascript
import { useState } from 'react';
import { pertanyaanAPI } from '@/app/utils/gisOfficialAPI';

export default function ImageUpload({ questionId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const result = await pertanyaanAPI.uploadGambarPertanyaan(file);
      alert('Image uploaded: ' + result.file_path);
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
}
```

## 🛠 Error Handling

Semua API functions akan throw error jika terjadi masalah. Selalu wrap dalam try-catch:

```javascript
try {
  const result = await pertanyaanAPI.getAllPertanyaan();
  console.log('Success:', result);
} catch (error) {
  // Common errors:
  // - 'Authentication token required' → User perlu login
  // - 'Koneksi ke GIS Official API gagal' → Network issues
  // - 'Masalah akses GIS Official API' → CORS issues
  
  console.error('Error:', error.message);
  
  if (error.message.includes('token')) {
    // Redirect ke login
    router.push('/login');
  }
}
```

## 🔍 Debugging Tips

### 1. Cek Token Availability

```javascript
const token = localStorage.getItem('authToken') || localStorage.getItem('gisOfficialToken');
console.log('Token available:', !!token);
```

### 2. Test Connection

```javascript
import { checkGISApiConnection } from '@/app/utils/gisOfficialAPI';

const test = async () => {
  const result = await checkGISApiConnection();
  console.log(result);
};
```

### 3. Monitor Network Request

Buka Developer Console → Network tab untuk melihat:
- Request headers (Authorization token)
- Response status
- Response body

### 4. Check API Response Structure

```javascript
const data = await pertanyaanAPI.getAllPertanyaan();
console.log('Response structure:', JSON.stringify(data, null, 2));
```

## ⚠️ Important Notes

1. **Authentication Required**: Semua endpoint memerlukan valid Bearer token
2. **CORS Configuration**: Pastikan server mengizinkan requests dari domain Anda
3. **Token Management**: Token disimpan di localStorage dengan key `authToken` atau `gisOfficialToken`
4. **Error Messages**: Error messages sudah dilokalisasi ke Bahasa Indonesia
5. **File Uploads**: Gunakan `uploadGambarPertanyaan()` untuk upload gambar soal

## 📁 File Structure

```
src/app/utils/
├── api.js                    # Existing API (backend.karyavisual.com)
└── gisOfficialAPI.js        # New GIS Official API integration
```

## 🆚 Comparison: Existing vs GIS Official API

| Feature | Existing API | GIS Official API |
|---------|--------------|------------------|
| Base URL | backend.karyavisual.com | api.gisofficial.com |
| Questions | ✅ | ✅ |
| Answers | ✅ | ✅ |
| Participants | ✅ | ✅ |
| File Management | ❌ | ✅ |
| Image Upload | ❌ | ✅ |
| Authentication | JWT | JWT/Bearer |

## 🚀 Next Steps

1. **Test Connection**: Gunakan komponen test untuk verifikasi koneksi
2. **Migrate Data**: Pertimbangkan untuk migrate data dari existing ke GIS Official
3. **Update UI**: Integrate dengan komponen UI yang sudah ada
4. **Monitor Performance**: Compare performance antara dua API
5. **Production Setup**: Configure CORS dan environment variables

---

**📞 Support**: Jika ada masalah dengan API, hubungi administrator GIS Official atau cek Swagger documentation di `https://api.gisofficial.com/swagger`
