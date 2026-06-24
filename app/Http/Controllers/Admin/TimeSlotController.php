<?php

namespace App\Http\Controllers\Admin;

use App\Models\TimeSlot;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Availability;
use Carbon\CarbonPeriod;

class TimeSlotController extends Controller
{
    public function store(Request $request)
    {
        TimeSlot::create([
            'availability_id' => $request->availability_id,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'is_booked' => false,
        ]);

        return back();
    }

    public function update(Request $request, TimeSlot $timeSlot) 
    {
        $timeSlot->update([
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        return back();
    }

    public function destroy(TimeSlot $timeSlot)
    {
        if ($timeSlot->is_booked) {
            abort(422);
        }

        $timeSlot->delete();

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

        return back();
    }
}
