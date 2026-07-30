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
        string $endTime,
        int $intervalMinutes = 60
    ): int {
        $start = Carbon::createFromFormat(
            'H:i',
            $startTime
        );

        $end = Carbon::createFromFormat(
            'H:i',
            $endTime
        );

        $slotsCreated = 0;

        while ($start < $end) {

            $next = $start->copy()->addHour();

            // Check if slot already exists
            $exists = TimeSlot::where('availability_id', $availability->id)
                ->where('start_time', $start->format('H:i:s'))
                ->where('end_time', $next->format('H:i:s'))
                ->exists();

            if (!$exists) {
                TimeSlot::create([
                    'availability_id' => $availability->id,
                    'start_time' => $start->format('H:i:s'),
                    'end_time' => $next->format('H:i:s'),
                    'is_booked' => false,
                ]);
                $slotsCreated++;
            }

            $start = $next;
        }

        return $slotsCreated;
    }
}
