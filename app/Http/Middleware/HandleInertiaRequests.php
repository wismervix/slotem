<?php

namespace App\Http\Middleware;

use App\Models\Service;
use Inertia\Middleware;
use App\Models\Availability;
use Illuminate\Http\Request;
use App\Models\WebsiteSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'name' => config('app.name'),

            'auth' => [
                // 'user' => $request->user(),
                'user' => Auth::guard('web')->user(),
                'admin' => Auth::guard('admin')->user(),
            ],

            'settings' => Cache::remember(
                'website_settings',
                now()->addHour(),
                fn() => WebsiteSetting::firstOrCreate(
                    [],
                    [
                        'name' => 'Slotem',
                        'manager_name' => 'Admin Manager',
                        'email' => 'manager@slotem.com',
                        'phone' => '+1 (555) 124-7890',
                        'address' => '123 Main Street, City, State 12345',
                        'description' => 'Slotem is a modern booking platform.',
                        'website_url' => 'https://slotem.design',
                    ]
                )->toArray()
            ),

            'services' => Cache::remember(
                'services',
                now()->addHour(),
                fn() =>  Service::all()->toArray()
            ),

            'availabilities' => Cache::remember(
                'availabilities',
                now()->addHour(),
                fn() =>  Availability::with('timeSlots')
                    ->whereDate('date', '>=', now()->toDateString())
                    ->get()->toArray()
            ),
            // 'genServices' => Service::all()->toArray(),
        ];
    }
}
