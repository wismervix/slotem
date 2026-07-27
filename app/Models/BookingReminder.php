<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingReminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'type',
        'scheduled_at',
        'sent_at',
        'status',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    /**
     * The booking this reminder belongs to.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending')
            ->where('scheduled_at', '<=', now());
    }

    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }
}
