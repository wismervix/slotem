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
    public function settings()
    {
        return inertia('Admin/Settings');
    }
    public function updateSettings()
    {
        // update settings logic
    }
    public function websiteSettings()
    {
        return inertia('Admin/WebsiteSettings');
    }
    public function updateWebsiteSettings()
    {
        // update website settings logic
    }
}
