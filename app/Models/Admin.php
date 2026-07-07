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
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
