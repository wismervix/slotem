<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
// use App\Models\Availability;
use App\Models\Service;
use App\Models\TimeSlot;
use App\Notifications\BookingConfirmed;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function dateAndTime(Request $request)
    {
        $validated = $request->validate([
            'service' => ['required', 'exists:services,id'],
        ]);

        $service = Service::findOrFail($validated['service']);

        // $availabilities = Availability::with('timeSlots')
        //     ->whereDate('date', '>=', now()->toDateString())
        //     ->get();

        return Inertia::render('Guest/Booking/DateAndTime', [
            'service' => $service,
            // 'availabilities' => $availabilities,
        ]);
    }
    public function create(Request $request)
    {
        $validated = $request->validate([
            'service' => ['required', 'exists:services,id'],
            'slot' => ['required', 'exists:time_slots,id'],
            'date' => ['required', 'date'],
        ]);

        $service = Service::findOrFail($validated['service']);
        $slot = TimeSlot::with('availability')->findOrFail($validated['slot']);

        // Guard: booked slot
        if ($slot->is_booked) {
            return redirect()
                ->route('booking.date-time', [
                    'service' => $service->id
                ])
                ->with('error', 'That slot has already been booked.');
        }

        // Guard: date mismatch
        if ($slot->availability->date !== $validated['date']) {
            abort(403, 'Invalid slot/date combination.');
        }

        return Inertia::render('Guest/Booking/Create', [
            'service' => $service,
            'selectedDate' => $validated['date'],
            'slot' => $slot,
        ]);
    }
    public function store(Request $request, BookingService $bookingService)
    {
        $validated = $request->validate([
            'client_name' => ['required', 'string', 'max:255'],
            'client_email' => ['required', 'email'],
            'service_id' => ['required', 'exists:services,id'],
            'time_slot_id' => ['required', 'exists:time_slots,id'],
            'date' => ['required', 'date'],
        ]);

        $slot = TimeSlot::with('availability')->findOrFail($validated['time_slot_id']);

        if ($slot->is_booked) {
            return back()->withErrors([
                'slot' => 'This slot has already been booked.'
            ]);
        }

        if ($slot->availability->date !== $validated['date']) {
            return back()->withErrors([
                'date' => 'Invalid booking date.'
            ]);
        }

        $booking = $bookingService->createBooking($validated);
        
        if ($booking->user->name !== $validated['client_name']) {
            $booking->user->update([
                'name' => $validated['client_name']
            ]);
        }

        Auth::login($booking->user);
        $request->session()->regenerate();

        $booking->user->notify(
            new BookingConfirmed()
        );

        // return response()->json([
        //     'success' => true,
        //     'booking' => $booking
        // ]);

        return redirect()
            ->route('user.bookings')
            ->with('success', true);
    }
}
