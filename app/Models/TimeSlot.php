<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeSlot extends Model
{
    protected $fillable = [
        'availability_id',
        'is_booked',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'is_booked' => 'boolean',
    ];

    public function availability()
    {
        return $this->belongsTo(Availability::class);
    }

    public function booking()
    {
        return $this->hasOne(Booking::class);
    }
}
