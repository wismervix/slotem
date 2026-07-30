<?php

namespace App\Http\Controllers\Admin;

use Carbon\CarbonPeriod;
use App\Models\Admin;
use App\Models\Availability;
use App\Http\Controllers\Controller;
use App\Notifications\Admin\AvailabilityActionNotification;
use App\Notifications\Admin\BulkAvailabilityActionNotification;
use App\Notifications\Admin\CopyScheduleNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AvailabilityController extends Controller
{
    public function availability()
    {
        $availabilities = Availability::with('timeSlots')
            ->orderBy('date')
            ->get();

        return inertia('Admin/Availability', [
            'availabilities' => $availabilities,
        ]);
        // return inertia('Admin/Availability');
    }

    public function store(Request $request)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();


        $availability = Availability::firstOrCreate([
            'date' => $request->date,
        ]);

        // Notify admins
        $notification = new AvailabilityActionNotification(
            $admin,
            'created',
            $availability
        );
        $notification->sendToAllAdmins();

        Cache::forget('availabilities');

        return back();
    }

    public function destroy(Availability $availability)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        // Store data before deletion for notification
        $slotsCount = $availability->timeSlots()->count();
        $bookedSlots = $availability->timeSlots()->where('is_booked', true)->count();

        DB::transaction(function () use ($availability, $admin, $slotsCount, $bookedSlots) {
            $availability->timeSlots()->delete();
            $availability->delete();

            // Notify admins
            $notification = new AvailabilityActionNotification(
                $admin,
                'deleted',
                $availability,
                [
                    'slots_deleted' => $slotsCount,
                    'booked_slots_affected' => $bookedSlots,
                ]
            );
            $notification->sendToAllAdmins();
        });

        Cache::forget('availabilities');

        return back();
    }

    public function bulkCreate(Request $request)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $period = CarbonPeriod::create(
            $request->start_date,
            $request->end_date
        );

        $daysAffected = 0;
        $slotsCreated = 0;

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
            // generate slots here (add to $slotsCreated)
        }

        // Notify admins
        $notification = new BulkAvailabilityActionNotification(
            $admin,
            'created',
            [
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
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

    public function copySchedule(Request $request)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $request->validate([
            'source_date' => ['required', 'date'],
            'target_dates' => ['required', 'array'],
            'target_dates.*' => ['date'],
        ]);

        DB::transaction(function () use ($request, $admin) {
            $source = Availability::with('timeSlots')
                ->where('date', $request->source_date)
                ->firstOrFail();

            $targetDates = [];
            $slotsCopied = 0;

            foreach ($request->target_dates as $targetDate) {
                // Skip copying onto itself
                if ($targetDate === $request->source_date) {
                    continue;
                }

                $target = Availability::firstOrCreate([
                    'date' => $targetDate,
                ]);

                $targetDates[] = $targetDate;

                // Remove only unbooked slots
                $target->timeSlots()
                    ->where('is_booked', false)
                    ->delete();

                foreach ($source->timeSlots as $slot) {
                    $target->timeSlots()->create([
                        'start_time' => $slot->start_time,
                        'end_time' => $slot->end_time,
                        'is_booked' => false,
                    ]);
                    $slotsCopied++;
                }
            }

            // Notify admins
            $notification = new CopyScheduleNotification(
                $admin,
                $request->source_date,
                $targetDates,
                [
                    'slots_copied' => $slotsCopied,
                    'source_slots' => $source->timeSlots->count(),
                ]
            );
            $notification->sendToAllAdmins();
        });

        Cache::forget('availabilities');

        return back();
    }
}
