<?php

namespace App\Notifications\User;

use App\Models\User;
use App\Notifications\BaseNotification;

class WelcomeNotification extends BaseNotification
{
    public function __construct(protected User $user)
    {
        $this->title = 'Welcome to Slotem! 🎉';
        $this->message = "Welcome {$user->name}! We're excited to have you on board. Start by scheduling your first booking.";
        $this->category = 'broadcasts';
        $this->url = route('user.dashboard');
        $this->data = ['user_id' => $user->id];
    }
}
