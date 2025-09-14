<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ExamSubmissionController;

/*
|--------------------------------------------------------------------------
| API Routes for Exam System
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])->group(function () {
    
    // Exam submission routes
    Route::prefix('exam')->group(function () {
        
        // Submit final exam
        Route::post('/submit', [ExamSubmissionController::class, 'submitExam']);
        
        // Get submission details
        Route::get('/submissions/{submissionId}', [ExamSubmissionController::class, 'getSubmission']);
        
        // Get user's submission history
        Route::get('/submissions/user/{userId}', [ExamSubmissionController::class, 'getUserSubmissions']);
        
    });
    
});

// Public routes (if needed)
Route::prefix('exam')->group(function () {
    
    // Health check for exam submission endpoint
    Route::get('/submit/health', function () {
        return response()->json([
            'status' => 'OK',
            'message' => 'Exam submission endpoint is healthy',
            'timestamp' => now()->toISOString()
        ]);
    });
    
});
