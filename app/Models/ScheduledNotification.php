<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduledNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'message',
        'data',
        'targets',
        'scheduled_at',
        'sent_at',
        'status',
        'attempts',
        'error',
        'created_by',
    ];

    protected $casts = [
        'data' => 'array',
        'targets' => 'array',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    /**
     * Admin who created the scheduled notification.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
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

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }
}
