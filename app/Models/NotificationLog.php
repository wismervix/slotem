<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class NotificationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'channel',
        'notifiable_type',
        'notifiable_id',
        'data',
        'meta',
        'status',
        'error',
        'sent_at',
    ];

    protected $casts = [
        'data' => 'array',
        'meta' => 'array',
        'sent_at' => 'datetime',
    ];

    /**
     * The user/admin/etc. that received the notification.
     */
    public function notifiable(): MorphTo
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('notifiable_type', User::class)
            ->where('notifiable_id', $userId);
    }

    public function scopeForAdmin($query, $adminId)
    {
        return $query->where('notifiable_type', Admin::class)
            ->where('notifiable_id', $adminId);
    }

    // Helper methods
    public function isSent(): bool
    {
        return $this->status === 'sent';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}
