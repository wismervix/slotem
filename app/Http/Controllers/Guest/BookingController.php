<?php

namespace App\Http\Controllers\Guest;

use Inertia\Inertia;
use App\Models\User;
use App\Models\Service;
use App\Models\Booking;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Services\BookingService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Notifications\BookingConfirmed;

class BookingController extends Controller
{
    public function dateAndTime(Request $request)
    {
        $validated = $request->validate([
            'service' => ['required', 'exists:services,id'],
        ]);

        $service = Service::findOrFail($validated['service']);


        return Inertia::render('Guest/Booking/DateAndTime', [
            'service' => $service,
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
    public function storeAuthenticated(
        Request $request,
        BookingService $bookingService
    ) {
        $validated = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'time_slot_id' => ['required', 'exists:time_slots,id'],
            'date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        $slot = TimeSlot::with('availability')
            ->findOrFail($validated['time_slot_id']);

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

        /** @var User $user */
        $user = Auth::user();

        $booking = $bookingService->createBooking([
            'client_name' => $user->name,
            'client_email' => $user->email,
            'service_id' => $validated['service_id'],
            'time_slot_id' => $validated['time_slot_id'],
            'date' => $validated['date'],
            'notes' => $validated['notes'] ?? null,
        ]);

        $user->notify(
            new BookingConfirmed()
        );

        return back()->with([
            'success' => 'Booking created successfully.',
            'booking_id' => $booking->id,
        ]);
    }
    public function cancel(Booking $booking)
    {
        /** @var User $user */
        $user = Auth::user();

        if ($booking->user_id !== $user->id) {
            abort(403);
        }

        if ($booking->status === 'cancelled') {
            return back();
        }

        if ($booking->status === 'completed') {
            return back()->withErrors([
                'booking' =>
                'Completed bookings cannot be cancelled.'
            ]);
        }

        $appointmentDateTime = Carbon::parse(
            "{$booking->date} {$booking->start_time}"
        );

        if ($appointmentDateTime->isBefore(now()->addHours(24))) {
            return back()->withErrors([
                'booking' =>
                'Bookings can only be cancelled at least 24 hours before the appointment.'
            ]);
        }

        DB::transaction(function () use ($booking) {

            $booking->update([
                'status' => 'cancelled',
            ]);

            $booking->timeSlot()->update([
                'is_booked' => false,
            ]);
        });

        return back()->with(
            'success',
            'Booking cancelled successfully.'
        );
    }
}
