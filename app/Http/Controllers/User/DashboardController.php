<?php

namespace App\Http\Controllers\User;


use App\Models\User;
use App\Models\Availability;
use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;

// use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
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
        $services = Service::all();

        return inertia('User/Dashboard', [
            'bookings' => $bookings,
            'services' => $services,
            'availabilities' => $availabilities
        ]);
    }

    public function bookings()
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
            'availabilities' => $availabilities
        ]);
    }

    public function profile()
    {
        /** @var User $user */
        $user = Auth::user();

        $user->load('settings');

        return inertia('User/Profile', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar_url,
                'memberSince' => $user->created_at->format('F Y'),
                'marketingConsent' =>
                $user->settings?->marketing_consent ?? true,
                'productUpdates' =>
                $user->settings?->product_updates ?? true,
                'smsReminders' =>
                $user->settings?->sms_reminders ?? true,
                'soundEnabled' =>
                $user->settings?->sound_enabled ?? true,
            ],
        ]);
        return inertia('User/Profile');
    }

    public function notifications()
    {
        return inertia('User/Notifications');
    }
}
