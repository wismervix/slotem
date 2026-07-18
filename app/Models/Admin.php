<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'avatar_url',
        'avatar_public_id',
        'password',
        'remember_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    public function notifications()
    {
        return $this->hasMany(AdminNotification::class);
    }

    public function unreadNotifications()
    {
        return $this->hasMany(AdminNotification::class)->whereNull('read_at');
    }

    public function broadcasts()
    {
        return $this->hasMany(Broadcast::class);
    }
}
