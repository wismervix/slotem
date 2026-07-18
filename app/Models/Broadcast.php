<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Broadcast extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'title',
        'message',
        'type',
        'priority',
        'target_audience',
        'scheduled_at',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'target_audience' => 'array',
        'scheduled_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * The admin who created the broadcast.
     */
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'broadcast_user')
            ->withPivot('is_read', 'read_at')
            ->withTimestamps();
    }

    /**
     * Scope active broadcasts.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope broadcasts that are currently available.
     */
    public function scopeCurrent($query)
    {
        return $query
            ->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('scheduled_at')
                    ->orWhere('scheduled_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Check whether the broadcast has expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at !== null &&
            $this->expires_at->isPast();
    }

    /**
     * Check whether the broadcast is scheduled for the future.
     */
    public function isScheduled(): bool
    {
        return $this->scheduled_at !== null &&
            $this->scheduled_at->isFuture();
    }
}
