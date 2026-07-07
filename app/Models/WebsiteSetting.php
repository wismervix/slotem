<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteSetting extends Model
{
    protected $fillable = [
        'name',
        'manager_name',
        'email',
        'phone',
        'address',
        'description',
        'website_url',
        'logo_url',
        'logo_public_id',
        'favicon_url',
        'favicon_public_id',
    ];
}
