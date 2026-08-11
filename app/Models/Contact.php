<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'type',
        'status',
        'read_at',
        'replied_at',
        'replied_by',
        'admin_notes',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'replied_at' => 'datetime',
    ];

    public function repliedBy()
    {
        return $this->belongsTo(Admin::class, 'replied_by');
    }

    // Scopes
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Helper methods
    public function markAsRead(): void
    {
        if (!$this->read_at) {
            $this->update(['read_at' => now()]);
        }
    }

    public function markAsReplied(Admin $admin): void
    {
        $this->update([
            'status' => 'replied',
            'replied_at' => now(),
            'replied_by' => $admin->id,
        ]);
    }
}
