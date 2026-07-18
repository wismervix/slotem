<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin;
use App\Models\User;
use App\Models\Broadcast;
use App\Http\Controllers\Controller;
use App\Notifications\User\BroadcastNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BroadcastController extends Controller
{
    public function index()
    {
        /** @var Admin $admin */
        $admin = auth()->guard('admin')->user();

        $broadcasts = Broadcast::with('admin')
            ->withCount(['users as read_count' => function ($query) {
                $query->where('is_read', true);
            }])
            ->latest()
            ->get();

        return inertia('Admin/Broadcasts/Index', [
            'broadcasts' => $broadcasts,
        ]);
    }

    public function create()
    {
        return inertia('Admin/Broadcasts/Create');
    }

    public function store(Request $request)
    {
        /** @var Admin $admin */
        $admin = auth()->guard('admin')->user();

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'type' => ['required', 'in:info,warning,success,alert'],
            'priority' => ['required', 'in:normal,high,urgent'],
            'target_audience' => ['nullable', 'array'],
            'scheduled_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after:scheduled_at'],
        ]);

        DB::transaction(function () use ($validated, $admin) {
            $broadcast = Broadcast::create([
                'admin_id' => $admin->id,
                'title' => $validated['title'],
                'message' => $validated['message'],
                'type' => $validated['type'],
                'priority' => $validated['priority'],
                'target_audience' => $validated['target_audience'] ?? ['all'],
                'scheduled_at' => $validated['scheduled_at'] ?? now(),
                'expires_at' => $validated['expires_at'] ?? null,
            ]);

            $this->sendBroadcast($broadcast);
        });

        return redirect()
            ->route('admin.broadcasts')
            ->with('success', 'Broadcast sent successfully.');
    }

    protected function sendBroadcast(Broadcast $broadcast)
    {
        $users = $this->getTargetUsers($broadcast->target_audience);

        foreach ($users as $user) {
            // Attach broadcast to user
            DB::table('broadcast_user')->insert([
                'broadcast_id' => $broadcast->id,
                'user_id' => $user->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Send notification
            $user->notify(new BroadcastNotification($broadcast));
        }
    }

    protected function getTargetUsers(array $target)
    {
        if (in_array('all', $target)) {
            return User::all();
        }

        if (isset($target['user_ids'])) {
            return User::whereIn('id', $target['user_ids'])->get();
        }

        return User::all();
    }

    public function show(Broadcast $broadcast)
    {
        $broadcast->load(['admin', 'users' => function ($query) {
            $query->withPivot('is_read', 'read_at');
        }]);

        return inertia('Admin/Broadcasts/Show', [
            'broadcast' => $broadcast,
        ]);
    }

    public function destroy(Broadcast $broadcast)
    {
        $broadcast->delete();

        return redirect()
            ->route('admin.broadcasts')
            ->with('success', 'Broadcast deleted successfully.');
    }
}
