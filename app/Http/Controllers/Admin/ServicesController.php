<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin;
use App\Models\Service;
use App\Http\Requests\ServiceFormRequest;
use App\Http\Controllers\Controller;
use App\Notifications\Admin\AdminActionNotification;
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
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        DB::transaction(function () use ($request, $admin) {
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
            $service = Service::create([
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

            // Notify admin who performed action
            $adminActionNotification = new AdminActionNotification(
                $admin,
                'Create Service',
                $service->name,
                $request->validated()
            );
            // $adminActionNotification->send($admin);
            $adminActionNotification->sendToAllAdmins();
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
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $oldData = $service->toArray();

        DB::transaction(function () use ($request, $service, $admin, $oldData) {
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

            // Notify admin who performed action
            $adminActionNotification = new AdminActionNotification(
                $admin,
                'Update Service',
                $service->name,
                ['old' => $oldData, 'new' => $request->validated()]
            );
            // $adminActionNotification->send($admin);
            $adminActionNotification->sendToAllAdmins();
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
        /** @var Admin $admin */
        $admin = auth('admin')->user();
        
        $imagePublicId = $service->image_public_id;

        DB::transaction(function () use ($service, $admin) {
            $adminActionNotification = new AdminActionNotification(
                $admin,
                'Delete Service',
                $service->name
            );
            // $adminActionNotification->send($admin);
            $adminActionNotification->sendToAllAdmins();


            $service->delete();
        });

        if ($imagePublicId) {
            Cloudinary::uploadApi()->destroy($imagePublicId);
        }

        Cache::forget('services');

        return back()->with(
            'success',
            'Service deleted successfully.'
        );
    }
}
