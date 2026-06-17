<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::all();

        return inertia('Admin/Bookings', [
            'bookings' => $bookings,
        ]);
    }
    public function create()
    {
        return inertia('Admin/Bookings/Create');
    }
    public function store(Request $request)
    {
        //store logic here
    }
    public function edit()
    {
        return inertia('Admin/Bookings/Edit');
    }
    public function update(Request $request)
    {
        //update logic here
    }
}
