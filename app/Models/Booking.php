<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'client_name',
        'client_email',
        'user_id',
        'service_id',
        'availability_id',
        'time_slot_id',
        'date',
        'start_time',
        'end_time',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function availability()
    {
        return $this->belongsTo(Availability::class);
    }
}
