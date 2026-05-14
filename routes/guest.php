<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Guest\PagesController;
use App\Http\Controllers\Guest\BookingController;

Route::controller(PagesController::class)->group(function(){
    Route::get('/', 'home')->name('home');
    Route::get('/services', 'services')->name('services');
    // Route::get('/pricing', 'pricing')->name('pricing');
    Route::get('/how-it-works', 'howItWorks')->name('how-it-works');
    Route::get('/contact-us', 'contactUs')->name('contact-us');
});

Route::controller(BookingController::class)->group(function(){
    Route::get('/booking', 'dateAndTime')->name('booking.date-time');
    Route::get('/booking/create', 'create')->name('booking.create');
    Route::post('/booking', 'store')->name('booking.store');
});