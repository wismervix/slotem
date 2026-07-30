<?php

namespace App\Notifications\Admin;

use App\Models\Admin;
use App\Notifications\BaseAdminNotification;
use Carbon\Carbon;

class CopyScheduleNotification extends BaseAdminNotification
{
    public function __construct(
        protected Admin $admin,
        protected string $sourceDate,
        protected array $targetDates,
        protected array $details = []
    ) {
        $sourceFormatted = Carbon::parse($sourceDate)->format('F j, Y');
        $targetCount = count($targetDates);
        $targetSummary = $targetCount > 5
            ? "{$targetCount} dates"
            : implode(', ', array_map(fn($d) => Carbon::parse($d)->format('M j'), $targetDates));

        $this->type = 'admin_actions';
        $this->data = [
            'title' => "Schedule Copied 📋",
            'message' => "Admin {$admin->name} copied schedule from {$sourceFormatted} to {$targetSummary}.",
            'admin_id' => $admin->id,
            'admin_name' => $admin->name,
            'action' => 'copy_schedule',
            'source_date' => $sourceDate,
            'source_formatted' => $sourceFormatted,
            'target_count' => $targetCount,
            'target_dates' => $targetDates,
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
