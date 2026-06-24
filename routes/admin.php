<?php

use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\AvailabilityController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\TimeSlotController;
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
            Route::get('/services', 'services')->name('admin.services');

            Route::get('/users', 'users')->name('admin.users');
            Route::get('/users/user-details/{user}', 'userDetails')->name('admin.users.details');

            Route::get('/profile')->name('admin.profile');
            Route::get('/settings', 'settings')->name('admin.settings');
        });

        //BOOKING CONTROLLER
        Route::controller(BookingController::class)->prefix('bookings')->group(function () {
            Route::get('/', 'index')->name('admin.bookings');
        });

        //AVAILABILITY CONTROLLER
        Route::controller(AvailabilityController::class)->prefix('availability')->group(function () {
            Route::get('/', 'availability')->name('admin.availability');

            Route::post('/', 'store')->name('admin.availability.store');
            Route::delete('/{availability}', 'destroy')->name('admin.availability.destroy');

            Route::post('/bulk', 'bulkCreate')->name('admin.availability.bulk-create');
            Route::post('/copy', 'copySchedule')->name('admin.availability.copy-schedule');
        });

        //TIME-SLOT CONTROLLER
        Route::controller(TimeSlotController::class)->prefix('time-slots')->group(function () {
            Route::post('/', 'store')->name('admin.time-slots.store');
            Route::put('/{timeSlots}', 'update')->name('admin.time-slots.update');
            Route::delete('/{timeSlots}', 'destroy')->name('admin.time-slots.destroy');

            Route::post('/bulk', 'bulkCreate')->name('admin.time-slots.bulk-create');
            Route::post('/copy', 'copySchedule')->name('admin.time-slots.copy-schedule');
        });
    });
});
