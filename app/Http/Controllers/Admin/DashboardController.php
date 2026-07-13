<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin;
use App\Models\Booking;
use App\Models\WebsiteSetting;
use App\Http\Requests\AdminSettingsRequest;
use App\Http\Requests\WebsiteSettingsRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        $bookings = Booking::with('service')->get();

        return inertia('Admin/Dashboard', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Display admin settings page.
     */
    public function settings()
    {
        $admin = auth('admin')->user();

        return inertia('Admin/Settings/Settings', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone,
                'avatar_url' => $admin->avatar_url,
                'avatar_public_id' => $admin->avatar_public_id,
            ],
        ]);
    }

    /**
     * Update admin settings.
     */
    public function updateSettings(AdminSettingsRequest $request)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        DB::transaction(function () use ($request, $admin) {
            $validated = $request->validated();

            /*
            |--------------------------------------------------------------------------
            | Avatar Upload to Cloudinary
            |--------------------------------------------------------------------------
            */
            if ($request->hasFile('avatar_url')) {
                // Delete old avatar if exists
                if ($admin->avatar_public_id) {
                    try {
                        Cloudinary::uploadApi()->destroy($admin->avatar_public_id);
                    } catch (\Exception $e) {
                        // Log error but continue
                        Log::error('Failed to delete old avatar: ' . $e->getMessage());
                    }
                }

                $uploaded = Cloudinary::uploadApi()->upload(
                    $request->file('avatar_url')->getRealPath(),
                    [
                        'folder' => 'slotem/admin-avatars'
                    ]
                );

                $validated['avatar_url'] = $uploaded['secure_url'];
                $validated['avatar_public_id'] = $uploaded['public_id'];
            }

            /*
            |--------------------------------------------------------------------------
            | Update Admin Profile
            |--------------------------------------------------------------------------
            */
            $admin->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'avatar_url' => $validated['avatar_url'] ?? $admin->avatar_url,
                'avatar_public_id' => $validated['avatar_public_id'] ?? $admin->avatar_public_id,
            ]);
        });

        return back()->with('success', 'Admin settings updated successfully.');
    }

    /**
     * Display website settings page.
     */
    public function websiteSettings()
    {
        $settings = WebsiteSetting::first();

        if (!$settings) {
            // Create default settings if none exist
            $settings = WebsiteSetting::create([
                'name' => 'Slotem',
                'manager_name' => 'Admin Manager',
                'email' => 'manager@slotem.com',
                'phone' => '+1 (555) 124-7890',
                'address' => '123 Main Street, City, State 12345',
                'description' => 'Slotem is a modern booking platform.',
                'website_url' => 'https://slotem.design',
                'logo_url' => null,
                'favicon_url' => null,
            ]);
        }

        return inertia('Admin/Settings/WebsiteSettings', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update website settings.
     */
    public function updateWebsiteSettings(WebsiteSettingsRequest $request)
    {
        $settings = WebsiteSetting::first();

        if (!$settings) {
            $settings = new WebsiteSetting();
        }

        DB::transaction(function () use ($request, $settings) {
            $validated = $request->validated();

            /*
            |--------------------------------------------------------------------------
            | Logo Upload to Cloudinary
            |--------------------------------------------------------------------------
            */
            if ($request->hasFile('logo_url')) {
                // Delete old logo if exists
                if ($settings->logo_public_id) {
                    try {
                        Cloudinary::uploadApi()->destroy($settings->logo_public_id);
                    } catch (\Exception $e) {
                        Log::error('Failed to delete old logo: ' . $e->getMessage());
                    }
                }

                $uploaded = Cloudinary::uploadApi()->upload(
                    $request->file('logo_url')->getRealPath(),
                    [
                        'folder' => 'slotem/website-assets'
                    ]
                );

                $validated['logo_url'] = $uploaded['secure_url'];
                $validated['logo_public_id'] = $uploaded['public_id'];
            }

            /*
            |--------------------------------------------------------------------------
            | Favicon Upload to Cloudinary
            |--------------------------------------------------------------------------
            */
            if ($request->hasFile('favicon_url')) {
                // Delete old favicon if exists
                if ($settings->favicon_public_id) {
                    try {
                        Cloudinary::uploadApi()->destroy($settings->favicon_public_id);
                    } catch (\Exception $e) {
                        Log::error('Failed to delete old favicon: ' . $e->getMessage());
                    }
                }

                $uploaded = Cloudinary::uploadApi()->upload(
                    $request->file('favicon_url')->getRealPath(),
                    [
                        'folder' => 'slotem/website-assets'
                    ]
                );

                $validated['favicon_url'] = $uploaded['secure_url'];
                $validated['favicon_public_id'] = $uploaded['public_id'];
            }

            /*
            |--------------------------------------------------------------------------
            | Update Website Settings
            |--------------------------------------------------------------------------
            */
            $settings->fill([
                'name' => $validated['name'],
                'manager_name' => $validated['manager_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'description' => $validated['description'],
                'website_url' => $validated['website_url'],
                'logo_url' => $validated['logo_url'] ?? $settings->logo_url,
                'logo_public_id' => $validated['logo_public_id'] ?? $settings->logo_public_id,
                'favicon_url' => $validated['favicon_url'] ?? $settings->favicon_url,
                'favicon_public_id' => $validated['favicon_public_id'] ?? $settings->favicon_public_id,
            ])->save();

            Cache::forget('website_settings');
        });

        return back()->with('success', 'Website settings updated successfully.');
    }
}
