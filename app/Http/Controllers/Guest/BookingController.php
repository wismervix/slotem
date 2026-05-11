<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        return Inertia::render('Guest/Booking/Index');
    }
    public function create()
    {
        return Inertia::render('Guest/Booking/Create');
    }
    public function store(Request $request)
    {
        // Handle booking store logic
    }
}
