<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Models\Booking;
// use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        // $bookings = Booking::all();
        $bookings = Booking::with('service')->get();

        return inertia('Admin/Dashboard', [
            'bookings' => $bookings,
        ]);
    }
    public function availability()
    {
        return inertia('Admin/Availability');
    }
    public function services()
    {
        return inertia('Admin/Services');
    }
    public function users()
    {
        // $users = User::with('bookings')->get();
        $users = User::with('bookings.service')->withCount('bookings')->get();

        return inertia('Admin/User/Users', [
            'users' => $users,
        ]);
    }
    public function userDetails(User $user)
    {
        $user->load('bookings.service', 'notifications');

        return inertia('Admin/User/UserDetails', [
            'user' => $user,
            'notifications' => $user->notifications,
        ]);
    }
    public function settings()
    {
        return inertia('Admin/Settings');
    }
}
