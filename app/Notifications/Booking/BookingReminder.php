<?php

namespace App\Notifications\Booking;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class BookingReminder extends Notification
{
    use Queueable;

    protected array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'title' => $this->data['title'] ?? 'Booking Reminder',
            'message' => $this->data['message'] ?? '',
            'category' => $this->data['category'] ?? 'reminders',
            'url' => $this->data['url'] ?? route('user.bookings'),
            'reminder_type' => $this->data['reminder_type'] ?? null,
            'booking_id' => $this->data['booking_id'] ?? null,
        ];
    }

    public function toArray($notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}
