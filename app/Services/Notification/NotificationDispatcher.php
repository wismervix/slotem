<?php

namespace App\Services\Notification;

use App\Models\User;
use App\Models\Admin;
use App\Models\NotificationLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Notifications\GenericNotification;

class NotificationDispatcher
{
    protected array $channels = ['database'];
    protected array $logData = [];
    protected string $type;

    public function __construct()
    {
        $this->logData = [
            'type' => 'system',
            'channel' => 'database',
            'notifiable_type' => User::class,
            'notifiable_id' => null,
            'data' => [],
            'meta' => [],
        ];
    }

    /**
     * Set the notification type
     */
    public function type(string $type): self
    {
        $this->logData['type'] = $type;
        return $this;
    }

    /**
     * Set the notification channels
     */
    public function channels(array $channels): self
    {
        $this->channels = $channels;
        return $this;
    }

    /**
     * Set the notifiable model
     */
    public function to($notifiable): self
    {
        $this->logData['notifiable_type'] = get_class($notifiable);
        $this->logData['notifiable_id'] = $notifiable->id;
        return $this;
    }

    /**
     * Set notification data
     */
    public function data(array $data): self
    {
        $this->logData['data'] = $data;
        return $this;
    }

    /**
     * Set meta data
     */
    public function meta(array $meta): self
    {
        $this->logData['meta'] = $meta;
        return $this;
    }

    /**
     * Send the notification
     */
    public function send(): bool
    {
        try {
            DB::transaction(function () {
                // Create log entry
                $log = NotificationLog::create($this->logData);

                // Send through each channel
                foreach ($this->channels as $channel) {
                    $this->sendThroughChannel($channel, $log);
                }

                // Update log status
                $log->update([
                    'status' => 'sent',
                    'sent_at' => now(),
                ]);
            });

            return true;
        } catch (\Exception $e) {
            Log::error('Notification dispatch failed: ' . $e->getMessage(), [
                'data' => $this->logData,
                'error' => $e->getMessage(),
            ]);

            // Log the failure
            NotificationLog::create(array_merge($this->logData, [
                'status' => 'failed',
                'error' => $e->getMessage(),
            ]));

            return false;
        }
    }

    /**
     * Send through a specific channel
     */
    protected function sendThroughChannel(string $channel, NotificationLog $log): void
    {
        $notifiable = $this->getNotifiable();

        if (!$notifiable) {
            throw new \Exception('Notifiable model not found');
        }

        switch ($channel) {
            case 'database':
                $this->sendDatabase($notifiable, $log);
                break;
            case 'email':
                $this->sendEmail($notifiable, $log);
                break;
            case 'sms':
                $this->sendSms($notifiable, $log);
                break;
            default:
                throw new \Exception("Unsupported channel: {$channel}");
        }
    }

    /**
     * Send database notification
     */
    protected function sendDatabase($notifiable, NotificationLog $log): void
    {
        // Get the notification data
        $data = $log->data;

        // Get the notification class based on type
        $notificationClass = $this->getNotificationClass();

        if ($notificationClass && class_exists($notificationClass)) {
            // For BroadcastNotification, handle the array case
            if ($notificationClass === 'App\Notifications\User\BroadcastNotification') {
                // BroadcastNotification expects an array or Broadcast model
                $notifiable->notify(new $notificationClass($data));
            } else {
                try {
                    $notifiable->notify(new $notificationClass($data));
                } catch (\TypeError $e) {
                    // Try with no arguments for notifications that expect models
                    try {
                        $notifiable->notify(new $notificationClass());
                    } catch (\TypeError $e2) {
                        $notifiable->notify(new GenericNotification($data));
                    }
                }
            }
        } else {
            // Fallback to generic notification
            $notifiable->notify(new GenericNotification($data));
        }
    }

    /**
     * Send email notification
     */
    protected function sendEmail($notifiable, NotificationLog $log): void
    {
        // TODO: Implement email sending with Mailable
        Log::info('Email notification would be sent', [
            'to' => $notifiable->email ?? 'unknown',
            'data' => $log->data,
        ]);
    }

    /**
     * Send SMS notification
     */
    protected function sendSms($notifiable, NotificationLog $log): void
    {
        // TODO: Implement SMS sending with Twilio or similar
        Log::info('SMS notification would be sent', [
            'to' => $notifiable->phone ?? 'unknown',
            'data' => $log->data,
        ]);
    }

    /**
     * Get the notifiable model
     */
    protected function getNotifiable()
    {
        $type = $this->logData['notifiable_type'];
        $id = $this->logData['notifiable_id'];

        if (!$type || !$id) {
            return null;
        }

        return $type::find($id);
    }

    /**
     * Get the notification class name
     */
    protected function getNotificationClass(): ?string
    {
        $typeMap = [
            'broadcast' => 'App\Notifications\User\BroadcastNotification',
            'booking_created' => 'App\Notifications\Booking\NewBooking',
            'booking_confirmed' => 'App\Notifications\Booking\BookingApproved',
            'booking_cancelled' => 'App\Notifications\Booking\BookingCancelled',
            'booking_completed' => 'App\Notifications\Booking\BookingCompleted',
            'booking_reminder' => 'App\Notifications\Booking\BookingReminder',
        ];

        return $typeMap[$this->logData['type']] ?? null;
    }
}
