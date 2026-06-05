<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Availability;
use App\Models\NotificationState;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class DashboardController extends Controller
{
    public function index(NotificationService $notificationService)
    {
        /** @var User $user */
        $user = Auth::user();

        $bookings = $user
            ->bookings()
            ->with('service')
            ->latest()
            ->get();

        $availabilities = Availability::with('timeSlots')
            ->whereDate('date', '>=', now()->toDateString())
            ->get();

        $user->load('settings');

        return inertia('User/Dashboard', [
            'bookings' => $bookings,
            'availabilities' => $availabilities,
            'name' => $user->name,

            'unreadNotificationsCount' =>
            $notificationService->getUnreadCount($user),
        ]);
    }

    public function bookings(NotificationService $notificationService)
    {
        /** @var User $user */
        $user = Auth::user();

        $bookings = $user
            ->bookings()
            ->with('service')
            ->latest()
            ->get();

        $availabilities = Availability::with('timeSlots')
            ->whereDate('date', '>=', now()->toDateString())
            ->get();

        return inertia('User/ViewBookings', [
            'bookings' => $bookings,
            'availabilities' => $availabilities,

            'unreadNotificationsCount' =>
            $notificationService->getUnreadCount($user),
        ]);
    }

    public function profile(NotificationService $notificationService)
    {
        /** @var User $user */
        $user = Auth::user();

        $user->load('settings');

        return inertia('User/Profile', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar_url' => $user->avatar_url,
                'memberSince' => $user->created_at->format('F Y'),
                'marketing_consent' => $user->settings?->marketing_consent ?? false,
                'product_updates' => $user->settings?->product_updates ?? false,
                'sms_reminders' => $user->settings?->sms_reminders ?? false,
                'sound_enabled' => $user->settings?->sound_enabled ?? false,
            ],

            'unreadNotificationsCount' =>
            $notificationService->getUnreadCount($user),
        ]);
    }

    public function updateProfile(ProfileUpdateRequest $request)
    {
        // dd($request->all());
        /** @var User $user */
        $user = Auth::user();

        DB::transaction(function () use ($request, $user) {

            $validated = $request->validated();

            /*
        |--------------------------------------------------------------------------
        | Avatar Upload
        |--------------------------------------------------------------------------
        */

            if ($request->hasFile('avatar_url')) {

                if ($user->avatar_public_id) {
                    Cloudinary::uploadApi()->destroy($user->avatar_public_id);
                }

                $uploaded = Cloudinary::uploadApi()->upload(
                    $request->file('avatar_url')->getRealPath(),
                    [
                        'folder' => 'slotem/avatars'
                    ]
                );

                $validated['avatar_url'] = $uploaded['secure_url'];
                $validated['avatar_public_id'] = $uploaded['public_id'];

            }

            /*
        |--------------------------------------------------------------------------
        | User table update
        |--------------------------------------------------------------------------
        */

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,

                'password' => ! empty($validated['password'])
                    ? Hash::make($validated['password'])
                    : $user->password,

                'avatar_url' => $validated['avatar_url']
                    ?? $user->avatar_url,

                'avatar_public_id' => $validated['avatar_public_id'] ?? $user->avatar_public_id,
            ]);

            /*
        |--------------------------------------------------------------------------
        | Settings update
        |--------------------------------------------------------------------------
        */

            $user->settings()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'marketing_consent' => $validated['marketing_consent'] ?? false,

                    'product_updates' => $validated['product_updates'] ?? false,

                    'sms_reminders' => $validated['sms_reminders'] ?? false,

                    'sound_enabled' => $validated['sound_enabled'] ?? false,
                ]
            );
        });

        return back()->with(
            'success',
            'Profile updated successfully.'
        );
    }

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
