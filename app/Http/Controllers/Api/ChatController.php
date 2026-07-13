<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    private function getLocalFallbackResponse(string $userMessage): string
    {
        $msg = strtolower($userMessage);

        if (str_contains($msg, 'hello') || str_contains($msg, 'hi ') || str_contains($msg, 'hey')) {
            return "Hello! I'm the Slotem Sales Assistant. I can tell you all about Slotem's enterprise scheduling capabilities, integrations, pricing, or security compliance. How can I help you today?";
        }

        if (
            str_contains($msg, 'pricing') || str_contains($msg, 'cost') ||
            str_contains($msg, 'plan') || str_contains($msg, 'subscription')
        ) {
            return "Slotem offers flexible options for teams of all sizes:\n\n" .
                "• **Growth Plan**: \$15/seat/month. Designed for expanding teams needing standard integrations, round-robin, and timezone routing.\n" .
                "• **Enterprise Plan**: Custom volume pricing. Includes tailored SLAs, custom contracts, HIPAA compliance support, single sign-on (SSO), and dedicated 24/7 success managers.\n\n" .
                "Would you like to request an enterprise demo via our main page form?";
        }

        if (
            str_contains($msg, 'integration') || str_contains($msg, 'integrate') ||
            str_contains($msg, 'google') || str_contains($msg, 'outlook') ||
            str_contains($msg, 'salesforce') || str_contains($msg, 'hubspot')
        ) {
            return "Yes! Slotem integrates natively with your existing tech stack:\n\n" .
                "• **Calendars**: Full bidirectional sync with Google Calendar, Outlook/Office 365, Exchange, and iCloud Calendar.\n" .
                "• **CRMs**: Automatic lead-routing and activity logging with Salesforce, HubSpot, and Marketo.\n" .
                "• **Video**: Zoom, Google Meet, Microsoft Teams, and Webex link generation.\n\n" .
                "Our round-robin assignment ensures that hot leads are immediately dispatched to the right rep's calendar and updated inside your CRM in real time.";
        }

        if (
            str_contains($msg, 'security') || str_contains($msg, 'hipaa') ||
            str_contains($msg, 'soc') || str_contains($msg, 'privacy') ||
            str_contains($msg, 'compliance') || str_contains($msg, 'gdpr')
        ) {
            return "Security is our highest priority at Slotem. We are built on bank-grade infrastructure:\n\n" .
                "• **SOC 2 Type II Certified**: Rigorous auditing of all server and access protocols.\n" .
                "• **HIPAA Compliant**: Enabling healthcare operators to safely schedule patient consultations.\n" .
                "• **GDPR & CCPA Ready**: Full privacy controls and automated data erasure routines.\n" .
                "• **Single Sign-On (SSO)**: SAML, Okta, and Azure Active Directory integration.";
        }

        if (
            str_contains($msg, 'round robin') || str_contains($msg, 'round-robin') ||
            str_contains($msg, 'routing') || str_contains($msg, 'distribution')
        ) {
            return "Our intelligent routing engine handles all complex business scenarios:\n\n" .
                "• **Round-Robin**: Distributes incoming meetings equally or with weightings among team members.\n" .
                "• **Timezone Routing**: Seamlessly localizes team availability so prospects see times in their own zones.\n" .
                "• **Multi-Host (Collective)**: Requires multiple team members (e.g., Sales Engineer and Account Executive) to be free before offering a slot.";
        }

        return "That's an excellent question! Slotem is designed exactly to solve complex enterprise scheduling hurdles. We offer high-availability bidirectional calendar syncing, custom-weighted routing, Salesforce mapping, and premium SLA support.\n\n" .
            "To explore this feature in detail, feel free to fill out the **Request a Demo** form on our homepage and a dedicated Solutions Specialist will show you a live demo matching your workflow!";
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'messages' => 'required|array',
            'messages.*.text' => 'required|string',
        ]);

        // $messages = $request->input('messages');
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
        // $apiKey = env('GEMINI_API_KEY');
        $apiKey = config('services.gemini.key');

        if ($apiKey && $apiKey !== 'MY_GEMINI_API_KEY') {
            try {
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}", [
                    'systemInstruction' => [
                        'parts' => [
                            [
                                'text' => $this->buildPrompt()
                            ]
                        ]
                    ],

                    'contents' => $contents,

                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 500,
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
                Log::error('Gemini API error: ' . $e->getMessage());
            }
        }

        // Fallback to local responses
        return response()->json([
            'text' => $this->getLocalFallbackResponse($lastUserMessage)
        ]);
    }

    private function buildPrompt(): string
    {
        return <<<PROMPT
            You are Slotem's professional Enterprise Sales Specialist.

            Your responsibilities:

            - Answer questions about Slotem's scheduling platform.
            - Be concise, friendly, and professional.
            - Use Markdown bullet lists where appropriate.
            - Never invent features that are not listed below.
            - If the customer needs more information, encourage them to submit the "Request a Demo" form.

            Slotem Features

            • Bidirectional syncing with Google Calendar, Outlook, Exchange, and Salesforce.

            • Multi-host collective meetings.

            • Automatic timezone routing.

            • Weighted round-robin lead allocation.

            • Native CRM integrations.

            Security

            • SOC 2 Type II Certified

            • HIPAA-ready

            • GDPR compliant

            Pricing

            • Growth Plan — \$15/seat/month

            • Enterprise Plan — Custom pricing with dedicated account manager.

            Always answer as a Slotem representative.
            PROMPT;
    }
}
