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
        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('submission_id')->constrained('exam_submissions')->onDelete('cascade');
            $table->integer('total_questions');
            $table->integer('correct_answers');
            $table->integer('wrong_answers');
            $table->integer('unanswered_questions');
            $table->decimal('score', 8, 2);
            $table->decimal('score_percentage', 5, 2);
            $table->string('grade', 2);
            $table->boolean('passed')->default(false);
            $table->date('exam_date');
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'exam_date']);
            $table->index('grade');
            $table->index('passed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_results');
    }
};
