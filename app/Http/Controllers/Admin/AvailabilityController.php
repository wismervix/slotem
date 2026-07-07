<?php

namespace App\Http\Controllers\Admin;

use Carbon\CarbonPeriod;
use App\Models\Availability;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AvailabilityController extends Controller
{
    public function availability()
    {
        $availabilities = Availability::with('timeSlots')
            ->orderBy('date')
            ->get();

        return inertia('Admin/Availability', [
            'availabilities' => $availabilities,
        ]);
        // return inertia('Admin/Availability');
    }

    public function store(Request $request)
    {
        Availability::firstOrCreate([
            'date' => $request->date,
        ]);

        Cache::forget('availabilities');

        return back();
    }

    public function destroy(Availability $availability)
    {
        $availability->timeSlots()->delete();

        $availability->delete();

        Cache::forget('availabilities');

        return back();
    }

    public function bulkCreate(Request $request)
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

            // generate slots here
        }

        Cache::forget('availabilities');

        return back();
    }

    public function copySchedule(Request $request)
    {
        $request->validate([
            'source_date' => ['required', 'date'],
            'target_dates' => ['required', 'array'],
            'target_dates.*' => ['date'],
        ]);

        DB::transaction(
            function () use ($request) {
                $source =
                    Availability::with('timeSlots')
                    ->where('date', $request->source_date)
                    ->firstOrFail();

                foreach ($request->target_dates as $targetDate) {

                    // Skip copying onto itself
                    if ($targetDate === $request->source_date) {
                        continue;
                    }

                    $target = Availability::firstOrCreate([
                        'date' => $targetDate,
                    ]);

                    // Remove only unbooked slots
                    $target->timeSlots()
                        ->where('is_booked', false)
                        ->delete();

                    foreach ($source->timeSlots as $slot) {
                        $target->timeSlots()->create([
                            'start_time' => $slot->start_time,
                            'end_time' => $slot->end_time,
                            'is_booked' => false,
                        ]);
                    }
                }
            }
        );

        Cache::forget('availabilities');

        return back();
    }
}
