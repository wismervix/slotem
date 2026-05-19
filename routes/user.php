<?php

use App\Http\Controllers\User\Auth\LoginController;
use App\Http\Controllers\User\DashboardController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'user'], function () {

    // auth
    Route::controller(LoginController::class)->group(function () {
        Route::get('/login', 'showLoginForm')->name('user.login');
        Route::post('/login', 'login')->name('user.login.store');
        Route::post('/verify', 'verify')->name('user.verify');
        Route::post('/logout', 'logout')->name('user.logout');
    });

    // protected routes
    Route::middleware('auth')->controller(DashboardController::class)->group(function () {
        Route::get('/dashboard', 'index')->name('user.dashboard');
        Route::get('/bookings', 'bookings')->name('user.bookings');
        Route::get('/profile', 'profile')->name('user.profile');
        Route::get('/notifications', 'notifications')->name('user.notifications');
    });
});
