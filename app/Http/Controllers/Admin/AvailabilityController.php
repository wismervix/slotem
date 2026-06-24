<?php

namespace App\Http\Controllers\Admin;

use App\Models\Availability;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

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

        return back();
    }

    public function destroy(Availability $availability)
    {
        $availability->timeSlots()->delete();

        $availability->delete();

        return back();
    }
}
