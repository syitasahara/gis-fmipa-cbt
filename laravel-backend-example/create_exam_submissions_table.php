<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exam_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('submitted_at');
            $table->integer('duration_minutes')->default(0);
            $table->integer('total_violations')->default(0);
            $table->boolean('is_auto_submit')->default(false);
            $table->enum('submission_type', ['manual', 'auto', 'timeout'])->default('manual');
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->json('browser_info')->nullable();
            $table->json('exam_metadata')->nullable();
            
            // Exam results
            $table->integer('total_questions');
            $table->integer('answered_questions');
            $table->integer('correct_answers');
            $table->integer('wrong_answers');
            $table->integer('unanswered_questions');
            $table->decimal('total_score', 8, 2)->default(0);
            $table->decimal('score_percentage', 5, 2)->default(0);
            $table->decimal('max_possible_score', 8, 2)->default(0);
            
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'submitted_at']);
            $table->index('submission_type');
            $table->index('score_percentage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_submissions');
    }
};
