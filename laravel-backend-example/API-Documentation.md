# Exam Submission API Documentation

## Overview
Endpoint untuk submit ujian final dengan hasil dan metadata lengkap.

## Endpoint Details

### Submit Exam
**POST** `/api/exam/submit`

#### Headers
```
Content-Type: application/json
Authorization: Bearer {token}
Accept: application/json
```

#### Request Body
```json
{
  "userId": 123,
  "durationInMinutes": 45,
  "totalViolations": 2,
  "isAutoSubmit": false,
  "submissionType": "manual",
  "browserInfo": {
    "userAgent": "Mozilla/5.0...",
    "language": "id-ID",
    "platform": "MacIntel",
    "cookieEnabled": true
  },
  "examMetadata": {
    "totalQuestions": 50,
    "answeredQuestions": 48,
    "timeSpent": 2700,
    "violations": 2
  }
}
```

#### Success Response (201)
```json
{
  "success": true,
  "message": "Exam submitted successfully",
  "submissionId": 456,
  "resultId": 789,
  "submittedAt": "2025-09-14T10:30:00.000Z",
  "results": {
    "totalQuestions": 50,
    "answeredQuestions": 48,
    "correctAnswers": 42,
    "wrongAnswers": 6,
    "unansweredQuestions": 2,
    "totalScore": 84.0,
    "scorePercentage": 84.0,
    "maxPossibleScore": 100.0,
    "grade": "B",
    "passed": true
  },
  "examInfo": {
    "durationMinutes": 45,
    "violations": 2,
    "submissionType": "manual",
    "isAutoSubmit": false
  }
}
```

#### Error Responses

**400 Bad Request** - Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "userId": ["User ID is required for exam submission."]
  }
}
```

**409 Conflict** - Already Submitted
```json
{
  "success": false,
  "message": "Exam already submitted",
  "submissionId": 456,
  "submittedAt": "2025-09-14T10:30:00.000Z"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Failed to submit exam",
  "error": "Database connection error"
}
```

## Database Schema

### exam_submissions table
```sql
CREATE TABLE exam_submissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    submitted_at TIMESTAMP NOT NULL,
    duration_minutes INT DEFAULT 0,
    total_violations INT DEFAULT 0,
    is_auto_submit BOOLEAN DEFAULT FALSE,
    submission_type ENUM('manual', 'auto', 'timeout') DEFAULT 'manual',
    ip_address VARCHAR(255),
    user_agent TEXT,
    browser_info JSON,
    exam_metadata JSON,
    total_questions INT NOT NULL,
    answered_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    wrong_answers INT NOT NULL,
    unanswered_questions INT NOT NULL,
    total_score DECIMAL(8,2) DEFAULT 0,
    score_percentage DECIMAL(5,2) DEFAULT 0,
    max_possible_score DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_submitted (user_id, submitted_at),
    INDEX idx_submission_type (submission_type),
    INDEX idx_score_percentage (score_percentage)
);
```

### exam_results table
```sql
CREATE TABLE exam_results (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    submission_id BIGINT UNSIGNED NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    wrong_answers INT NOT NULL,
    unanswered_questions INT NOT NULL,
    score DECIMAL(8,2) NOT NULL,
    score_percentage DECIMAL(5,2) NOT NULL,
    grade VARCHAR(2) NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    exam_date DATE NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (submission_id) REFERENCES exam_submissions(id) ON DELETE CASCADE,
    INDEX idx_user_exam_date (user_id, exam_date),
    INDEX idx_grade (grade),
    INDEX idx_passed (passed)
);
```

## Implementation Notes

1. **Transaction Safety**: Semua operasi database dibungkus dalam transaction untuk memastikan data consistency.

2. **Duplicate Prevention**: Sistem akan cek apakah user sudah submit sebelumnya untuk mencegah double submission.

3. **Comprehensive Logging**: Error dan aktivitas penting di-log untuk debugging dan audit.

4. **Flexible Scoring**: Mendukung sistem poin yang berbeda untuk setiap soal.

5. **Metadata Tracking**: Menyimpan informasi browser, IP, dan metadata ujian untuk analisis.

6. **Automatic Grading**: Otomatis menghitung grade dan status lulus berdasarkan score percentage.

## Security Considerations

- Gunakan middleware `auth:sanctum` untuk authentication
- Validasi semua input untuk mencegah injection attacks
- Rate limiting untuk mencegah spam submissions
- Log semua submission attempts untuk audit trail
