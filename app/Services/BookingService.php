<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\TimeSlot;
use Illuminate\Validation\ValidationException;

class BookingService
{
    public function createBooking(array $data): Booking
    {
        $slot = TimeSlot::findOrFail($data['time_slot_id']);

        // 1. Prevent double booking
        if ($slot->is_booked) {
            throw ValidationException::withMessages([
                'time_slot' => 'This time slot is already booked.',
            ]);
        }

        // 2. Create booking
        $booking = Booking::create([
            'service_id' => $data['service_id'],
            'time_slot_id' => $slot->id,
            'availability_id' => $slot->availability_id,
            'date' => $data['date'],
            'start_time' => $slot->start_time,
            'end_time' => $slot->end_time,
            'client_name' => $data['client_name'],
            'client_email' => $data['client_email'],
            'status' => 'pending',
            'created_at' => now(),
        ]);

        // 3. Mark slot as booked
        $slot->update([
            'is_booked' => true,
        ]);

        return $booking;
    }
}
