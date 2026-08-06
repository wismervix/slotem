<?php

namespace App\Notifications\Admin;

use App\Models\Admin;
use App\Models\Contact;
use App\Notifications\BaseAdminNotification;

class NewContactNotification extends BaseAdminNotification
{
    public function __construct(protected Contact $contact)
    {
        $this->type = 'contact';
        $this->data = [
            'title' => 'New Contact Message 📩',
            'message' => "New {$contact->type} inquiry from {$contact->name} ({$contact->email}): {$contact->subject}",
            'contact_id' => $contact->id,
            'name' => $contact->name,
            'email' => $contact->email,
            'subject' => $contact->subject,
            'contact_message' => $contact->message,
            'type' => $contact->type,
            'url' => route('admin.contacts.show', $contact->id),
        ];
    }

    public function sendToAllAdmins(): void
    {
        $admins = Admin::all();
        foreach ($admins as $admin) {
            $this->send($admin);
        }
    }
}
