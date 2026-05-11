<?php

use App\Http\Controllers\Guest\BookingController;
use Illuminate\Support\Facades\Route;

Route::controller(BookingController::class)->group(function(){
    Route::get('/booking', 'index')->name('booking.index');
    Route::post('/booking', 'store')->name('booking.store');
});