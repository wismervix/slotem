<?php

namespace App\Http\Controllers\Admin;

use App\Models\Contact;
use App\Models\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $contacts = Contact::latest()->get();

        return inertia('Admin/Contacts/Index', [
            'contacts' => $contacts,
            'unreadCount' => Contact::unread()->count(),
        ]);
    }

    public function show(Contact $contact)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $contact->markAsRead();

        return inertia('Admin/Contacts/Show', [
            'contact' => $contact,
        ]);
    }

    public function markAsRead(Contact $contact)
    {
        $contact->markAsRead();
        return back();
    }

    public function markAsReplied(Request $request, Contact $contact)
    {
        /** @var Admin $admin */
        $admin = auth('admin')->user();

        $validated = $request->validate([
            'admin_notes' => ['nullable', 'string'],
        ]);

        $contact->markAsReplied($admin);

        if (!empty($validated['admin_notes'])) {
            $contact->update(['admin_notes' => $validated['admin_notes']]);
        }

        return back()->with('success', 'Contact marked as replied.');
    }

    public function archive(Contact $contact)
    {
        $contact->update(['status' => 'archived']);
        return back()->with('success', 'Contact archived.');
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return redirect()->route('admin.contacts.index')
            ->with('success', 'Contact deleted.');
    }
}
