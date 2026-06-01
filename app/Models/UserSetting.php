<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    protected $fillable = [
        'marketing_consent',
        'product_updates',
        'sms_reminders',
        'sound_enabled',
    ];

    protected $casts = [
        'marketing_consent' => 'boolean',
        'product_updates' => 'boolean',
        'sms_reminders' => 'boolean',
        'sound_enabled' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
