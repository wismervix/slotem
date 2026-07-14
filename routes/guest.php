<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Guest\PagesController;
use App\Http\Controllers\Guest\BookingController;

Route::controller(PagesController::class)->group(function(){
    Route::get('/', 'home')->name('home');
    Route::get('/services', 'services')->name('services');
    Route::get('/features', 'features')->name('features');
    Route::get('/help-center', 'helpCenter')->name('help-center');
    Route::get('/contact-sales', 'contactSales')->name('contact-sales');
    Route::get('/privacy-policy', 'privacyPolicy')->name('privacy-policy');
    Route::get('/terms-of-service', 'termsOfService')->name('terms-of-service');
    Route::get('/contact-us', 'contactUs')->name('contact-us');
});

Route::controller(BookingController::class)->group(function(){
    Route::get('/booking', 'dateAndTime')->name('booking.date-time');
    Route::get('/booking/create', 'create')->name('booking.create');
    Route::post('/booking/confirm', 'store')->name('booking.store');
});