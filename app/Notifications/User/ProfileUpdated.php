<?php

namespace App\Notifications\User;

use App\Models\User;
use App\Notifications\BaseNotification;

class ProfileUpdated extends BaseNotification
{
    public function __construct(protected User $user, protected array $changes = [])
    {
        $this->title = 'Profile Updated ✓';
        $this->message = "Your profile information has been successfully updated.";
        $this->category = 'broadcasts';
        $this->url = route('user.profile');
        $this->data = ['changes' => $changes];
    }
}
