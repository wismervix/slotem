<?php

namespace App\Http\Controllers\Admin;

use App\Models\Service;
use App\Http\Requests\ServiceFormRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Cache;

class ServicesController extends Controller
{
    /**
     * Display the services management page.
     */
    public function index()
    {
        $services = Service::all();

        return inertia('Admin/Services', [
            'services' => $services,
        ]);
    }

    /**
     * Store a newly created service in storage.
     */
    public function store(ServiceFormRequest $request)
    {
        DB::transaction(function () use ($request) {
            $validated = $request->validated();

            /*
            |--------------------------------------------------------------------------
            | Image Upload to Cloudinary
            |--------------------------------------------------------------------------
            */
            if ($request->hasFile('image')) {
                $uploaded = Cloudinary::uploadApi()->upload(
                    $request->file('image')->getRealPath(),
                    [
                        'folder' => 'slotem/services'
                    ]
                );

                $validated['image'] = $uploaded['secure_url'];
                $validated['image_public_id'] = $uploaded['public_id'];
            }

            /*
            |--------------------------------------------------------------------------
            | Create Service
            |--------------------------------------------------------------------------
            */
            Service::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'icon' => $validated['icon'],
                'price' => $validated['price'],
                'variant' => $validated['variant'],
                'duration' => $validated['duration'],
                'active' => $validated['active'],
                'badges' => $validated['badges'] ?? [],
                'image' => $validated['image'] ?? null,
                'image_public_id' => $validated['image_public_id'] ?? null,
            ]);
        });

        Cache::forget('services');

        return back()->with(
            'success',
            'Service created successfully.'
        );
    }

    /**
     * Update the specified service in storage.
     */
    public function update(ServiceFormRequest $request, Service $service)
    {
        DB::transaction(function () use ($request, $service) {
            $validated = $request->validated();

            /*
            |--------------------------------------------------------------------------
            | Image Upload/Replace
            |--------------------------------------------------------------------------
            */
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($service->image_public_id) {
                    Cloudinary::uploadApi()->destroy($service->image_public_id);
                }

                $uploaded = Cloudinary::uploadApi()->upload(
                    $request->file('image')->getRealPath(),
                    [
                        'folder' => 'slotem/services'
                    ]
                );

                $validated['image'] = $uploaded['secure_url'];
                $validated['image_public_id'] = $uploaded['public_id'];
            }

            /*
            |--------------------------------------------------------------------------
            | Update Service
            |--------------------------------------------------------------------------
            */
            $service->update([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'icon' => $validated['icon'],
                'price' => $validated['price'],
                'variant' => $validated['variant'],
                'duration' => $validated['duration'],
                'active' => $validated['active'],
                'badges' => $validated['badges'] ?? [],
                'image' => $validated['image'] ?? $service->image,
                'image_public_id' => $validated['image_public_id'] ?? $service->image_public_id,
            ]);
        });

        Cache::forget('services');

        return back()->with(
            'success',
            'Service updated successfully.'
        );
    }

    /**
     * Delete the specified service from storage.
     */
    public function destroy(Service $service)
    {
        DB::transaction(function () use ($service) {
            // Delete image from Cloudinary if exists
            if ($service->image_public_id) {
                Cloudinary::uploadApi()->destroy($service->image_public_id);
            }

            // Delete the service
            $service->delete();
        });

        Cache::forget('services');

        return back()->with(
            'success',
            'Service deleted successfully.'
        );
    }
}
