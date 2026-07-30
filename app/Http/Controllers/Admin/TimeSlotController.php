<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin;
use App\Models\TimeSlot;
use Carbon\CarbonPeriod;
use App\Models\Availability;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Services\AvailabilityService;
use App\Http\Requests\StoreTimeSlotRequest;
use App\Http\Requests\UpdateTimeSlotRequest;
use App\Notifications\Admin\BulkAvailabilityActionNotification;
use App\Notifications\Admin\TimeSlotActionNotification;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TimeSlotController extends Controller
{
    private function hasOverlap(
        int $availabilityId,
        string $startTime,
        string $endTime,
        ?int $ignoreSlotId = null
    ): bool {
        return TimeSlot::where(
            'availability_id',
            $availabilityId
        )
            ->when(
                $ignoreSlotId,
                fn($q) => $q->where('id', '!=', $ignoreSlotId)
            )
            ->where(function ($query) use (
                $startTime,
                $endTime
            ) {
                $query
                    ->where('start_time', '<', $endTime)
                    ->where('end_time', '>', $startTime);
            })
            ->exists();
    }

    public function store(StoreTimeSlotRequest $request)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $availability = Availability::firstOrCreate([
            'date' => $request->date,
        ]);

        $exists = TimeSlot::where(
            'availability_id',
            $availability->id
        )
            ->where('start_time', $request->start_time)
            ->where('end_time', $request->end_time)
            ->exists();

        if ($exists) {
            abort(422, 'This slot already exists.');
        }

        if (
            $this->hasOverlap(
                $availability->id,
                $request->start_time,
                $request->end_time,
            )
        ) {
            abort(422, 'Slot overlaps with another slot.');
        }

        $timeSlot = TimeSlot::create([
            'availability_id' => $availability->id,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'is_booked' => false,
        ]);

        // Notify admins
        $notification = new TimeSlotActionNotification(
            $admin,
            'created',
            $timeSlot
        );
        $notification->sendToAllAdmins();

        Cache::forget('availabilities');

        return back();
    }

    public function update(UpdateTimeSlotRequest $request, TimeSlot $timeSlot)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $oldStart = $timeSlot->start_time;
        $oldEnd = $timeSlot->end_time;

        if (
            $this->hasOverlap(
                $timeSlot->availability_id,
                $request->start_time,
                $request->end_time,
                $timeSlot->id
            )
        ) {
            abort(422, 'Slot overlaps with another slot.');
        }

        $timeSlot->update([
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        // Notify admins
        $notification = new TimeSlotActionNotification(
            $admin,
            'updated',
            $timeSlot,
            [
                'old_start_time' => $oldStart,
                'old_end_time' => $oldEnd,
                'new_start_time' => $request->start_time,
                'new_end_time' => $request->end_time,
            ]
        );
        $notification->sendToAllAdmins();

        Cache::forget('availabilities');

        return back();
    }


    public function destroy(TimeSlot $timeSlot)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        if ($timeSlot->is_booked) {
            abort(422, 'Cannot delete a booked slot.');
        }

        $availability = $timeSlot->availability;
        $slotDeleted = $timeSlot;

        DB::transaction(function () use ($timeSlot, $admin, $availability, $slotDeleted) {
            $timeSlot->delete();

            if ($availability->timeSlots()->count() === 0) {
                $availability->delete();
            }

            // Notify admins
            $notification = new TimeSlotActionNotification(
                $admin,
                'deleted',
                $slotDeleted
            );
            $notification->sendToAllAdmins();
        });

        Cache::forget('availabilities');

        return back();
    }

    public function bulkCreate(Request $request, AvailabilityService $availabilityService)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $period = CarbonPeriod::create(
            $request->start_date,
            $request->end_date
        );

        $daysAffected = 0;
        $slotsCreated = 0;

        DB::transaction(function () use ($period, $request, $availabilityService, &$daysAffected, &$slotsCreated) {
            foreach ($period as $date) {
                if (
                    in_array(
                        $date->format('Y-m-d'),
                        $request->closed_dates ?? []
                    )
                ) {
                    continue;
                }

                if (
                    in_array(
                        $date->dayOfWeek,
                        $request->closed_weekdays ?? []
                    )
                ) {
                    continue;
                }

                $availability = Availability::firstOrCreate([
                    'date' => $date->format('Y-m-d'),
                ]);

                $daysAffected++;

                // Generate slots and track count
                $slotsCreated += $availabilityService->generateSlots(
                    $availability,
                    $request->start_time,
                    $request->end_time
                );
            }
        });

        // Notify admins
        $notification = new BulkAvailabilityActionNotification(
            $admin,
            'created',
            [
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'days_affected' => $daysAffected,
                'slots_created' => $slotsCreated,
                'closed_dates' => $request->closed_dates ?? [],
                'closed_weekdays' => $request->closed_weekdays ?? [],
            ]
        );
        $notification->sendToAllAdmins();

        Cache::forget('availabilities');

        return back();
    }
}
