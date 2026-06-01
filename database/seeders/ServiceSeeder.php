<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Signature Haircut',
                'icon' => 'scissors',
                'description' => 'Our most requested service. Includes consultation, precision cut, scalp massage, and styling.',
                'price' => 45,
                'duration' => 45,
                'variant' => 'standard',
                'active' => true,
                'badges' => ['popular', 'recommended'],
                'image' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Beard Trim & Sculpt',
                'icon' => 'user-check',
                'description' => 'A meticulous trim and shape-up using clippers and shears. Finished with organic beard oil.',
                'price' => 25,
                'duration' => 20,
                'variant' => 'standard',
                'active' => true,
                'badges' => ['recommended'],
                'image' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Classic Hot Towel Shave',
                'icon' => 'sparkles',
                'description' => 'Traditional straight razor shave with hot towels and premium pre-shave treatment.',
                'price' => 35,
                'duration' => 30,
                'variant' => 'standard',
                'active' => true,
                'badges' => null,
                'image' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'Hair Coloring',
                'icon' => 'paintbrush',
                'description' => "Full color or grey coverage using premium dyes that protect your hair's health.",
                'price' => 60,
                'duration' => 60,
                'variant' => 'standard',
                'active' => true,
                'badges' => ['popular'],
                'image' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'name' => 'The Deluxe Package',
                'icon' => 'shield-check',
                'description' => 'Our ultimate experience combining the Signature Haircut, Beard Trim, and Charcoal Facial Mask.',
                'price' => 85,
                'duration' => 90,
                'variant' => 'featured',
                'image' => 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop',
                'active' => true,
                'badges' => ['popular', 'recommended', 'best-value'],
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
