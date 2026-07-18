<?php

namespace App\Notifications\Booking;

use Carbon\Carbon;
use App\Models\Booking;
use App\Notifications\BaseNotification;

class NewBooking extends BaseNotification
{
    public function __construct(Booking $booking)
    {
        $date = Carbon::parse($booking->date)->format('F j, Y');
        $start_time = Carbon::parse($booking->start_time)->format('g:i A');


        $this->title = 'New Booking Created 📅';
        $this->message = "{$booking->user->name} booked {$booking->service->name} for {$date} at {$start_time}. Your booking for {$booking->service->name} on {$date} at {$start_time} has been created and is pending approval.";
        $this->category = 'bookings';
        $this->url = route('user.bookings');
        $this->data = [
            'booking_id' => $booking->id,
            'user_id' => $booking->user_id,
        ];
    }
}
