<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
// use App\Services\NotificationService;
use App\Http\Requests\AdminUpdateUserRequest;
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

        DB::transaction(function () use ($request, $user) {

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
        });


        return back()->with(
            'success',
            'User Profile updated successfully.'
        );
    }

    public function updateStatus(Request $request, User $user)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended', 'deleted'])],
        ]);

        $user->update(['status' => $validated['status']]);

        return back()->with(
            'success',
            "User status updated to \"{$validated['status']}\"."
        );
    }

    public function destroy(User $user)
    {
        DB::transaction(function () use ($user) {
            // Delete avatar from Cloudinary if exists
            if ($user->avatar_public_id) {
                Cloudinary::uploadApi()->destroy($user->avatar_public_id);
            }

            // Delete associated bookings (if you want to cascade delete)
            $user->bookings()->delete();

            // Delete user notifications
            $user->notifications()->delete();

            // Finally delete the user
            $user->delete();
        });

        return back()->with(
            'success',
            'User deleted successfully.'
        );
    }
}
