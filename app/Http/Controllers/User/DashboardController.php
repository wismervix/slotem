<?php

namespace App\Http\Controllers\User;


use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

// use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return inertia('User/Dashboard');
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

        return inertia('User/ViewBookings', [
            'bookings' => $bookings
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
