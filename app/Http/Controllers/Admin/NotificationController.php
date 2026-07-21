<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin;
use App\Models\AdminNotification;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        /** @var Admin $admin */
        $admin = auth()->guard('admin')->user();

        $notifications = $admin->notifications()->latest()->get();

        // return $notifications;

        return inertia('Admin/Notifications', [
            'notifications' => $notifications,
            'unreadCount' => $admin->unreadNotifications()->count(),
        ]);
    }

    public function markAsRead(string $id)
    {
        /** @var Admin $admin */
        $admin = auth()->guard('admin')->user();

        $notification = $admin->notifications()->findOrFail($id);
        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead()
    {
        /** @var Admin $admin */
        $admin = auth()->guard('admin')->user();

        $admin->unreadNotifications()->update(['read_at' => now()]);

        return back();
    }

    public function delete(string $id)
    {
        /** @var Admin $admin */
        $admin = auth()->guard('admin')->user();

        $notification = $admin->notifications()->findOrFail($id);
        $notification->delete();

        return back();
    }

    public function clearAll()
    {
        /** @var Admin $admin */
        $admin = auth()->guard('admin')->user();

        $admin->notifications()->delete();

        return back();
    }
}
