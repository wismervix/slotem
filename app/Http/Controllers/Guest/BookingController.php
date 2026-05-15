<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function dateAndTime()
    {
        return Inertia::render('Guest/Booking/DateAndTime');
    }
    public function create()
    {
        return Inertia::render('Guest/Booking/Create');
    }
    public function store(Request $request, BookingService $service)
    {
        $validated = $request->validate([
            'service_id' => 'required',
            'time_slot_id' => 'required',
            'date' => 'required',
            'client_name' => 'required',
            'client_email' => 'required|email',
        ]);

        $booking = $service->createBooking($validated);

        return response()->json($booking);
    }
}
