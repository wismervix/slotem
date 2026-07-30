<?php

namespace App\Notifications\Admin;

use App\Models\Admin;
use App\Models\TimeSlot;
use App\Notifications\BaseAdminNotification;
use Carbon\Carbon;

class TimeSlotActionNotification extends BaseAdminNotification
{
    public function __construct(
        protected Admin $admin,
        protected string $action,
        protected TimeSlot $timeSlot,
        protected array $details = []
    ) {
        $date = Carbon::parse($timeSlot->availability->date)->format('F j, Y');
        $timeRange = "{$timeSlot->start_time} – {$timeSlot->end_time}";

        $this->type = 'admin_actions';
        $this->data = [
            'title' => "Time Slot {$action} ⏰",
            'message' => "Admin {$admin->name} performed '{$action}' on time slot {$timeRange} for {$date}." .
                ($timeSlot->is_booked ? ' (Booked)' : ''),
            'admin_id' => $admin->id,
            'admin_name' => $admin->name,
            'action' => $action,
            'date' => $timeSlot->availability->date,
            'formatted_date' => $date,
            'start_time' => $timeSlot->start_time,
            'end_time' => $timeSlot->end_time,
            'time_range' => $timeRange,
            'is_booked' => $timeSlot->is_booked,
            'slot_id' => $timeSlot->id,
            'availability_id' => $timeSlot->availability_id,
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
