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
        Schema::create('scheduled_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // reminder, broadcast, custom
            $table->string('title')->nullable();
            $table->text('message');
            $table->json('data')->nullable();
            $table->json('targets')->nullable(); // ['all', 'user_ids', 'filters']
            $table->timestamp('scheduled_at');
            $table->timestamp('sent_at')->nullable();
            $table->string('status')->default('pending'); // pending, sent, failed
            $table->integer('attempts')->default(0);
            $table->text('error')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('admins')->nullOnDelete();
            $table->timestamps();

            $table->index(['status', 'scheduled_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scheduled_notifications');
    }
};
