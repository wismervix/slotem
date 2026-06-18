<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return inertia('Admin/Dashboard');
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
        return inertia('Admin/Users');
    }
    public function userDetails()
    {
        return inertia('Admin/UserDetails');
    }
    public function settings()
    {
        return inertia('Admin/Settings');
    }
}
