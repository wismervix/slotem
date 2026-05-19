<?php

use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'admin'], function () {

    // auth
    Route::controller(LoginController::class)->group(function () {
        Route::get('/login', 'showLoginForm')->name('admin.login');
        Route::post('/login', 'login')->name('admin.login.store');
        Route::post('/logout', 'logout')->name('admin.logout');
    });

    Route::middleware('auth:admin')->group(function () {
        Route::controller(DashboardController::class)->group(function () {
            Route::get('/dashboard', 'index')->name('admin.dashboard');
        });
        Route::controller(BookingController::class)->group(function () {
            Route::get('/bookings', 'index')->name('admin.bookings');
            Route::get('/bookings/create', 'create')->name('admin.bookings.create');
        });
        Route::get('/availability')->name('admin.availability');
        Route::get('/settings')->name('admin.settings');
        Route::get('/profile')->name('admin.profile');
    });

});
