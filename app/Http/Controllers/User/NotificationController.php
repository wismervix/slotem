<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;

use App\Models\User;
use App\Models\NotificationState;
use Illuminate\Support\Facades\Auth;
use App\Services\NotificationService;

class NotificationController extends Controller
{

    public function notifications(NotificationService $notificationService)
    {
        /** @var User $user */
        $user = Auth::user();

        $hiddenIds = NotificationState::query()
            ->where('user_id', $user->id)
            ->whereNotNull('hidden_at')
            ->pluck('notification_id');

        $notifications = $user
            ->notifications()
            ->whereNotIn('id', $hiddenIds)
            ->latest()
            ->get();


        return inertia('User/Notifications', [
            'notifications' => $notifications,

            'unreadNotificationsCount' =>
            $notificationService->getUnreadCount($user),
        ]);
    }

    public function markAsRead(string $id)
    {
        /** @var User $user */
        $user = Auth::user();

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

        $user
            ->unreadNotifications
            ->markAsRead();

        return back();
    }

    public function deleteNotification(string $id)
    {
        /** @var User $user */
        $user = Auth::user();

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

        $notifications = $user
            ->notifications()
            ->pluck('id');

        foreach ($notifications as $notificationId) {

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

        return back();
    }
}
