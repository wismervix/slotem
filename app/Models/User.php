<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use App\Models\Booking;
use App\Models\UserSetting;
// use Illuminate\Database\Eloquent\Attributes\Fillable;
// use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

// #[Fillable(['name', 'email', 'password'])]
// #[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar_url',
        'avatar_public_id',
        'status',
        'first_login_at', // Add this
        'last_login_at',  // Add this
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'first_login_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function settings()
    {
        return $this->hasOne(UserSetting::class);
    }

    public function broadcasts()
    {
        return $this->belongsToMany(Broadcast::class, 'broadcast_user')
            ->withPivot('is_read', 'read_at')
            ->withTimestamps();
    }


    public function readBroadcasts()
    {
        return $this->belongsToMany(Broadcast::class, 'broadcast_user')
            ->wherePivot('is_read', true);
    }

    public function unreadBroadcasts()
    {
        return $this->belongsToMany(Broadcast::class, 'broadcast_user')
            ->wherePivot('is_read', false);
    }

    public function hasLoggedInBefore(): bool
    {
        return $this->first_login_at !== null;
    }

    public function markFirstLogin(): void
    {
        if (!$this->first_login_at) {
            $this->update(['first_login_at' => now()]);
        }
    }

    public function updateLastLogin(): void
    {
        $this->update(['last_login_at' => now()]);
    }
}
