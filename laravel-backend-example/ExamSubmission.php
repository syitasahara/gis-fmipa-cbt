<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ExamSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'submitted_at',
        'duration_minutes',
        'total_violations',
        'is_auto_submit',
        'submission_type',
        'ip_address',
        'user_agent',
        'browser_info',
        'exam_metadata',
        'total_questions',
        'answered_questions',
        'correct_answers',
        'wrong_answers',
        'unanswered_questions',
        'total_score',
        'score_percentage',
        'max_possible_score'
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'is_auto_submit' => 'boolean',
        'browser_info' => 'array',
        'exam_metadata' => 'array',
        'total_score' => 'decimal:2',
        'score_percentage' => 'decimal:2',
        'max_possible_score' => 'decimal:2'
    ];

    /**
     * Get the user that owns the submission
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the exam result for this submission
     */
    public function result(): HasOne
    {
        return $this->hasOne(ExamResult::class, 'submission_id');
    }

    /**
     * Calculate grade based on score percentage
     */
    public function getGradeAttribute(): string
    {
        $percentage = $this->score_percentage;
        
        if ($percentage >= 90) return 'A';
        if ($percentage >= 80) return 'B';
        if ($percentage >= 70) return 'C';
        if ($percentage >= 60) return 'D';
        return 'F';
    }

    /**
     * Check if the exam was passed
     */
    public function getPassedAttribute(): bool
    {
        return $this->score_percentage >= 70; // 70% passing grade
    }

    /**
     * Scope for auto submissions
     */
    public function scopeAutoSubmitted($query)
    {
        return $query->where('is_auto_submit', true);
    }

    /**
     * Scope for manual submissions
     */
    public function scopeManualSubmitted($query)
    {
        return $query->where('is_auto_submit', false);
    }

    /**
     * Scope for submissions by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('submission_type', $type);
    }
}
