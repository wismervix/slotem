<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
// use App\Services\NotificationService;
use App\Http\Requests\AdminUpdateUserRequest;
use App\Notifications\Admin\AdminActionNotification;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class UserController extends Controller
{
    public function users()
    {
        // $users = User::with('bookings')->get();
        $users = User::with('bookings.service')->withCount('bookings')->get();

        return inertia('Admin/User/Users', [
            'users' => $users,
        ]);
    }

    public function userDetails(User $user)
    {
        $user->load('bookings.service', 'notifications');

        return inertia('Admin/User/UserDetails', [
            'user' => $user,
            'notifications' => $user->notifications,
        ]);
    }

    public function update(AdminUpdateUserRequest $request, User $user)
    {
        // dd($request->all());
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $oldData = $user->toArray();

        DB::transaction(function () use ($request, $user, $admin, $oldData) {

            $validated = $request->validated();

            /*
        |--------------------------------------------------------------------------
        | Avatar Upload
        |--------------------------------------------------------------------------
        */

            if ($request->hasFile('avatar_url')) {

                if ($user->avatar_public_id) {
                    Cloudinary::uploadApi()->destroy($user->avatar_public_id);
                }

                $uploaded = Cloudinary::uploadApi()->upload(
                    $request->file('avatar_url')->getRealPath(),
                    [
                        'folder' => 'slotem/avatars'
                    ]
                );

                $validated['avatar_url'] = $uploaded['secure_url'];
                $validated['avatar_public_id'] = $uploaded['public_id'];
            }

            /*
        |--------------------------------------------------------------------------
        | User table update
        |--------------------------------------------------------------------------
        */

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,

                'status' => $validated['status'],

                'password' => ! empty($validated['password'])
                    ? Hash::make($validated['password'])
                    : $user->password,

                'avatar_url' => $validated['avatar_url']
                    ?? $user->avatar_url,

                'avatar_public_id' => $validated['avatar_public_id'] ?? $user->avatar_public_id,
            ]);


            // Notify admin who performed action
            $adminActionNotification = new AdminActionNotification(
                $admin,
                'Update User',
                $user->email,
                ['user_id' => $user->id, 'old' => $oldData, 'new' => $request->validated()]
            );
            $adminActionNotification->sendToAllAdmins();
        });


        return back()->with(
            'success',
            'User Profile updated successfully.'
        );
    }

    public function updateStatus(Request $request, User $user)
    {
        // dd($request->all());
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $oldStatus = $user->status;

        $validated = $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended', 'deleted'])],
        ]);

        $user->update(['status' => $validated['status']]);

        // Notify admin who performed action
        $adminActionNotification = new AdminActionNotification(
            $admin,
            'Update User Status',
            $user->email,
            ['user_id' => $user->id, 'old' => $oldStatus, 'new' => $request->validated()]
        );
        $adminActionNotification->sendToAllAdmins();

        return back()->with(
            'success',
            "User status updated to \"{$validated['status']}\"."
        );
    }

    public function destroy(User $user)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $imagePublicId = $user->avatar_public_id;

        DB::transaction(function () use ($user, $admin) {
            // Notify admin who performed action
            $adminActionNotification = new AdminActionNotification(
                $admin,
                'Delete User',
                $user->email,
            );
            $adminActionNotification->sendToAllAdmins();


            // Delete associated bookings (if you want to cascade delete)
            $user->bookings()->delete();

            // Delete user notifications
            $user->notifications()->delete();

            // Finally delete the user
            $user->delete();
        });

        // Delete avatar from Cloudinary if exists
        if ($imagePublicId) {
            Cloudinary::uploadApi()->destroy($imagePublicId);
        }

        return back()->with(
            'success',
            'User deleted successfully.'
        );
    }
}
