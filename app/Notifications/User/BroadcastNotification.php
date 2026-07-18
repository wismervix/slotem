<?php

namespace App\Notifications\User;

use App\Models\Broadcast;
use App\Notifications\BaseNotification;

class BroadcastNotification extends BaseNotification
{
    public function __construct(protected Broadcast $broadcast)
    {
        $this->title = $broadcast->title;
        $this->message = $broadcast->message;
        $this->category = 'broadcasts';
        $this->url = route('user.notifications');
        $this->data = [
            'broadcast_id' => $broadcast->id,
            'type' => $broadcast->type,
            'priority' => $broadcast->priority,
        ];
    }
}
