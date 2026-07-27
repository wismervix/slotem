<?php

namespace App\Services\Notification;

use App\Models\User;
use App\Models\Admin;
use App\Models\Broadcast;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\ScheduledNotification;
use App\Notifications\User\BroadcastNotification;
use App\Services\Notification\NotificationDispatcher;

class  BroadcastService
{
    protected NotificationDispatcher $dispatcher;
    protected Admin $admin;

    public function __construct(NotificationDispatcher $dispatcher)
    {
        $this->dispatcher = $dispatcher;
    }

    /**
     * Set the admin sending the broadcast
     */
    public function by(Admin $admin): self
    {
        $this->admin = $admin;
        return $this;
    }

    /**
     * Send broadcast to all users
     */
    public function toAll(string $title, string $message, array $options = []): bool
    {
        $users = User::all();
        $options['target_audience'] = ['all'];
        return $this->sendToUsers($users, $title, $message, $options);
    }

    /**
     * Send broadcast to specific user
     */
    public function toUser(User $user, string $title, string $message, array $options = []): bool
    {
        $options['target_audience'] = ['custom'];
        $options['user_ids'] = [$user->id];
        return $this->sendToUsers([$user], $title, $message, $options);
    }

    /**
     * Send broadcast to multiple users
     */
    public function toUsers($users, string $title, string $message, array $options = []): bool
    {
        // If users is a collection or array, convert to array
        if ($users instanceof \Illuminate\Database\Eloquent\Collection) {
            $userIds = $users->pluck('id')->toArray();
            $users = $users->toArray();
        } else if (is_array($users)) {
            $userIds = array_column($users, 'id');
        } else {
            $users = [$users];
            $userIds = [$users[0]->id ?? null];
        }

        $options['target_audience'] = ['custom'];
        $options['user_ids'] = $userIds;

        return $this->sendToUsers($users, $title, $message, $options);
    }

    /**
     * Send broadcast to filtered users
     */
    public function toFiltered(array $filters, string $title, string $message, array $options = []): bool
    {
        $query = User::query();

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['created_after'])) {
            $query->where('created_at', '>=', $filters['created_after']);
        }

        if (isset($filters['created_before'])) {
            $query->where('created_at', '<=', $filters['created_before']);
        }

        if (isset($filters['has_bookings'])) {
            $query->has('bookings', '>=', $filters['has_bookings']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->get();
        return $this->sendToUsers($users, $title, $message, $options);
    }

    /**
     * Schedule a broadcast for later
     */
    public function schedule(array $targets, string $title, string $message, \DateTime $scheduledAt, array $options = []): ScheduledNotification
    {
        // Ensure targets has the correct structure
        $validatedTargets = $this->validateAndFormatTargets($targets);

        // If we have user IDs, store them in the targets
        if (isset($options['user_ids']) && !empty($options['user_ids'])) {
            $validatedTargets['user_ids'] = $options['user_ids'];
        }

        return ScheduledNotification::create([
            'type' => 'broadcast',
            'title' => $title,
            'message' => $message,
            'data' => $options,
            // 'targets' => $targets,
            'targets' => $validatedTargets,
            'scheduled_at' => $scheduledAt,
            'status' => 'pending',
            'created_by' => $this->admin->id,
        ]);
    }

    /**
     * Validate and format targets for storage
     */
    protected function validateAndFormatTargets(array $targets): array
    {
        // If it's 'all' or ['all'], return ['all']
        if (in_array('all', $targets)) {
            return ['all'];
        }

        // If it's custom with user_ids
        if (isset($targets['user_ids']) && is_array($targets['user_ids'])) {
            return [
                'custom' => true,
                'user_ids' => $targets['user_ids'],
            ];
        }

        // If it's just an array of user IDs (from the form)
        if (isset($targets[0]) && is_numeric($targets[0])) {
            return [
                'custom' => true,
                'user_ids' => $targets,
            ];
        }

        // Default to all
        return ['all'];
    }

    /**
     * Send to a collection of users
     */
    protected function sendToUsers($users, string $title, string $message, array $options = []): bool
    {
        $success = true;
        $sentCount = 0;

        // Determine the target audience type
        $targetAudience = $options['target_audience'] ?? ['all'];

        // If specific user IDs were passed, store them
        $targetUserIds = [];
        if (isset($options['user_ids']) && is_array($options['user_ids'])) {
            $targetUserIds = $options['user_ids'];
        }

        // Create the broadcast record with correct target audience
        $broadcast = Broadcast::create([
            'admin_id' => $this->admin->id,
            'title' => $title,
            'message' => $message,
            'type' => $options['type'] ?? 'info',
            'priority' => $options['priority'] ?? 'normal',
            'target_audience' => $targetAudience, // Save the actual target
            'is_active' => true,
        ]);

        // If this is a custom audience, we need to track which users were targeted
        if (isset($options['user_ids']) && is_array($options['user_ids'])) {
            // Store the target user IDs in the meta or a separate table
            // For now, we'll just attach the broadcast to the specific users
            $users = User::whereIn('id', $options['user_ids'])->get();
        }

        foreach ($users as $user) {
            try {
                // Ensure we have a User object
                if (is_array($user) && isset($user['id'])) {
                    $user = User::find($user['id']);
                }

                if (!$user) {
                    continue;
                }

                // Only attach broadcast to user if they are in the target list
                // For 'all' broadcasts, all users get it
                // For custom broadcasts, only specific users get it
                if ($targetAudience === ['all'] || in_array($user->id, $targetUserIds) || empty($targetUserIds)) {
                    // Attach broadcast to user
                    DB::table('broadcast_user')->insert([
                        'broadcast_id' => $broadcast->id,
                        'user_id' => $user->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    // Send notification with the broadcast model
                    // $user->notify(new BroadcastNotification($broadcast));
                    $sentCount++;
                }
            } catch (\Exception $e) {
                Log::error("Failed to send broadcast to user " . ($user->id ?? 'unknown') . ": " . $e->getMessage());
                $success = false;
            }
        }

        return $success && $sentCount > 0;
    }
}
