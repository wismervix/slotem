<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notification_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->boolean('is_system')->default(false);
            $table->timestamps();
        });

        // Insert default categories
        DB::table('notification_categories')->insert([
            ['name' => 'Bookings', 'slug' => 'bookings', 'icon' => 'calendar-check', 'color' => '#10B981', 'is_system' => true],
            ['name' => 'Reminders', 'slug' => 'reminders', 'icon' => 'clock', 'color' => '#F59E0B', 'is_system' => true],
            ['name' => 'Updates', 'slug' => 'updates', 'icon' => 'megaphone', 'color' => '#3B82F6', 'is_system' => true],
            ['name' => 'System', 'slug' => 'system', 'icon' => 'settings', 'color' => '#8B5CF6', 'is_system' => true],
            ['name' => 'Broadcasts', 'slug' => 'broadcasts', 'icon' => 'radio', 'color' => '#EC4899', 'is_system' => true],
            ['name' => 'Profile', 'slug' => 'profile', 'icon' => 'user', 'color' => '#6366F1', 'is_system' => true],
            ['name' => 'Admin Actions', 'slug' => 'admin-actions', 'icon' => 'shield', 'color' => '#EF4444', 'is_system' => true],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_categories');
    }
};
