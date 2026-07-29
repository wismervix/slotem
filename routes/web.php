<?php

// use Illuminate\Support\Facades\Route;

// Route::inertia('/', 'welcome')->name('home');

// Route::get('/login', function () {
//     // Check if the user is trying to access admin or user area
//     if (request()->is('admin/*') || request()->is('admin')) {
//         return redirect()->route('admin.login');
//     }
//     return redirect()->route('user.login');
// })->name('login');

require __DIR__.'/api.php';
require __DIR__.'/guest.php';
require __DIR__.'/user.php';
require __DIR__.'/admin.php';
