<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Availability;
use App\Models\TimeSlot;
use Carbon\Carbon;

class AvailabilityAndTimeSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $startDate = Carbon::create(2026, 4, 15);
        $endDate = Carbon::create(2026, 12, 31);

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {

            // Skip Sundays
            if ($date->isSunday()) {
                continue;
            }

            $availability = Availability::create([
                'date' => $date->toDateString(),
            ]);

            // Saturday rule
            if ($date->isSaturday()) {
                $this->generateSlots($availability->id, 10, 15);
            } else {
                // Weekdays
                $this->generateSlots($availability->id, 9, 17);
            }
        }
    }

    private function generateSlots(int $availabilityId, int $startHour, int $endHour)
    {
        for ($hour = $startHour; $hour < $endHour; $hour++) {
            TimeSlot::create([
                'availability_id' => $availabilityId,
                'start_time' => sprintf('%02d:00:00', $hour),
                'end_time' => sprintf('%02d:00:00', $hour + 1),
            ]);
        }
    }
}
