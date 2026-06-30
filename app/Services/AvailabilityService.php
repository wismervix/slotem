<?php

namespace App\Services;

use App\Models\Availability;
use App\Models\TimeSlot;
use Carbon\Carbon;

class AvailabilityService
{
    public function generateSlots(
        Availability $availability,
        string $startTime,
        string $endTime
    ): void {
        $start = Carbon::createFromFormat(
            'H:i',
            $startTime
        );

        $end = Carbon::createFromFormat(
            'H:i',
            $endTime
        );

        while ($start < $end) {

            $next = $start->copy()->addHour();

            TimeSlot::firstOrCreate([
                'availability_id' => $availability->id,
                'start_time' => $start->format('H:i:s'),
                'end_time' => $next->format('H:i:s'),
            ], [
                'is_booked' => false,
            ]);

            $start = $next;
        }
    }
}
