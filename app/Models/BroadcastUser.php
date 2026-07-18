<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BroadcastUser extends Model
{
    protected $table = 'broadcast_user';

    protected $fillable = [
        'broadcast_id',
        'user_id',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function broadcast(): BelongsTo
    {
        return $this->belongsTo(Broadcasts::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
