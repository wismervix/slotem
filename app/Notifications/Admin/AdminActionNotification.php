<?php

namespace App\Notifications\Admin;

use App\Models\Admin;
use App\Notifications\BaseAdminNotification;

class AdminActionNotification extends BaseAdminNotification
{
    public function __construct(
        protected Admin $admin,
        protected string $action,
        protected string $target,
        protected array $details = []
    ) {
        $this->type = 'admin_actions';
        $this->data = [
            'title' => 'Admin Action Logged 🔔',
            'message' => "Admin {$admin->name} performed '{$action}' on {$target}.",
            'admin_id' => $admin->id,
            'admin_name' => $admin->name,
            'action' => $action,
            'target' => $target,
            'details' => $details,
            'url' => route('admin.notifications'),
        ];
    }

    public function sendToAllAdmins(): void
    {
        $admins = Admin::all();
        foreach ($admins as $admin) {
            $this->send($admin);
        }
    }
}
