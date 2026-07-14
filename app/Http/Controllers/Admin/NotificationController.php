<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\Admin;
use App\Models\NotificationState;
// use Illuminate\Support\Facades\Auth;
use App\Services\NotificationService;


class NotificationController extends Controller
{
    public function notifications(NotificationService $notificationService)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $hiddenIds = NotificationState::query()
        ->where('user_id', $admin->id)
        ->whereNotNull('hidden_at')
        ->pluck('notification_id');

        $notifications = $admin
        ->notifications()
        ->whereNotIn('id', $hiddenIds)
        ->latest()
        ->get();

        return inertia('Admin/Notifications', [
            'notifcations' => $notifications,

            'unreadNotificationsCount' =>
            $notificationService->getUnreadCount($admin),
        ]);
    }

    public function markAsRead(string $id)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $notification = $admin
            ->notifications()
            ->findOrFail($id);

        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead()
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $admin
            ->unreadNotifications
            ->markAsRead();

        return back();
    }

    public function deleteNotification(string $id)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        NotificationState::updateOrCreate(
            [
                'user_id' => $admin->id,
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
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $notifications = $admin
            ->notifications()
            ->pluck('id');

        foreach ($notifications as $notificationId) {

            NotificationState::updateOrCreate(
                [
                    'user_id' => $admin->id,
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
