<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;

use App\Models\User;
// use App\Models\Broadcast;
use Illuminate\Support\Facades\DB;
use App\Models\NotificationState;
use Illuminate\Support\Facades\Auth;
use App\Services\NotificationService;

class NotificationController extends Controller
{

    public function notifications(NotificationService $notificationService)
    {
        /** @var User $user */
        $user = Auth::user();

        // Get hidden notification IDs
        $hiddenIds = NotificationState::query()
            ->where('user_id', $user->id)
            ->whereNotNull('hidden_at')
            ->pluck('notification_id');

        // Get regular notifications (from notifications table)
        $regularNotifications = $user
            ->notifications()
            ->whereNotIn('id', $hiddenIds)
            ->latest()
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => 'regular',
                    'data' => $notification->data,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at,
                ];
            });

        // Get broadcast notifications (from broadcast_user table)
        $broadcastNotifications = $user
            ->broadcasts()
            ->withPivot('is_read', 'read_at')
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->latest()
            ->get()
            ->map(function ($broadcast) use ($user) {
                return [
                    'id' => 'broadcast_' . $broadcast->id,
                    'type' => 'broadcast',
                    'data' => [
                        'title' => $broadcast->title,
                        'message' => $broadcast->message,
                        'category' => 'broadcasts',
                        'type' => $broadcast->type,
                        'priority' => $broadcast->priority,
                        'broadcast_id' => $broadcast->id,
                        'url' => route('user.notifications'),
                    ],
                    'read_at' => $broadcast->pivot->is_read ? $broadcast->pivot->read_at : null,
                    'created_at' => $broadcast->created_at,
                    'pivot' => [
                        'is_read' => $broadcast->pivot->is_read,
                        'read_at' => $broadcast->pivot->read_at,
                    ],
                ];
            });

        // Merge and sort both types
        $mergedNotifications = $regularNotifications
            ->concat($broadcastNotifications)
            ->sortByDesc('created_at')
            ->values();

        // Calculate unread count (including broadcasts)
        $unreadCount = $mergedNotifications->filter(function ($notification) {
            return is_null($notification['read_at']);
        })->count();

        return inertia('User/Notifications', [
            'notifications' => $mergedNotifications,
            'unreadNotificationsCount' => $unreadCount,
        ]);
    }

    public function markAsRead(string $id)
    {
        /** @var User $user */
        $user = Auth::user();

        // Check if it's a broadcast notification
        if (str_starts_with($id, 'broadcast_')) {
            $broadcastId = str_replace('broadcast_', '', $id);

            // Update the broadcast_user pivot table
            DB::table('broadcast_user')
                ->where('user_id', $user->id)
                ->where('broadcast_id', $broadcastId)
                ->update([
                    'is_read' => true,
                    'read_at' => now(),
                ]);

            return back();
        }

        // Regular notification
        $notification = $user
            ->notifications()
            ->findOrFail($id);

        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead()
    {
        /** @var User $user */
        $user = Auth::user();

        // Mark all regular notifications as read
        $user
            ->unreadNotifications
            ->markAsRead();

        // Mark all broadcast notifications as read
        DB::table('broadcast_user')
            ->where('user_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return back();
    }

    public function deleteNotification(string $id)
    {
        /** @var User $user */
        $user = Auth::user();

        // Check if it's a broadcast notification
        if (str_starts_with($id, 'broadcast_')) {
            $broadcastId = str_replace('broadcast_', '', $id);

            // For broadcasts, we'll hide them using NotificationState
            // but we need to track them separately
            NotificationState::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'notification_id' => $id, // Store the full ID with prefix
                ],
                [
                    'hidden_at' => now(),
                ]
            );

            return back();
        }

        // Regular notification
        NotificationState::updateOrCreate(
            [
                'user_id' => $user->id,
                'notification_id' => $id,
            ],
            [
                'hidden_at' => now(),
            ]
        );

        return back();
    }

    public function clearAllNotifications()
    {
        /** @var User $user */
        $user = Auth::user();

        // Hide all regular notifications
        $regularNotifications = $user
            ->notifications()
            ->pluck('id');

        foreach ($regularNotifications as $notificationId) {
            NotificationState::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'notification_id' => $notificationId,
                ],
                [
                    'hidden_at' => now(),
                ]
            );
        }

        // Hide all broadcast notifications
        $broadcastIds = $user
            ->broadcasts()
            ->pluck('broadcasts.id');

        foreach ($broadcastIds as $broadcastId) {
            NotificationState::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'notification_id' => 'broadcast_' . $broadcastId,
                ],
                [
                    'hidden_at' => now(),
                ]
            );
        }

        return back();
    }
}
