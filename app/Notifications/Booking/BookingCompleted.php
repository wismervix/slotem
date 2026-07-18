<?php

namespace App\Notifications\Booking;

use Carbon\Carbon;
use App\Models\Booking;
use App\Notifications\BaseNotification;

class BookingCompleted extends BaseNotification
{
    public function __construct(protected Booking $booking, protected ?string $adminName = null)
    {
        $date = Carbon::parse($booking->date)->format('F j, Y');
        $start_time = Carbon::parse($booking->start_time)->format('g:i A');


        $this->title = 'Booking Completed ✓';
        $this->message = "Your booking for {$booking->service->name} on {$date} at {$start_time} has been completed.";
        $this->category = 'bookings';
        $this->url = route('user.bookings');
        $this->data = ['booking_id' => $booking->id, 'admin_name' => $adminName];
    }
}
