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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('service_id')
                ->constrained('services')
                ->cascadeOnDelete();

            $table->foreignId('availability_id')
                ->constrained('availabilities')
                ->cascadeOnDelete();

            $table->foreignId('time_slot_id')
                ->constrained('time_slots')
                ->cascadeOnDelete();

            $table->string('client_name');

            $table->string('client_email');

            $table->date('date');

            $table->time('start_time');

            $table->time('end_time');

            $table->enum('status', [
                'pending',
                'approved',
                'completed',
                'rejected',
                'cancelled',
            ]);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
