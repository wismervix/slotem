<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            // 'password' => static::$password ??= Hash::make('password'),
            'phone' => fake()->phoneNumber(),

            'avatar_url' => 'https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill,g_face/sample.jpg',

            'remember_token' => Str::random(10),
        ]);

        $this->call([
            ServiceSeeder::class,
            AvailabilityAndTimeSlotSeeder::class,
            AdminSeeder::class,
            // BookingSeeder::class,
        ]);
    }
}
