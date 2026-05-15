<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'name',
        'icon',
        'description',
        'image',
        'price',
        'variant',
        'duration',
        'active',
        'badges',
    ];

    protected $casts = [
        'badges' => 'array',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
