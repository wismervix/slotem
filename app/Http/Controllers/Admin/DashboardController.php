<?php

namespace App\Http\Controllers\Admin;

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
        return inertia('Admin/User/Users');
    }
    public function userDetails()
    {
        return inertia('Admin/User/UserDetails');
    }
    public function settings()
    {
        return inertia('Admin/Settings');
    }
}
