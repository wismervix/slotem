<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\BookingStatusRequest;
use App\Notifications\Admin\BookingActionNotification;
use App\Notifications\Booking\BookingApproved;
use App\Notifications\Booking\BookingCancelled;
use App\Notifications\Booking\BookingCompleted;
use App\Notifications\Booking\BookingRejected;
use App\Notifications\Booking\BookingRestored;
use App\Services\Notification\BookingNotificationService;


class BookingController extends Controller
{
    protected BookingNotificationService $bookingNotification;
    
    public function __construct(BookingNotificationService $bookingNotification)
    {
        $this->bookingNotification = $bookingNotification;
    }
    
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
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $validated = $request->validate([
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        // Only pending bookings can be approved
        if ($booking->status !== 'pending') {
            return back()->with('error', 'Only pending bookings can be approved.');
        }

        DB::transaction(function () use ($request, $booking, $validated, $admin) {
            $booking->update([
                'status' => 'approved',
                // 'admin_note' => $validated['note'] ?? null,
            ]);

            // You can add notification logic here

            // Notify user
            $booking->user->notify(
                new BookingApproved($booking, $admin->name)
            );

            // Notify admin who performed action
            $adminNotification = new BookingActionNotification($booking, 'approved', $validated['note'] ?? null);
            $adminNotification->sendToAllAdmins();
            // Send notification
            // $this->bookingNotification->notifyConfirmed($booking, $admin);
        });

        return back()->with('success', 'Booking approved successfully.');
    }

    /**
     * Reject a pending booking.
     */
    public function reject(BookingStatusRequest $request, Booking $booking)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        // Only pending bookings can be rejected
        if ($booking->status !== 'pending') {
            return back()->with('error', 'Only pending bookings can be rejected.');
        }

        DB::transaction(function () use ($request, $booking, $validated, $admin) {
            $booking->update([
                'status' => 'rejected',
                // 'rejection_reason' => $validated['reason'],
            ]);


            // Free up the time slot
            $booking->timeSlot()->update(['is_booked' => false]);

            // Notify user
            $booking->user->notify(
                new BookingRejected($booking, $admin->name)
                // new BookingRejected($booking, $validated['reason'])
            );

            // Notify admin who performed action
            $adminNotification = new BookingActionNotification($booking, 'rejected', $validated['reason']);
            // $adminNotification->send($admin);
            $adminNotification->sendToAllAdmins();
        });

        return back()->with('success', 'Booking rejected successfully.');
    }

    /**
     * Mark an approved booking as completed.
     */
    public function complete(BookingStatusRequest $request, Booking $booking)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        // Only approved bookings can be marked as completed
        if ($booking->status !== 'approved') {
            return back()->with('error', 'Only approved bookings can be marked as completed.');
        }

        DB::transaction(function () use ($request, $booking, $admin) {
            $booking->update([
                'status' => 'completed',
            ]);


            // Notify user
            $booking->user->notify(
                new BookingCompleted($booking)
            );


            // Notify admin who performed action
            $adminNotification = new BookingActionNotification($booking, 'completed');
            // $adminNotification->send($admin);
            $adminNotification->sendToAllAdmins();
        });

        return back()->with('success', 'Booking marked as completed.');
    }

    /**
     * Cancel an approved booking.
     */
    public function cancel(BookingStatusRequest $request, Booking $booking)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        // Only approved bookings can be cancelled
        if ($booking->status !== 'approved') {
            return back()->with('error', 'Only approved bookings can be cancelled.');
        }

        DB::transaction(function () use ($request, $booking, $admin) {
            $booking->update([
                'status' => 'cancelled',
            ]);

            $booking->timeSlot()->update(['is_booked' => false]);

            // Notify user
            $booking->user->notify(
                new BookingCancelled($booking, false)
            );


            // Notify admin who performed action
            $adminNotification = new BookingActionNotification($booking, 'cancelled by admin');
            // $adminNotification->send($admin);
            $adminNotification->sendToAllAdmins();
        });

        return back()->with('success', 'Booking cancelled successfully.');
    }

    /**
     * Restore a rejected booking back to pending.
     */
    public function restore(BookingStatusRequest $request, Booking $booking)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        // Only rejected bookings can be restored
        if ($booking->status !== 'rejected') {
            return back()->with('error', 'Only rejected bookings can be restored.');
        }

        DB::transaction(function () use ($request, $booking, $admin) {
            $booking->update([
                'status' => 'pending',
            ]);

            // You can add notification logic here

            // Notify user
            $booking->user->notify(
                new BookingRestored($booking, $admin->name)
            );

            // Notify admin who performed action
            $adminNotification = new BookingActionNotification($booking, 'restored');
            // $adminNotification->send($admin);
            $adminNotification->sendToAllAdmins();
        });

        return back()->with('success', 'Booking restored to pending.');
    }
}
