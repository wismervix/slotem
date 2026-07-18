<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
// use Illuminate\Contracts\Queue\ShouldQueue;

abstract class BaseNotification extends Notification
{
    use Queueable;

    protected string $title;
    protected string $message;
    protected string $category = 'system';
    protected ?string $url = null;
    protected array $data = [];

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'category' => $this->category,
            'url' => $this->url,
            'data' => $this->data,
        ];
    }

    public function toArray($notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}
