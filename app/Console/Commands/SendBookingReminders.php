<?php

namespace App\Console\Commands;

use App\Models\BookingReminder;
use App\Services\Notification\BookingNotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendBookingReminders extends Command
{
    protected $signature = 'notifications:send-reminders';
    protected $description = 'Send scheduled booking reminders';

    protected BookingNotificationService $notificationService;

    public function __construct(BookingNotificationService $notificationService)
    {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    public function handle()
    {
        $this->info('🔄 Sending booking reminders...');

        $reminders = BookingReminder::pending()
            ->with('booking.service')
            ->where('scheduled_at', '<=', now())
            ->get();

        if ($reminders->isEmpty()) {
            $this->info('No pending reminders to send.');
            return 0;
        }

        $this->info("Found {$reminders->count()} pending reminders.");

        $sentCount = 0;
        $failedCount = 0;

        $bar = $this->output->createProgressBar($reminders->count());
        $bar->start();

        foreach ($reminders as $reminder) {
            try {
                // Check if booking still exists and is valid
                if (!$reminder->booking || $reminder->booking->status === 'cancelled') {
                    $this->warn("Skipping reminder for cancelled booking #{$reminder->booking_id}");
                    $reminder->update(['status' => 'failed']);
                    $failedCount++;
                    $bar->advance();
                    continue;
                }

                $this->notificationService->sendReminder($reminder);
                $sentCount++;
                $this->line("\n✓ Sent {$reminder->type} reminder for booking #{$reminder->booking_id}");
            } catch (\Exception $e) {
                $failedCount++;
                Log::error("Failed to send reminder for booking #{$reminder->booking_id}: " . $e->getMessage());
                $this->error("\n✗ Failed to send reminder for booking #{$reminder->booking_id}");

                // Update reminder with error
                $reminder->update([
                    'status' => 'failed',
                ]);
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("✅ Sent {$sentCount} reminders, {$failedCount} failed.");

        return 0;
    }
}
