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
        Schema::create('booking_reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // 48_hours, 24_hours, 2_hours
            $table->timestamp('scheduled_at');
            $table->timestamp('sent_at')->nullable();
            $table->string('status')->default('pending'); // pending, sent, failed
            $table->timestamps();

            $table->unique(['booking_id', 'type']);
            $table->index(['status', 'scheduled_at']);  
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_reminders');
    }
};
