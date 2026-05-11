<?php

use App\Http\Controllers\User\DashboardController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'user'], function () {
    Route::controller(DashboardController::class)->group(function () {
        Route::get('/dashboard', 'index')->name('user.dashboard');
        Route::get('/login', 'login')->name('login'); //temporary
    });
});
