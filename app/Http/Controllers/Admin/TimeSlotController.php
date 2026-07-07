<?php

namespace App\Http\Controllers\Admin;

use App\Models\TimeSlot;
use Carbon\CarbonPeriod;
use App\Models\Availability;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTimeSlotRequest;
use App\Http\Requests\UpdateTimeSlotRequest;
use App\Services\AvailabilityService;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TimeSlotController extends Controller
{
    private function hasOverlap(
        int $availabilityId,
        string $startTime,
        string $endTime,
        ?int $ignoreSlotId = null
    ): bool {
        return TimeSlot::where(
            'availability_id',
            $availabilityId
        )
            ->when(
                $ignoreSlotId,
                fn($q) => $q->where('id', '!=', $ignoreSlotId)
            )
            ->where(function ($query) use (
                $startTime,
                $endTime
            ) {
                $query
                    ->where('start_time', '<', $endTime)
                    ->where('end_time', '>', $startTime);
            })
            ->exists();
    }

    public function store(StoreTimeSlotRequest $request)
    {
        $availability = Availability::firstOrCreate([
            'date' => $request->date,
        ]);

        $exists = TimeSlot::where(
            'availability_id',
            $availability->id
        )
            ->where('start_time', $request->start_time)
            ->where('end_time', $request->end_time)
            ->exists();

        if ($exists) {
            abort(422, 'This slot already exists.');
        }

        if (
            $this->hasOverlap(
                $availability->id,
                $request->start_time,
                $request->end_time
            )
        ) {
            abort(422, 'Slot overlaps with another slot.');
        }

        TimeSlot::create([
            'availability_id' => $availability->id,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'is_booked' => false,
        ]);

        Cache::forget('availabilities');

        return back();
    }

    public function update(UpdateTimeSlotRequest $request, TimeSlot $timeSlot)
    {
        if (
            $this->hasOverlap(
                $timeSlot->availability_id,
                $request->start_time,
                $request->end_time,
                $timeSlot->id
            )
        ) {
            abort(422, 'Slot overlaps with another slot.');
        }

        $timeSlot->update([
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        Cache::forget('availabilities');

        return back();
    }

    public function destroy(TimeSlot $timeSlot)
    {
        if ($timeSlot->is_booked) {
            abort(422);
        }

        $timeSlot->delete();

        $availability = $timeSlot->availability;

        if ($availability->timeSlots()->count() === 0) {
            $availability->delete();
        }

        Cache::forget('availabilities');

        return back();
    }

    public function bulkCreate(Request $request, AvailabilityService $availabilityService)
    {
        $period = CarbonPeriod::create(
            $request->start_date,
            $request->end_date
        );

        foreach ($period as $date) {

            if (
                in_array(
                    $date->format('Y-m-d'),
                    $request->closed_dates ?? []
                )
            ) {
                continue;
            }

            if (
                in_array(
                    $date->dayOfWeek,
                    $request->closed_weekdays ?? []
                )
            ) {
                continue;
            }

            $availability =
                Availability::firstOrCreate([
                    'date' => $date->format('Y-m-d'),
                ]);

            $availabilityService->generateSlots(
                $availability,
                $request->start_time,
                $request->end_time
            );
        }

        Cache::forget('availabilities');

        return back();
    }
}
