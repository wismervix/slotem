<?php

namespace App\Console\Commands;

use App\Models\ScheduledNotification;
use App\Services\Notification\BroadcastService;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessScheduledNotifications extends Command
{
    protected $signature = 'notifications:process-scheduled';
    protected $description = 'Process scheduled notifications';

    protected BroadcastService $broadcastService;

    public function __construct(BroadcastService $broadcastService)
    {
        parent::__construct();
        $this->broadcastService = $broadcastService;
    }

    public function handle()
    {
        $this->info('🔄 Processing scheduled notifications...');

        $scheduled = ScheduledNotification::pending()
            ->where('scheduled_at', '<=', now())
            ->get();

        if ($scheduled->isEmpty()) {
            $this->info('No scheduled notifications to process.');
            return 0;
        }

        $this->info("Found {$scheduled->count()} scheduled notifications.");

        $processedCount = 0;
        $failedCount = 0;

        foreach ($scheduled as $notification) {
            try {
                $this->info("\nProcessing notification #{$notification->id}: {$notification->title}");
                $this->processNotification($notification);
                $processedCount++;
                $this->info("✅ Processed scheduled notification #{$notification->id}");
            } catch (\Exception $e) {
                $failedCount++;
                Log::error("Failed to process scheduled notification #{$notification->id}: " . $e->getMessage());
                $this->error("❌ Failed to process scheduled notification #{$notification->id}: " . $e->getMessage());

                // Update notification with error
                $notification->update([
                    'status' => 'failed',
                    'error' => $e->getMessage(),
                    'attempts' => $notification->attempts + 1,
                ]);
            }
        }

        $this->newLine(2);
        $this->info("✅ Processed {$processedCount} notifications, {$failedCount} failed.");

        return 0;
    }

    protected function processNotification(ScheduledNotification $notification): void
    {
        Log::info('Processing scheduled notification', [
            'id' => $notification->id,
            'type' => $notification->type,
            'targets' => $notification->targets,
            'scheduled_at' => $notification->scheduled_at,
        ]);

        $admin = Admin::find($notification->created_by);

        if (!$admin) {
            throw new \Exception("Admin not found for notification #{$notification->id}");
        }

        $this->broadcastService->by($admin);

        $targets = $notification->targets ?? ['all'];
        $userIds = $targets['user_ids'] ?? [];

        // Debug: Log what we're working with
        $this->info("Targets: " . json_encode($targets));

        // Determine the target type
        if (in_array('all', $targets)) {
            $this->info("Sending to all users...");
            $this->broadcastService->toAll(
                $notification->title,
                $notification->message,
                $notification->data ?? []
            );
        } elseif (isset($targets['custom']) && isset($targets['user_ids'])) {
            $userIds = $targets['user_ids'];
            $this->info("Sending to " . count($userIds) . " custom users: " . implode(', ', $userIds));

            $users = User::whereIn('id', $userIds)->get();

            if ($users->isEmpty()) {
                throw new \Exception("No users found with the provided IDs");
            }

            $this->broadcastService->toUsers(
                $users,
                $notification->title,
                $notification->message,
                [
                    'user_ids' => $userIds,
                    'type' => $notification->data['type'] ?? 'info',
                    'priority' => $notification->data['priority'] ?? 'normal',
                ]
            );
        } elseif (isset($targets['user_ids'])) {
            $userIds = $targets['user_ids'];
            $this->info("Sending to " . count($userIds) . " users: " . implode(', ', $userIds));

            $users = User::whereIn('id', $userIds)->get();

            if ($users->isEmpty()) {
                throw new \Exception("No users found with the provided IDs");
            }

            $this->broadcastService->toUsers(
                $users,
                $notification->title,
                $notification->message,
                [
                    'user_ids' => $userIds,
                    'type' => $notification->data['type'] ?? 'info',
                    'priority' => $notification->data['priority'] ?? 'normal',
                ]
            );
        } else {
            // Default to all users
            $this->info("Sending to all users (default)...");
            $this->broadcastService->toAll(
                $notification->title,
                $notification->message,
                $notification->data ?? []
            );
        }

        $notification->update([
            'status' => 'sent',
            'sent_at' => now(),
            'attempts' => $notification->attempts + 1,
        ]);
    }
}
