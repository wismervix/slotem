<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\TimeSlot;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingService
{
    public function createBooking(array $data): Booking
    {
        return DB::transaction(function () use ($data) {
            $slot = TimeSlot::lockForUpdate()
                ->findOrFail($data['time_slot_id']);

            if ($slot->is_booked) {
                throw new \Exception('Slot already booked.');
            }

            $booking = Booking::create([
                'client_name' => $data['client_name'],
                'client_email' => $data['client_email'],
                'service_id' => $data['service_id'],
                'availability_id' => $slot->availability_id,
                'time_slot_id' => $slot->id,
                'date' => $data['date'],
                'start_time' => $slot->start_time,
                'end_time' => $slot->end_time,
                'status' => 'approved',
            ]);

            $slot->update([
                'is_booked' => true
            ]);

            return $booking;
        });
    }
}
