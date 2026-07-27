<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;


Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


// Send booking reminders every 5 minutes
Schedule::command('notifications:send-reminders')
    ->everyFiveMinutes()
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/reminders.log'));

// Process scheduled notifications every minute
Schedule::command('notifications:process-scheduled')
    ->everyMinute()
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/scheduled-notifications.log'));

// Also add a health check
Schedule::command('inspire')
    ->hourly()
    ->appendOutputTo(storage_path('logs/inspire.log'));