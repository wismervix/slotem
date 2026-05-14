<?php

namespace App\Http\Controllers\Guest;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

class PagesController extends Controller
{
    public function home()
    {
        return Inertia::render('Guest/Home');
    }
    public function services()
    {
        return Inertia::render('Guest/Services');
    }
    public function howItWorks()
    {
        return Inertia::render('Guest/HowItWorks');
    }
    // public function pricing()
    // {
    //     return Inertia::render('Guest/Pricing');
    // }
    public function contactUs()
    {
        return Inertia::render('Guest/ContactUs');
    }
}
