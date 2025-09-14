<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExamSubmissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Add your authorization logic here
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'userId' => 'required|integer|exists:users,id',
            'durationInMinutes' => 'nullable|integer|min:0|max:180', // Max 3 hours
            'totalViolations' => 'nullable|integer|min:0|max:100',
            'isAutoSubmit' => 'nullable|boolean',
            'submissionType' => 'nullable|string|in:manual,auto,timeout',
            'browserInfo' => 'nullable|array',
            'browserInfo.userAgent' => 'nullable|string|max:1000',
            'browserInfo.language' => 'nullable|string|max:10',
            'browserInfo.platform' => 'nullable|string|max:100',
            'browserInfo.cookieEnabled' => 'nullable|boolean',
            'examMetadata' => 'nullable|array',
            'examMetadata.totalQuestions' => 'nullable|integer|min:0',
            'examMetadata.answeredQuestions' => 'nullable|integer|min:0',
            'examMetadata.timeSpent' => 'nullable|integer|min:0',
            'examMetadata.violations' => 'nullable|integer|min:0'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'userId.required' => 'User ID is required for exam submission.',
            'userId.exists' => 'The specified user does not exist.',
            'durationInMinutes.max' => 'Exam duration cannot exceed 180 minutes.',
            'totalViolations.max' => 'Total violations cannot exceed 100.',
            'submissionType.in' => 'Submission type must be one of: manual, auto, timeout.'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'userId' => 'user ID',
            'durationInMinutes' => 'exam duration',
            'totalViolations' => 'total violations',
            'isAutoSubmit' => 'auto submit flag',
            'submissionType' => 'submission type'
        ];
    }
}
