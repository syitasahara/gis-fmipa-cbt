<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ExamSubmissionController extends Controller
{
    /**
     * Submit final exam
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function submitExam(Request $request): JsonResponse
    {
        try {
            // Validate request data
            $validator = Validator::make($request->all(), [
                'userId' => 'required|integer|exists:users,id',
                'durationInMinutes' => 'nullable|integer|min:0',
                'totalViolations' => 'nullable|integer|min:0',
                'isAutoSubmit' => 'nullable|boolean',
                'submissionType' => 'nullable|string|in:manual,auto,timeout',
                'browserInfo' => 'nullable|array',
                'examMetadata' => 'nullable|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = $request->input('userId');
            $submittedAt = Carbon::now();

            // Start database transaction
            DB::beginTransaction();

            try {
                // Check if exam already submitted
                $existingSubmission = DB::table('exam_submissions')
                    ->where('user_id', $userId)
                    ->first();

                if ($existingSubmission) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Exam already submitted',
                        'submissionId' => $existingSubmission->id,
                        'submittedAt' => $existingSubmission->submitted_at
                    ], 409);
                }

                // Get user's answers for scoring
                $userAnswers = DB::table('user_answers')
                    ->join('answers', 'user_answers.answer_id', '=', 'answers.id')
                    ->join('questions', 'user_answers.question_id', '=', 'questions.id')
                    ->where('user_answers.user_id', $userId)
                    ->select([
                        'user_answers.*',
                        'answers.is_correct',
                        'questions.level',
                        'questions.point_value'
                    ])
                    ->get();

                // Calculate results
                $totalQuestions = DB::table('questions')->count();
                $answeredQuestions = $userAnswers->count();
                $correctAnswers = $userAnswers->where('is_correct', true)->count();
                $wrongAnswers = $userAnswers->where('is_correct', false)->count();
                $unanswered = $totalQuestions - $answeredQuestions;
                
                // Calculate score based on point values
                $totalScore = $userAnswers->where('is_correct', true)
                    ->sum('point_value');
                
                $maxPossibleScore = DB::table('questions')->sum('point_value');
                $scorePercentage = $maxPossibleScore > 0 ? 
                    round(($totalScore / $maxPossibleScore) * 100, 2) : 0;

                // Create exam submission record
                $submissionId = DB::table('exam_submissions')->insertGetId([
                    'user_id' => $userId,
                    'submitted_at' => $submittedAt,
                    'duration_minutes' => $request->input('durationInMinutes', 0),
                    'total_violations' => $request->input('totalViolations', 0),
                    'is_auto_submit' => $request->input('isAutoSubmit', false),
                    'submission_type' => $request->input('submissionType', 'manual'),
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'browser_info' => json_encode($request->input('browserInfo', [])),
                    'exam_metadata' => json_encode($request->input('examMetadata', [])),
                    'total_questions' => $totalQuestions,
                    'answered_questions' => $answeredQuestions,
                    'correct_answers' => $correctAnswers,
                    'wrong_answers' => $wrongAnswers,
                    'unanswered_questions' => $unanswered,
                    'total_score' => $totalScore,
                    'score_percentage' => $scorePercentage,
                    'max_possible_score' => $maxPossibleScore,
                    'created_at' => $submittedAt,
                    'updated_at' => $submittedAt
                ]);

                // Mark all user answers as final
                DB::table('user_answers')
                    ->where('user_id', $userId)
                    ->update([
                        'is_final' => true,
                        'finalized_at' => $submittedAt,
                        'updated_at' => $submittedAt
                    ]);

                // Create exam results summary
                $resultId = DB::table('exam_results')->insertGetId([
                    'user_id' => $userId,
                    'submission_id' => $submissionId,
                    'total_questions' => $totalQuestions,
                    'correct_answers' => $correctAnswers,
                    'wrong_answers' => $wrongAnswers,
                    'unanswered_questions' => $unanswered,
                    'score' => $totalScore,
                    'score_percentage' => $scorePercentage,
                    'grade' => $this->calculateGrade($scorePercentage),
                    'passed' => $scorePercentage >= 70, // Assuming 70% is passing grade
                    'exam_date' => $submittedAt->toDateString(),
                    'created_at' => $submittedAt,
                    'updated_at' => $submittedAt
                ]);

                // Commit transaction
                DB::commit();

                // Return success response
                return response()->json([
                    'success' => true,
                    'message' => 'Exam submitted successfully',
                    'submissionId' => $submissionId,
                    'resultId' => $resultId,
                    'submittedAt' => $submittedAt->toISOString(),
                    'results' => [
                        'totalQuestions' => $totalQuestions,
                        'answeredQuestions' => $answeredQuestions,
                        'correctAnswers' => $correctAnswers,
                        'wrongAnswers' => $wrongAnswers,
                        'unansweredQuestions' => $unanswered,
                        'totalScore' => $totalScore,
                        'scorePercentage' => $scorePercentage,
                        'maxPossibleScore' => $maxPossibleScore,
                        'grade' => $this->calculateGrade($scorePercentage),
                        'passed' => $scorePercentage >= 70
                    ],
                    'examInfo' => [
                        'durationMinutes' => $request->input('durationInMinutes', 0),
                        'violations' => $request->input('totalViolations', 0),
                        'submissionType' => $request->input('submissionType', 'manual'),
                        'isAutoSubmit' => $request->input('isAutoSubmit', false)
                    ]
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            \Log::error('Exam submission error:', [
                'user_id' => $request->input('userId'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to submit exam',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Calculate grade based on score percentage
     * 
     * @param float $scorePercentage
     * @return string
     */
    private function calculateGrade(float $scorePercentage): string
    {
        if ($scorePercentage >= 90) return 'A';
        if ($scorePercentage >= 80) return 'B';
        if ($scorePercentage >= 70) return 'C';
        if ($scorePercentage >= 60) return 'D';
        return 'F';
    }

    /**
     * Get exam submission details
     * 
     * @param Request $request
     * @param int $submissionId
     * @return JsonResponse
     */
    public function getSubmission(Request $request, int $submissionId): JsonResponse
    {
        try {
            $submission = DB::table('exam_submissions')
                ->join('users', 'exam_submissions.user_id', '=', 'users.id')
                ->where('exam_submissions.id', $submissionId)
                ->select([
                    'exam_submissions.*',
                    'users.name as user_name',
                    'users.email as user_email'
                ])
                ->first();

            if (!$submission) {
                return response()->json([
                    'success' => false,
                    'message' => 'Submission not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'submission' => $submission
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get submission details',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
