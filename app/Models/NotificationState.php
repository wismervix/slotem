<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationState extends Model
{
    protected $fillable = [
        'user_id',
        'notification_id',
        'hidden_at',
    ];
}
