<?php

namespace App\Models;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'name',
        'icon',
        'description',
        'image',
        'image_public_id',
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
