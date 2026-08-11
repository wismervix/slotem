<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HelpCenterChatController extends Controller
{
    private function getLocalFallbackResponse(string $userMessage): string
    {
        $msg = strtolower($userMessage);

        // Welcome & Greetings
        if (str_contains($msg, 'hello') || str_contains($msg, 'hi ') || str_contains($msg, 'hey')) {
            return "Hello! I'm the **Slotem Help Center Assistant**. I'm here to help you with:\n\n" .
                "• **Getting Started** - Setting up your account and first booking\n" .
                "• **Account Management** - Profile settings, notifications, and preferences\n" .
                "• **Booking Issues** - Rescheduling, cancellations, and troubleshooting\n" .
                "• **Billing & Payments** - Subscription plans, invoices, and payment methods\n\n" .
                "How can I assist you today?";
        }

        // Account & Profile
        if (str_contains($msg, 'profile') || str_contains($msg, 'account') || str_contains($msg, 'settings')) {
            return "Here's how to manage your Slotem account:\n\n" .
                "• **Update Profile**: Go to your dashboard → Profile Settings to update your name, email, phone, and avatar.\n" .
                "• **Notification Preferences**: In Settings → Notifications, you can control email, SMS, and WhatsApp reminders.\n" .
                "• **Change Password**: Navigate to Security Settings → Change Password.\n" .
                "• **Privacy Settings**: Review and manage your privacy preferences in Privacy & Data Settings.\n\n" .
                "Is there a specific setting you're looking for?";
        }

        // Booking Help
        if (str_contains($msg, 'booking') || str_contains($msg, 'appointment') || str_contains($msg, 'schedule')) {
            if (str_contains($msg, 'cancel') || str_contains($msg, 'reschedule')) {
                return "**Cancelling or Rescheduling a Booking:**\n\n" .
                    "1. Go to your dashboard → My Bookings\n" .
                    "2. Find the booking you want to modify\n" .
                    "3. Click on the booking to open details\n" .
                    "4. Select **'Reschedule'** or **'Cancel'**\n\n" .
                    "📌 **Note:** You can only cancel or reschedule bookings that are at least 24 hours away. Same-day changes require contacting the service provider directly.\n\n" .
                    "Need help with a specific booking?";
            }

            return "**Creating and Managing Bookings:**\n\n" .
                "• **New Booking**: Go to your dashboard → Book Now. Select a service, choose an available time slot, and confirm.\n" .
                "• **View All Bookings**: Go to My Bookings to see your upcoming, past, and cancelled appointments.\n" .
                "• **Booking Status**: Track your booking status - Pending, Confirmed, Completed, or Cancelled.\n" .
                "• **Reminders**: You'll receive automated reminders 48h and 24h before your appointment.\n\n" .
                "Would you like to know more about a specific aspect of booking?";
        }

        // Billing & Payments
        if (str_contains($msg, 'billing') || str_contains($msg, 'payment') || str_contains($msg, 'invoice') || str_contains($msg, 'subscription')) {
            return "**Billing & Payment Information:**\n\n" .
                "• **Subscription Plans**: We offer Free, Pro (\$12/month), and Enterprise (custom pricing) plans.\n" .
                "• **Payment Methods**: We accept all major credit cards, debit cards, and PayPal.\n" .
                "• **Invoices**: View and download your invoices from Billing → Invoices.\n" .
                "• **Upgrade/Downgrade**: Change your plan anytime in Account Settings → Billing.\n" .
                "• **Cancel Subscription**: You can cancel your subscription at any time - no cancellation fees.\n\n" .
                "Need help with a specific billing issue?";
        }

        // Technical Support
        if (str_contains($msg, 'technical') || str_contains($msg, 'problem') || str_contains($msg, 'issue') || str_contains($msg, 'error')) {
            return "**Common Technical Issues & Solutions:**\n\n" .
                "1. **Login Issues**: Try resetting your password using the 'Forgot Password' link. If that doesn't work, clear your browser cache and cookies.\n\n" .
                "2. **Calendar Not Syncing**: Go to Settings → Calendar Connections. Disconnect and reconnect your calendar. Ensure you've granted all necessary permissions.\n\n" .
                "3. **Slow Performance**: Check your internet connection. If the issue persists, try using a different browser or incognito mode.\n\n" .
                "4. **Mobile App Issues**: Update to the latest version. If problems continue, try reinstalling the app.\n\n" .
                "If you're still experiencing issues, please submit a support ticket and our team will assist you promptly.";
        }

        // Email & Notifications
        if (str_contains($msg, 'email') || str_contains($msg, 'notification') || str_contains($msg, 'reminder')) {
            return "**Email & Notification Settings:**\n\n" .
                "• **Email Notifications**: Get booking confirmations, reminders, and updates via email.\n" .
                "• **SMS Reminders**: Enable SMS alerts for upcoming appointments (Pro & Enterprise plans).\n" .
                "• **WhatsApp Integration**: Receive instant notifications via WhatsApp (Enterprise plan).\n" .
                "• **Customize Notifications**: Go to Settings → Notifications to adjust your preferences.\n\n" .
                "You can choose which notifications you'd like to receive and how you'd like to receive them.";
        }

        // Security & Privacy
        if (str_contains($msg, 'security') || str_contains($msg, 'privacy') || str_contains($msg, 'data')) {
            return "**Security & Privacy at Slotem:**\n\n" .
                "• **Data Protection**: Your data is encrypted at rest and in transit using industry-standard TLS 1.3.\n" .
                "• **Privacy Policy**: We never sell your personal data. Review our full Privacy Policy at /privacy-policy.\n" .
                "• **Account Security**: Enable two-factor authentication (2FA) for added security.\n" .
                "• **Data Retention**: Your data is stored only as long as your account is active. Upon deletion, data is purged within 30 days.\n\n" .
                "Need more information about your data security?";
        }

        // Knowledge Base
        if (str_contains($msg, 'article') || str_contains($msg, 'guide') || str_contains($msg, 'tutorial') || str_contains($msg, 'help')) {
            return "**Accessing Help Center Resources:**\n\n" .
                "• **Articles**: Browse our comprehensive articles covering all features and common questions.\n" .
                "• **Video Tutorials**: Watch step-by-step guides on our YouTube channel (link in Help Center).\n" .
                "• **FAQs**: Quick answers to frequently asked questions.\n" .
                "• **Documentation**: Detailed technical documentation for developers and advanced users.\n\n" .
                "You can find all these resources in the Help Center sidebar. Is there a specific topic you'd like to explore?";
        }

        // Goodbye / Thanks
        if (str_contains($msg, 'thank') || str_contains($msg, 'thanks') || str_contains($msg, 'bye') || str_contains($msg, 'goodbye')) {
            return "You're welcome! I'm glad I could help. 😊\n\n" .
                "If you need further assistance:\n" .
                "• Browse our Help Center articles\n" .
                "• Submit a support ticket\n" .
                "• Contact our support team directly\n\n" .
                "Have a great day!";
        }

        // Default fallback
        return "Thank you for reaching out to the Slotem Help Center! 🤖\n\n" .
            "I can assist you with:\n" .
            "• **Account Management** - Profile settings, password, preferences\n" .
            "• **Bookings** - Creating, rescheduling, cancelling appointments\n" .
            "• **Billing** - Plans, payments, invoices, subscriptions\n" .
            "• **Technical Support** - Troubleshooting common issues\n" .
            "• **Notifications** - Email, SMS, WhatsApp reminders\n" .
            "• **Security & Privacy** - Data protection, privacy settings\n\n" .
            "For detailed guides and articles, please visit our Help Center.\n\n" .
            "If you need immediate assistance, you can also submit a support ticket. Our team typically responds within 2 hours.\n\n" .
            "What can I help you with today?";
    }

    private function buildHelpCenterPrompt(): string
    {
        return <<<PROMPT
            You are Slotem's Help Center Support Specialist.

            Your role is to provide helpful, accurate, and friendly support to Slotem users.

            **Topics you can help with:**

            1. **Account & Profile**
               - Updating name, email, phone, and avatar
               - Changing password and security settings
               - Managing notification preferences
               - Privacy settings and data requests

            2. **Bookings**
               - Creating new bookings
               - Viewing booking history
               - Rescheduling appointments
               - Cancelling bookings (must be 24h+ before appointment)
               - Understanding booking statuses

            3. **Billing & Payments**
               - Subscription plans (Free, Pro, Enterprise)
               - Payment methods (cards, PayPal)
               - Viewing and downloading invoices
               - Upgrading or downgrading plans
               - Cancelling subscriptions

            4. **Technical Support**
               - Login issues (password reset, browser issues)
               - Calendar sync problems
               - Performance issues
               - Mobile app troubleshooting

            5. **Notifications**
               - Email notifications
               - SMS reminders
               - WhatsApp integration
               - Customizing notification preferences

            6. **Security & Privacy**
               - Data protection measures
               - Privacy policy
               - Account security (2FA)
               - Data retention and deletion

            7. **Help Center Resources**
               - Articles and guides
               - Video tutorials
               - FAQs
               - Documentation

            **Response Guidelines:**
            - Be helpful, friendly, and professional
            - Use clear, concise language
            - Use bullet points for lists
            - Provide step-by-step instructions when needed
            - If you don't know something, guide them to submit a ticket
            - Don't discuss sales features or pricing unless the user asks
            - Keep responses focused on help & support

            Always respond as a Slotem Help Center Assistant.
            PROMPT;
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'messages' => 'required|array',
            'messages.*.text' => 'required|string',
        ]);

        $messages = collect($request->input('messages'))
            ->take(-20)
            ->values();

        $contents = collect($messages)
            ->map(function ($message) {
                return [
                    'role' => ($message['sender'] ?? 'user') === 'assistant'
                        ? 'model'
                        : 'user',
                    'parts' => [
                        [
                            'text' => $message['text']
                        ]
                    ]
                ];
            })
            ->values()
            ->toArray();

        $lastUserMessage = collect($messages)->last()['text'] ?? '';

        // Try Gemini API first
        $apiKey = config('services.gemini.key');

        if ($apiKey && $apiKey !== 'MY_GEMINI_API_KEY') {
            try {
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}", [
                    'systemInstruction' => [
                        'parts' => [
                            [
                                'text' => $this->buildHelpCenterPrompt()
                            ]
                        ]
                    ],

                    'contents' => $contents,

                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 1000,
                    ]
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

                    if ($text) {
                        return response()->json(['text' => $text]);
                    }
                }
            } catch (\Exception $e) {
                Log::error('Help Center Gemini API error: ' . $e->getMessage());
            }
        }

        // Fallback to local responses
        return response()->json([
            'text' => $this->getLocalFallbackResponse($lastUserMessage)
        ]);
    }
}
