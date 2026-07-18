<?php

namespace App\Notifications\Booking;

use Carbon\Carbon;
use App\Models\Booking;
use App\Notifications\BaseNotification;

class BookingCancelled extends BaseNotification
{
    public function __construct(protected Booking $booking, protected bool $isUserCancelled = true)
    {
        $date = Carbon::parse($booking->date)->format('F j, Y');


        $this->title = $isUserCancelled ? 'Booking Cancelled ✕' : 'Booking Cancelled by Admin ✕';
        $this->message = $isUserCancelled
            ? "Your booking for {$booking->service->name} on {$date} has been cancelled."
            : "Your booking for {$booking->service->name} on {$date} was cancelled by an administrator.";
        $this->category = 'bookings';
        $this->url = route('user.bookings');
        $this->data = ['booking_id' => $booking->id];
    }
}
