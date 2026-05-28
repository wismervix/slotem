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
        return inertia('User/Profile');
    }

    public function notifications()
    {
        return inertia('User/Notifications');
    }
}
