<?php

namespace App\Http\Controllers\Guest;

use Inertia\Inertia;
use App\Models\Admin;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Controller;
use App\Mail\ContactConfirmationMail;
use App\Notifications\Admin\NewContactNotification;

class ContactController extends Controller
{
    public function contactUs()
    {
        return Inertia::render('Guest/ContactUs');
    }

    public function contactSales()
    {
        return Inertia::render('Guest/ContactSales');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        // Save contact
        $contact = Contact::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'type' => 'general',
            'status' => 'new',
        ]);

        // Send confirmation email to user
        Mail::to($contact->email)->send(new ContactConfirmationMail($contact));

        // Notify all admins
        $adminNotification = new NewContactNotification($contact);
        $adminNotification->sendToAllAdmins();

        return back()->with('success', 'Thank you for your message! We will get back to you soon.');
    }

    public function storeContactSales(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'company' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        // Save contact
        $contact = Contact::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'] . "\n\nCompany: " . ($validated['company'] ?? 'Not provided') . "\nPhone: " . ($validated['phone'] ?? 'Not provided'),
            'type' => 'sales',
            'status' => 'new',
        ]);

        // Send confirmation email to user
        Mail::to($contact->email)->send(new ContactConfirmationMail($contact));

        // Notify all admins
        $adminNotification = new NewContactNotification($contact);
        $adminNotification->sendToAllAdmins();

        return back()->with('success', 'Thank you for your interest! Our sales team will contact you shortly.');
    }
}
