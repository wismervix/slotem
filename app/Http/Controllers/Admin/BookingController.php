<?php

namespace App\Http\Controllers\Admin;

use App\Models\Booking;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\BookingStatusRequest;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::all();

        return inertia('Admin/Bookings', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Approve a pending booking.
     */
    public function approve(BookingStatusRequest $request, Booking $booking)
    {
        // Only pending bookings can be approved
        if ($booking->status !== 'pending') {
            return back()->with('error', 'Only pending bookings can be approved.');
        }

        DB::transaction(function () use ($request, $booking) {
            $booking->update([
                'status' => 'approved',
            ]);

            // You can add notification logic here
            // Example: $booking->user->notify(new BookingApprovedNotification($booking));
        });

        return back()->with('success', 'Booking approved successfully.');
    }

    /**
     * Reject a pending booking.
     */
    public function reject(BookingStatusRequest $request, Booking $booking)
    {
        // Only pending bookings can be rejected
        if ($booking->status !== 'pending') {
            return back()->with('error', 'Only pending bookings can be rejected.');
        }

        DB::transaction(function () use ($request, $booking) {
            $booking->update([
                'status' => 'rejected',
            ]);

            // You can add notification logic here
            // Example: $booking->user->notify(new BookingRejectedNotification($booking));
        });

        return back()->with('success', 'Booking rejected successfully.');
    }

    /**
     * Mark an approved booking as completed.
     */
    public function complete(BookingStatusRequest $request, Booking $booking)
    {
        // Only approved bookings can be marked as completed
        if ($booking->status !== 'approved') {
            return back()->with('error', 'Only approved bookings can be marked as completed.');
        }

        DB::transaction(function () use ($request, $booking) {
            $booking->update([
                'status' => 'completed',
            ]);

            // You can add notification logic here
            // Example: $booking->user->notify(new BookingCompletedNotification($booking));
        });

        return back()->with('success', 'Booking marked as completed.');
    }

    /**
     * Cancel an approved booking.
     */
    public function cancel(BookingStatusRequest $request, Booking $booking)
    {
        // Only approved bookings can be cancelled
        if ($booking->status !== 'approved') {
            return back()->with('error', 'Only approved bookings can be cancelled.');
        }

        DB::transaction(function () use ($request, $booking) {
            $booking->update([
                'status' => 'cancelled',
            ]);

            // You can add notification logic here
            // Example: $booking->user->notify(new BookingCancelledNotification($booking));
        });

        return back()->with('success', 'Booking cancelled successfully.');
    }

    /**
     * Restore a rejected booking back to pending.
     */
    public function restore(BookingStatusRequest $request, Booking $booking)
    {
        // Only rejected bookings can be restored
        if ($booking->status !== 'rejected') {
            return back()->with('error', 'Only rejected bookings can be restored.');
        }

        DB::transaction(function () use ($request, $booking) {
            $booking->update([
                'status' => 'pending',
            ]);

            // You can add notification logic here
            // Example: $booking->user->notify(new BookingRestoredNotification($booking));
        });

        return back()->with('success', 'Booking restored to pending.');
    }
}
