<?php

namespace App\Notifications\Admin;

use App\Models\Admin;
use App\Notifications\BaseAdminNotification;
use Carbon\Carbon;

class BulkAvailabilityActionNotification extends BaseAdminNotification
{
    public function __construct(
        protected Admin $admin,
        protected string $action,
        protected array $details = []
    ) {
        $dateRange = isset($details['start_date'], $details['end_date'])
            ? Carbon::parse($details['start_date'])->format('M j') . ' – ' . Carbon::parse($details['end_date'])->format('M j, Y')
            : 'multiple dates';

        $slotsCreated = $details['slots_created'] ?? 0;
        $daysAffected = $details['days_affected'] ?? 0;

        $this->type = 'admin_actions';
        $this->data = [
            'title' => "Bulk Availability {$action} 📅",
            'message' => "Admin {$admin->name} performed bulk '{$action}' on availability for {$dateRange}." .
                ($slotsCreated > 0 ? " Created {$slotsCreated} slots across {$daysAffected} days." : ''),
            'admin_id' => $admin->id,
            'admin_name' => $admin->name,
            'action' => $action,
            'date_range' => $dateRange,
            'slots_created' => $slotsCreated,
            'days_affected' => $daysAffected,
            'details' => $details,
            'url' => route('admin.availability'),
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
