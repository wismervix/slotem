<?php

namespace App\Notifications\User;

use App\Models\Broadcast;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class BroadcastNotification extends Notification
{
    use Queueable;

    protected $broadcast;

    public function __construct($broadcast)
    {
        // Handle both Broadcast model and array
        if ($broadcast instanceof Broadcast) {
            $this->broadcast = $broadcast;
        } else {
            // If it's an array, create a temporary object
            $this->broadcast = (object) $broadcast;
        }
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'title' => $this->broadcast->title ?? 'Broadcast Message',
            'message' => $this->broadcast->message ?? '',
            'category' => 'broadcasts',
            'type' => $this->broadcast->type ?? 'info',
            'priority' => $this->broadcast->priority ?? 'normal',
            'url' => route('user.notifications'),
            'broadcast_id' => $this->broadcast->id ?? null,
        ];
    }

    public function toArray($notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}