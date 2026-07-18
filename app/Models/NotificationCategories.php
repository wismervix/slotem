<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NotificationCategories extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'color',
        'is_system',
    ];

    protected $casts = [
        'is_system' => 'boolean',
    ];

    // /**
    //  * Notifications that belong to this category.
    //  */
    // public function notifications()
    // {
    //     return $this->hasMany(Notification::class, 'category_id');
    // }
}
