<?php

namespace App\Http\Controllers\Guest;

use Inertia\Inertia;
use App\Models\Admin;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

        try {
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
        } catch (\Exception $e) {
            Log::error('Contact form error: ' . $e->getMessage());
            return back()->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function storeContactSales(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'company' => ['required', 'string', 'max:255'],
            'company_size' => ['required', 'string', 'max:50'],
            'industry' => ['required', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string'],
            'agree_privacy' => ['required', 'boolean', 'accepted'],
        ]);

        try {
            // Build the full message with all details
            $fullMessage = "Company: {$validated['company']}\n";
            $fullMessage .= "Company Size: {$validated['company_size']}\n";
            $fullMessage .= "Industry: {$validated['industry']}\n";
            $fullMessage .= "Country: " . ($validated['country'] ?? 'Not provided') . "\n\n";
            $fullMessage .= "Message:\n" . ($validated['message'] ?? 'No message provided.');

            // Save contact
            $contact = Contact::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'subject' => $validated['subject'] ?? 'Sales Inquiry',
                'message' => $fullMessage,
                'type' => 'sales',
                'status' => 'new',
                'admin_notes' => json_encode([
                    'company' => $validated['company'],
                    'company_size' => $validated['company_size'],
                    'industry' => $validated['industry'],
                    'country' => $validated['country'] ?? null,
                ]),
            ]);

            // Send confirmation email to user
            Mail::to($contact->email)->send(new ContactConfirmationMail($contact));

            // Notify all admins
            $adminNotification = new NewContactNotification($contact);
            $adminNotification->sendToAllAdmins();

            return back()->with('success', 'Thank you for your interest! Our sales team will contact you shortly.');
        } catch (\Exception $e) {
            Log::error('Contact sales form error: ' . $e->getMessage());
            return back()->with('error', 'Something went wrong. Please try again.');
        }
    }
}
