<?php

namespace App\Notifications;

use App\Models\Admin;
use App\Models\AdminNotification;
use Illuminate\Bus\Queueable;
// use Illuminate\Contracts\Queue\ShouldQueue;

// class BaseAdminNotification implements ShouldQueue
class BaseAdminNotification
{
    use Queueable;

    protected string $type;
    protected array $data;
    protected Admin $admin;

    public function send(Admin $admin): void
    {
        $this->admin = $admin;

        AdminNotification::create([
            'admin_id' => $admin->id,
            'type' => $this->type,
            'data' => $this->data,
        ]);
    }
}
