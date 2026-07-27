<?php

namespace App\Services\Notification;

use App\Models\Booking;
use App\Models\User;
use App\Models\Admin;
use App\Models\BookingReminder;
use App\Services\Notification\NotificationDispatcher;
// use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class BookingNotificationService
{
    protected NotificationDispatcher $dispatcher;

    public function __construct(NotificationDispatcher $dispatcher)
    {
        $this->dispatcher = $dispatcher;
    }

    /**
     * Notify when booking is created
     */
    public function notifyCreated(Booking $booking): void
    {
        // Notify user
        $this->sendToUser($booking->user, [
            'title' => 'New Booking Created 📅',
            'message' => "Your booking for {$booking->service->name} on {$booking->date} at {$booking->start_time} has been created and is pending approval.",
            'category' => 'bookings',
            'url' => route('user.bookings'),
        ], 'booking_created');

        // Notify admins
        $this->notifyAdmins([
            'title' => 'New Booking Created 📅',
            'message' => "{$booking->user->name} has created a new booking for {$booking->service->name} on {$booking->date} at {$booking->start_time}.",
            'category' => 'admin-actions',
            'url' => route('admin.bookings'),
        ], 'booking_created', ['booking_id' => $booking->id]);

        // Schedule reminders
        $this->scheduleReminders($booking);
    }

    /**
     * Notify when booking is confirmed (approved)
     */
    public function notifyConfirmed(Booking $booking, ?Admin $admin = null): void
    {
        $adminName = $admin ? $admin->name : 'Administrator';

        $this->sendToUser($booking->user, [
            'title' => 'Booking Confirmed ✅',
            'message' => "Your booking for {$booking->service->name} on {$booking->date} at {$booking->start_time} has been confirmed by {$adminName}.",
            'category' => 'bookings',
            'url' => route('user.bookings'),
        ], 'booking_confirmed');
    }

    /**
     * Notify when booking is rejected
     */
    public function notifyRejected(Booking $booking, ?Admin $admin = null, ?string $reason = null): void
    {
        $adminName = $admin ? $admin->name : 'Administrator';
        $reasonText = $reason ? " Reason: {$reason}" : '';

        $this->sendToUser($booking->user, [
            'title' => 'Booking Declined ❌',
            'message' => "Your booking for {$booking->service->name} on {$booking->date} has been declined by {$adminName}.{$reasonText}",
            'category' => 'bookings',
            'url' => route('user.bookings'),
        ], 'booking_rejected');
    }

    /**
     * Notify when booking is completed
     */
    public function notifyCompleted(Booking $booking): void
    {
        $this->sendToUser($booking->user, [
            'title' => 'Booking Completed ✅',
            'message' => "Your booking for {$booking->service->name} on {$booking->date} has been marked as completed. Thank you!",
            'category' => 'bookings',
            'url' => route('user.bookings'),
        ], 'booking_completed');
    }

    /**
     * Notify when booking is cancelled
     */
    public function notifyCancelled(Booking $booking, bool $byUser = true): void
    {
        $title = $byUser ? 'Booking Cancelled ❌' : 'Booking Cancelled by Admin ❌';
        $message = $byUser
            ? "Your booking for {$booking->service->name} on {$booking->date} has been cancelled."
            : "Your booking for {$booking->service->name} on {$booking->date} was cancelled by an administrator.";

        $this->sendToUser($booking->user, [
            'title' => $title,
            'message' => $message,
            'category' => 'bookings',
            'url' => route('user.bookings'),
        ], 'booking_cancelled');

        // Notify admins if user cancelled
        if ($byUser) {
            $this->notifyAdmins([
                'title' => 'Booking Cancelled ❌',
                'message' => "{$booking->user->name} has cancelled their booking for {$booking->service->name} on {$booking->date}.",
                'category' => 'admin-actions',
                'url' => route('admin.bookings'),
            ], 'booking_cancelled', ['booking_id' => $booking->id]);
        }
    }

    /**
     * Schedule reminders for a booking
     */
    protected function scheduleReminders(Booking $booking): void
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
     * Create a reminder record
     */
    protected function createReminder(Booking $booking, string $type, Carbon $scheduledAt): void
    {
        // Only create if the scheduled time is in the future
        if ($scheduledAt->isPast()) {
            return;
        }

        BookingReminder::create([
            'booking_id' => $booking->id,
            'type' => $type,
            'scheduled_at' => $scheduledAt,
            'status' => 'pending',
        ]);
    }

    /**
     * Send reminder for a booking
     */
    public function sendReminder(BookingReminder $reminder): void
    {
        $booking = $reminder->booking;

        $this->sendToUser($booking->user, [
            'title' => 'Booking Reminder 🔔',
            'message' => "Reminder: Your booking for {$booking->service->name} is scheduled for {$booking->date} at {$booking->start_time}.",
            'category' => 'reminders',
            'url' => route('user.bookings'),
            'reminder_type' => $reminder->type,
        ], 'booking_reminder');

        $reminder->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }

    /**
     * Send notification to a user
     */
    protected function sendToUser(User $user, array $data, string $type): void
    {
        try {
            $this->dispatcher
                ->type($type)
                ->to($user)
                ->data($data)
                ->send();
        } catch (\Exception $e) {
            Log::error("Failed to send booking notification to user {$user->id}: " . $e->getMessage());
        }
    }

    /**
     * Notify all admins
     */
    protected function notifyAdmins(array $data, string $type, array $meta = []): void
    {
        $admins = Admin::all();

        foreach ($admins as $admin) {
            try {
                $this->dispatcher
                    ->type($type)
                    ->to($admin)
                    ->data($data)
                    ->meta($meta)
                    ->send();
            } catch (\Exception $e) {
                Log::error("Failed to send booking notification to admin {$admin->id}: " . $e->getMessage());
            }
        }
    }
}
