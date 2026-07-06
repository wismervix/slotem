<?php

use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\AvailabilityController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ServicesController;
use App\Http\Controllers\Admin\TimeSlotController;
use App\Http\Controllers\Admin\UserController;
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
            Route::get('/settings', 'settings')->name('admin.settings');
            Route::put('/settings', 'updateSettings')->name('admin.settings.update');
            Route::get('/website-settings', 'websiteSettings')->name('admin.website-settings');
            Route::put('/website-settings', 'updateWebsiteSettings')->name('admin.website-settings.update');
        });

        //USER CONTROLLER
        Route::controller(UserController::class)->prefix('users')->group(function () {
            Route::get('/', 'users')->name('admin.users');
            Route::put('/{user}', 'update')->name('admin.users.update');
            Route::patch('/{user}/status', 'updateStatus')->name('admin.users.status');
            Route::get('/user-details/{user}', 'userDetails')->name('admin.users.details');
            Route::delete('/{user}', 'destroy')->name('admin.users.destroy');
        });

        //SERVICES CONTROLLER
        Route::controller(ServicesController::class)->prefix('services')->group(function () {
            Route::get('/', 'index')->name('admin.services');
            Route::post('/', 'store')->name('admin.services.store');
            Route::put('/{service}', 'update')->name('admin.services.update');
            Route::delete('/{service}', 'destroy')->name('admin.services.destroy');
        });

        //BOOKING CONTROLLER
        Route::controller(BookingController::class)->prefix('bookings')->group(function () {
            Route::get('/', 'index')->name('admin.bookings');
            Route::put('/{booking}/approve', 'approve')->name('admin.bookings.approve');
            Route::put('/{booking}/reject', 'reject')->name('admin.bookings.reject');
            Route::put('/{booking}/complete', 'complete')->name('admin.bookings.complete');
            Route::put('/{booking}/restore', 'restore')->name('admin.bookings.restore');
            Route::put('/{booking}/cancel', 'cancel')->name('admin.bookings.cancel');
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
            Route::put('/{timeSlot}', 'update')->name('admin.time-slots.update');
            Route::delete('/{timeSlot}', 'destroy')->name('admin.time-slots.destroy');

            Route::post('/bulk', 'bulkCreate')->name('admin.time-slots.bulk-create');
            Route::post('/copy', 'copySchedule')->name('admin.time-slots.copy-schedule');
        });
    });
});
