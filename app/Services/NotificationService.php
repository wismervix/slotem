<?php

namespace App\Services;

use App\Models\NotificationState;
use App\Models\User;

class NotificationService
{
    public function getUnreadCount(User $user): int
    {
        $hiddenIds = NotificationState::query()
            ->where('user_id', $user->id)
            ->whereNotNull('hidden_at')
            ->pluck('notification_id');

        return $user
            ->unreadNotifications()
            ->whereNotIn('id', $hiddenIds)
            ->count();
    }

    public function getNotificationCounts(User $user): array
    {
        $hiddenIds = NotificationState::query()
            ->where('user_id', $user->id)
            ->whereNotNull('hidden_at')
            ->pluck('notification_id');

        $notifications = $user
            ->notifications()
            ->whereNotIn('id', $hiddenIds);

        return [
            'total' => $notifications->count(),
            'unread' => $notifications->whereNull('read_at')->count(),
        ];
    }
}
