<?php

use App\Http\Controllers\Guest\BookingController;
use App\Http\Controllers\User\Auth\LoginController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\NotificationController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'user'], function () {

    // auth    ✅
    Route::controller(LoginController::class)->group(function () {
        Route::get('/login', 'showLoginForm')->name('user.login');
        Route::post('/login', 'login')->name('user.login.store');
        Route::post('/verify', 'verify')->name('user.verify');
        Route::post('/logout', 'logout')->name('user.logout');
    });

    // All authenticated/protected routes
    Route::middleware('auth')->group(function () {
        // DASHBOARD CONTROLLER   ✅
        Route::controller(DashboardController::class)->group(function () {
            Route::get('/dashboard', 'index')->name('user.dashboard');
            Route::get('/bookings', 'bookings')->name('user.bookings');
            Route::get('/profile', 'profile')->name('user.profile');
            Route::put('/profile', 'updateProfile')->name('user.profile.update');
        });

        Route::controller(NotificationController::class)->group(function () {
            Route::get('/notifications', 'notifications')->name('user.notifications');
            Route::patch('/notifications/{notification}/read', 'markAsRead')->name('notifications.read');
            Route::patch('/notifications/read-all', 'markAllAsRead')->name('notifications.read-all');
            Route::delete('/notifications/{notification}', 'deleteNotification')->name('notifications.delete');
            Route::delete('/notifications/clear-all', 'clearAllNotifications')->name('notifications.clear-all');
        });

        //BOOKING CONTROLLER    ✅
        Route::controller(BookingController::class)->group(function () {
            Route::post('/booking/modal', 'storeAuthenticated')->name('booking.modal.store');

            Route::patch('/bookings/{booking}/cancel', 'cancel')->name('booking.cancel');

            Route::get('/bookings/report', 'downloadReport')->name('user.bookings.report');
        });
    });
});
