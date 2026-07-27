<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin;
use App\Models\User;
use App\Models\Broadcast;
use App\Http\Controllers\Controller;
use App\Services\Notification\BroadcastService;
use Illuminate\Http\Request;

class BroadcastController extends Controller
{
    protected BroadcastService $broadcastService;

    public function __construct(BroadcastService $broadcastService)
    {
        $this->broadcastService = $broadcastService;
    }

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

        // return $broadcasts;

        return inertia('Admin/Broadcasts/Index', [
            'broadcasts' => $broadcasts,
        ]);
    }

    public function create()
    {
        return inertia('Admin/Broadcasts/Create', [
            'users' => User::select([
                'id',
                'name',
                'email',
            ])
                ->where('status', 'active')
                ->orderBy('name')
                ->get(),
        ]);
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
            'target_users' => ['nullable', 'array'],
            'target_users.*' => ['exists:users,id'],
            'expires_at' => ['nullable', 'date', 'after:scheduled_at'],
        ]);

        $this->broadcastService->by($admin);

        // Build the targets array
        $targets = $validated['target_audience'] ?? ['all'];
        $targetUserIds = $validated['target_users'] ?? [];

        // Handle scheduled broadcasts
        if (!empty($validated['scheduled_at'])) {
            $scheduledNotification = $this->broadcastService->schedule(
                $targets,
                $validated['title'],
                $validated['message'],
                new \DateTime($validated['scheduled_at']),
                [
                    'type' => $validated['type'],
                    'priority' => $validated['priority'],
                    'user_ids' => $targetUserIds, // Pass user IDs for scheduled broadcasts
                ]
            );

            return redirect()
                ->route('admin.broadcasts')
                ->with('success', 'Broadcast scheduled successfully for ' . date('Y-m-d H:i', strtotime($validated['scheduled_at'])));
        }

        // Send immediately
        if (in_array('all', $targets)) {
            $this->broadcastService->toAll(
                $validated['title'],
                $validated['message'],
                [
                    'type' => $validated['type'],
                    'priority' => $validated['priority'],
                ]
            );
        } elseif (in_array('custom', $targets) && !empty($targetUserIds)) {
            $users = User::whereIn('id', $targetUserIds)->get();
            $this->broadcastService->toUsers(
                $users,
                $validated['title'],
                $validated['message'],
                [
                    'type' => $validated['type'],
                    'priority' => $validated['priority'],
                    'user_ids' => $targetUserIds, // Pass user IDs
                ]
            );
        }

        return redirect()
            ->route('admin.broadcasts')
            ->with('success', 'Broadcast sent successfully.');
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
