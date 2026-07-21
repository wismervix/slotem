<?php

namespace App\Notifications\Admin;

use Carbon\Carbon;
use App\Models\Booking;
use App\Models\Admin;
use App\Notifications\BaseAdminNotification;

class UserCancelledBookingNotification extends BaseAdminNotification
{
    public function __construct(protected Booking $booking)
    {
        $date = Carbon::parse($booking->date)->format('F j, Y');
        $start_time = Carbon::parse($booking->start_time)->format('g:i A');


        $this->type = 'user_booking_actions';
        $this->data = [
            'title' => 'User Cancelled Booking ❌',
            'message' => "{$booking->user->name} has cancelled their booking for {$booking->service->name} on {$date} at {$start_time}.",
            'booking_id' => $booking->id,
            'user_id' => $booking->user_id,
            'user_name' => $booking->user->name,
            'service_name' => $booking->service->name,
            'booking_date' => $date,
            'booking_time' => $start_time,
            'url' => route('admin.bookings'),
        ];
    }

    public function sendToAllAdmins(): void
    {
        $admins = Admin::all();
        foreach ($admins as $admin) {
            $this->send($admin);
        }
    }
}
