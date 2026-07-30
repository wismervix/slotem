<?php

namespace App\Notifications\Admin;

use App\Models\Admin;
use App\Models\Availability;
use App\Notifications\BaseAdminNotification;
use Carbon\Carbon;

class AvailabilityActionNotification extends BaseAdminNotification
{
    public function __construct(
        protected Admin $admin,
        protected string $action,
        protected Availability $availability,
        protected array $details = []
    ) {
        $date = Carbon::parse($availability->date)->format('F j, Y');
        $slotsCount = $availability->timeSlots()->count();
        $bookedSlots = $availability->timeSlots()->where('is_booked', true)->count();

        $this->type = 'admin_actions';
        $this->data = [
            'title' => "Availability {$action} 📅",
            'message' => "Admin {$admin->name} performed '{$action}' on availability for {$date}." . 
                        ($slotsCount > 0 ? " ({$slotsCount} slots, {$bookedSlots} booked)" : ''),
            'admin_id' => $admin->id,
            'admin_name' => $admin->name,
            'action' => $action,
            'date' => $availability->date,
            'formatted_date' => $date,
            'slots_count' => $slotsCount,
            'booked_slots' => $bookedSlots,
            'availability_id' => $availability->id,
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