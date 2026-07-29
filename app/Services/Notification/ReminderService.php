<?php

namespace App\Services\Notification;

use App\Models\Booking;
use App\Models\BookingReminder;
use App\Notifications\Booking\BookingReminder as BookingReminderNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ReminderService
{
    /**
     * Schedule reminders for a booking
     */
    public function scheduleReminders(Booking $booking): void
    {
        $appointmentDateTime = Carbon::parse($booking->date)
            ->setTimeFromTimeString($booking->start_time);

        // 48 hours reminder
        $this->createReminder($booking, '48_hours', $appointmentDateTime->copy()->subHours(48));

        // 24 hours reminder
        $this->createReminder($booking, '24_hours', $appointmentDateTime->copy()->subHours(24));

        // 2 hours reminder (only if booking is approved)
        if ($booking->status === 'approved') {
            $this->createReminder($booking, '2_hours', $appointmentDateTime->copy()->subHours(2));
        }
    }

    /**
     * Schedule 2-hour reminder for an approved booking
     */
    public function scheduleTwoHourReminder(Booking $booking): void
    {
        if ($booking->status !== 'approved') {
            return;
        }

        $appointmentDateTime = Carbon::parse($booking->date)
            ->setTimeFromTimeString($booking->start_time);

        $this->createReminder($booking, '2_hours', $appointmentDateTime->copy()->subHours(2));
    }

    /**
     * Create a reminder record
     */
    protected function createReminder(Booking $booking, string $type, Carbon $scheduledAt): void
    {
        // Only create if the scheduled time is in the future
        if ($scheduledAt->isPast()) {
            return;
        }

        // Check if reminder already exists to prevent duplicates
        $exists = BookingReminder::where('booking_id', $booking->id)
            ->where('type', $type)
            ->exists();

        if (! $exists) {
            BookingReminder::create([
                'booking_id' => $booking->id,
                'type' => $type,
                'scheduled_at' => $scheduledAt,
                'status' => 'pending',
            ]);

            Log::info("Scheduled {$type} reminder for booking #{$booking->id} at {$scheduledAt}");
        }
    }

    /**
     * Send a reminder notification (called by the console command)
     */
    public function sendReminder(BookingReminder $reminder): void
    {
        $booking = $reminder->booking;

        // Format the reminder message based on type
        $reminderTypeLabels = [
            '48_hours' => '48 hours before',
            '24_hours' => '24 hours before',
            '2_hours' => '2 hours before',
        ];

        $label = $reminderTypeLabels[$reminder->type] ?? 'before';

        // Send direct notification
        $booking->user->notify(
            new BookingReminderNotification([
                'title' => "Booking Reminder 🔔 ({$label})",
                'message' => "Reminder: Your booking for {$booking->service->name} is scheduled for {$booking->date} at {$booking->start_time}.",
                'category' => 'reminders',
                'url' => route('user.bookings'),
                'reminder_type' => $reminder->type,
                'booking_id' => $booking->id,
            ])
        );

        // Mark as sent
        $reminder->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        Log::info("Sent {$reminder->type} reminder for booking #{$booking->id}");
    }
}
