<?php

namespace App\Notifications\Admin;

use Carbon\Carbon;
use App\Models\Admin;
use App\Models\Booking;
use App\Notifications\BaseAdminNotification;

class BookingActionNotification extends BaseAdminNotification
{
    public function __construct(protected Booking $booking, protected string $action, protected ?string $note = null)
    {
        $date = Carbon::parse($booking->date)->format('F j, Y');
        $start_time = Carbon::parse($booking->start_time)->format('g:i A');


        $this->type = 'booking_action';
        $this->data = [
            'title' => "Booking {$action} 📅",
            'message' => "Booking for {$booking->service->name} by {$booking->user->name} was {$action}." . ($note ? " Note: {$note}" : ''),
            'booking_id' => $booking->id,
            'booking_date' => $date,
            'booking_time' => $start_time,
            'user_name' => $booking->user->name,
            'service_name' => $booking->service->name,
            'action' => $action,
            'note' => $note,
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
