<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\TimeSlot;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some slots
        $slot1 = TimeSlot::find(1);
        $slot2 = TimeSlot::find(2);
        $slot3 = TimeSlot::find(3);
        $slot4 = TimeSlot::find(4);

        $bookings = [
            [
                'service_id' => 1,
                'slot' => $slot1,
                'client_name' => 'John Doe',
                'client_email' => 'john@example.com',
                'status' => 'approved',
            ],

            [
                'service_id' => 2,
                'slot' => $slot2,
                'client_name' => 'Jane Smith',
                'client_email' => 'jane@example.com',
                'status' => 'completed',
            ],

            [
                'service_id' => 3,
                'slot' => $slot3,
                'client_name' => 'Elena Lopez',
                'client_email' => 'elena@example.com',
                'status' => 'pending',
            ],

            [
                'service_id' => 4,
                'slot' => $slot4,
                'client_name' => 'Thomas H.',
                'client_email' => 'thomas@example.com',
                'status' => 'cancelled',
            ],
        ];

        foreach ($bookings as $item) {

            Booking::create([
                'service_id' => $item['service_id'],

                'availability_id' => $item['slot']->availability_id,

                'time_slot_id' => $item['slot']->id,

                'date' => $item['slot']->availability->date,

                'start_time' => $item['slot']->start_time,

                'end_time' => $item['slot']->end_time,

                'client_name' => $item['client_name'],

                'client_email' => $item['client_email'],

                'status' => $item['status'],

                'created_at' => now(),
            ]);

            // Mark slot as booked
            $item['slot']->update([
                'is_booked' => true,
            ]);
        }
    }
}
