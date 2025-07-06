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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('room', 50)->nullable();
            $table->datetime('start_time');
            $table->datetime('end_time');
            $table->string('recurrence_pattern')->nullable(); // e.g., "Mon,Wed,Fri"
            $table->string('semester', 50); // e.g., "Spring 2025"
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['start_time', 'end_time']);
            $table->index('semester');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
