<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        return inertia('Admin/Auth/Login');
    }

    public function login(Request $request)
    {
        // Login logic here
    }

    public function logout(Request $request)
    {
        // Logout logic here
    }
}
