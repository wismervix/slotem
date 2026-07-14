/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Article, Topic, FAQ } from '@/types';

export const TOPICS: Topic[] = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        description:
            'Learn the basics of setting up your Slotem account and creating your first event.',
        iconName: 'Rocket',
        colorClass:
            'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    },
    {
        id: 'managing-availability',
        title: 'Managing Availability',
        description:
            'Configure your working hours, buffers, and blackout dates with ease.',
        iconName: 'CalendarCheck',
        colorClass:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
        id: 'bookings',
        title: 'Bookings',
        description:
            'Manage your incoming appointments, cancellations, and reschedules.',
        iconName: 'Ticket',
        colorClass:
            'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
    {
        id: 'calendar',
        title: 'Calendar',
        description:
            'Connect with Google, Outlook, or iCloud to keep your schedule in sync.',
        iconName: 'Calendar',
        colorClass:
            'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
    },
    {
        id: 'payments',
        title: 'Payments',
        description:
            'Set up Stripe or PayPal to collect payments directly from your booking page.',
        iconName: 'CreditCard',
        colorClass:
            'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    },
    {
        id: 'notifications',
        title: 'Notifications',
        description:
            'Configure automated SMS and email reminders for you and your clients.',
        iconName: 'Bell',
        colorClass:
            'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    },
    {
        id: 'team-members',
        title: 'Team Members',
        description:
            'Invite colleagues and manage roles for collaborative scheduling.',
        iconName: 'Users',
        colorClass:
            'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
    },
    {
        id: 'account-settings',
        title: 'Account Settings',
        description:
            'Update your profile, billing details, and security preferences.',
        iconName: 'Settings',
        colorClass:
            'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    },
];

export const ARTICLES: Article[] = [
    {
        id: 'sync-multiple-calendars',
        title: 'How to sync multiple calendars',
        category: 'calendar',
        isFeatured: true,
        publishDate: 'Published 10 days ago',
        readTime: '4 min read',
        author: { name: 'Sarah Jenkins', role: 'Product Support Specialist' },
        content: `
# How to Sync Multiple Calendars

In Slotem, you can connect multiple calendars (such as your personal Google Calendar, your work Outlook, and an iCloud calendar) to ensure you never get double-booked. This is particularly useful if you manage different aspects of your life across separate accounts.

## Getting Started

To sync multiple calendars, follow these simple steps:

1. **Navigate to Calendar Connections**: Go to your sidebar, select **Account Settings**, and click on the **Calendar Connections** tab.
2. **Add a Calendar Account**: Click on the **+ Connect New Calendar** button.
3. **Choose your Provider**: Select your provider (Google, Outlook/Office 365, or iCloud).
4. **Authorize**: A secure pop-up window will appear asking you to log in to your account and authorize Slotem permissions.
5. **Set Calendar Rules**: Once connected, you can specify:
   - **Check for conflicts**: Select which of these calendars Slotem should look at to detect busy slots.
   - **Add to calendar**: Choose the single calendar where new Slotem bookings should be automatically added.

## Managing Conflict Calendars

You can check up to **6 different calendars** for conflicts. When a client views your booking page, Slotem instantly aggregates busy slots from all checked calendars in real-time, displaying only your true availability.

## FAQs about Calendar Sync

* **Are my calendar event details private?**
  Yes. Slotem only reads the "busy/free" status of your events. Your client will only see that you are unavailable at those times; they will never see event titles, descriptions, or guest lists.
* **How fast does the synchronization happen?**
  Synchronization is near-instantaneous (typically under 5 seconds). If you add an event on your Google Calendar app, Slotem will immediately block off that time.
`,
    },
    {
        id: 'automated-reminders',
        title: 'Setting up automated reminders',
        category: 'notifications',
        isFeatured: true,
        publishDate: 'Published 8 days ago',
        readTime: '3 min read',
        author: { name: 'Marcus Chen', role: 'Customer Success Manager' },
        content: `
# Setting up Automated Reminders

Reducing no-shows is easy with Slotem's automated reminders. You can configure SMS and email notifications to go out before and after meetings to keep your attendees engaged.

## Configuring Reminders

To customize reminders for an event type:

1. Open your **Dashboard** and go to **Event Types**.
2. Select the event type you want to edit and click **Edit**.
3. Navigate to the **Notifications & Workflows** tab.
4. Toggle on **Email Reminders** or **SMS Reminders**.

## Setting the Timing

You can schedule multiple reminders at custom offsets. For example:
- **Reminder 1**: 24 hours before the event (Email)
- **Reminder 2**: 1 hour before the event (SMS with meeting link)
- **Follow-up**: 2 hours after the event (Email requesting feedback)

## Personalizing the Templates

Slotem supports powerful dynamic variables to customize your messages:
- \`{{invitee_name}}\` — The attendee's full name.
- \`{{event_name}}\` — Name of the booking (e.g. "30 Minute Consulting").
- \`{{event_time}}\` — Date and time formatted in the attendee's timezone.
- \`{{location}}\` — Meeting location (e.g. Google Meet link, phone number, address).

### Example SMS Template:
> "Hi {{invitee_name}}, this is a friendly reminder that our meeting '{{event_name}}' is scheduled for {{event_time}}. Click here to join: {{location}}"
`,
    },
    {
        id: 'customizing-booking-url',
        title: 'Customizing your booking page URL',
        category: 'getting-started',
        isFeatured: true,
        publishDate: 'Published 12 days ago',
        readTime: '2 min read',
        author: { name: 'Sarah Jenkins', role: 'Product Support Specialist' },
        content: `
# Customizing Your Booking Page URL

A clean, brand-aligned booking link builds trust with your prospects and clients. Slotem makes it simple to customize your overall username URL and the slug of each individual meeting type.

## Changing Your Username URL

Your primary landing page is structured as \`slotem.com/your-username\`. To change this:

1. Go to your **Account Settings** and select the **Profile** tab.
2. Locate the **Booking URL** section.
3. Enter your desired slug. It can only contain lowercase letters, numbers, and hyphens (no spaces or special characters).
4. Click **Save Changes**.

*Note: Changing your username will immediately deactivate your old link. Make sure to update any links on your website, email signature, or social media bios.*

## Changing Individual Event Slugs

You can also customize the link for specific meeting types (e.g., \`slotem.com/your-username/quick-call\`):

1. Go to **Event Types** on your dashboard.
2. Click **Edit** on the desired event card.
3. In the general details, look for the **Event Link** field.
4. Input your custom slug (e.g. "quick-call", "consultation", "discovery").
5. Click **Save**.
`,
    },
    {
        id: 'stripe-payments',
        title: 'Integrating Stripe for payments',
        category: 'payments',
        isFeatured: true,
        publishDate: 'Published 15 days ago',
        readTime: '5 min read',
        author: {
            name: 'David Miller',
            role: 'Billing & Integration Specialist',
        },
        content: `
# Integrating Stripe for Payments

Say goodbye to unpaid sessions and manual invoices. By integrating Stripe with Slotem, you can require clients to pay securely by credit card, Apple Pay, or Google Pay directly when they choose a booking slot.

## Setting Up the Integration

1. Navigate to the **Integrations** tab from your side menu or go to **Browse Topics > Payments**.
2. Find the **Stripe** integration card and click **Connect**.
3. You will be redirected to Stripe's secure checkout sign-up page.
4. Log into your existing Stripe account or create a new one in minutes.
5. Grant Slotem permission to connect.
6. Once redirected back, you will see a "Connected" badge on Stripe.

## Requiring Payment for an Event

Once connected, you can add a price to any of your event types:

1. Go to **Event Types** and choose to **Edit** an event.
2. Expand the **Payment Settings** section.
3. Select **Collect payments with Stripe**.
4. Set your currency (USD, EUR, GBP, CAD, AUD, etc.) and specify the amount (e.g. $150).
5. (Optional) Customize your payment terms, refund policy text, or automatic invoice details.
6. Click **Save and Publish**.

## Refunding and Cancellations

If an appointment is cancelled:
- **Automatic cancellation rules**: You can choose whether cancellations automatically trigger a Stripe refund.
- **Manual refunds**: If auto-refund is off, you can open the booking details in your Slotem dashboard and click **Refund via Stripe** with a single click.
`,
    },
    {
        id: 'updating-team-plan-v2',
        title: 'Updating to Team Plan v2',
        category: 'team-members',
        publishDate: 'Published 2 days ago',
        readTime: '3 min read',
        author: { name: 'Elena Rostova', role: 'VP of Product' },
        content: `
# Updating to Team Plan v2

We are thrilled to launch Team Plan v2, introducing advanced routing, collective scheduling, and shared administrative controls.

## What's New in v2?

* **Round-Robin Scheduling**: Route incoming leads to the next available sales representative automatically, either based on equal distribution or custom weight ratios.
* **Collective Bookings**: Host meetings requiring multiple team members (e.g., a technical engineer AND an account executive). Slotem will only show slots where both hosts are free.
* **Unified Billing**: Pay for all team seats on a single invoice, with simplified provisioning and de-provisioning.
* **Admin Controls**: Master templates allow admins to instantly lock event guidelines, reminder rules, and brand assets across all member booking pages.

## How to Migrate

If you are an administrator of a legacy team account, you can upgrade by:
1. Clicking the **Upgrade Banner** in your Admin Dashboard.
2. Verifying your seat counts.
3. Reviewing your updated monthly subscription fee.
4. Confirming the transition. All existing member calendars, event URLs, and historic data will remain completely intact.
`,
    },
    {
        id: 'new-whatsapp-notifications',
        title: 'New: WhatsApp Notifications',
        category: 'notifications',
        publishDate: 'Published 5 days ago',
        readTime: '2 min read',
        author: { name: 'Marcus Chen', role: 'Customer Success Manager' },
        content: `
# New: WhatsApp Notifications

We are super excited to announce that Slotem now supports WhatsApp reminders for premium users! In addition to standard email and SMS, you can now deliver confirmation cards, reminders, and follow-ups directly to your clients' favorite messaging app.

## Why WhatsApp?

* **98% Open Rate**: Ensure clients see their meeting links.
* **International Friendly**: Avoid high carrier SMS fees for global clients.
* **Two-Way Actions**: Clients can reschedule or cancel directly inside the chat by replying with simple buttons.

## How to Enable WhatsApp

1. Go to **Integrations** and select **WhatsApp Notifications**.
2. Click **Enable Integration**.
3. In your **Event Types > Notifications**, toggle on **WhatsApp Reminders**.
4. Your clients will see a checkbox: *"Receive updates via WhatsApp"* on the booking form.
`,
    },
    {
        id: 'privacy-shield-compliance',
        title: 'Privacy Shield Compliance FAQ',
        category: 'account-settings',
        publishDate: 'Published 1 week ago',
        readTime: '4 min read',
        author: {
            name: 'Arthur Pendelton',
            role: 'Chief Information Security Officer',
        },
        content: `
# Privacy Shield Compliance FAQ

At Slotem, the privacy and security of your personal and scheduling data are our utmost priority. Here is everything you need to know about our compliance posture, data residency, and GDPR policies.

## Key Compliance Highlights

* **SOC 2 Type II Certified**: Audited by independent third parties to verify our strict security controls.
* **GDPR & CCPA Compliant**: We support complete data deletion (the right to be forgotten), data export, and strictly defined subprocessors.
* **Privacy Shield Core Alignment**: We align our international data transfers with EU-US data privacy frameworks.

## Where is my data hosted?

Our databases are hosted on enterprise-grade Cloud infrastructure located in secure facilities in Northern Virginia (US-East) and Frankfurt (EU-Central) for European customers, guaranteeing 99.99% uptime and low latency.

## How to sign a DPA (Data Processing Addendum)

If your enterprise requires a custom DPA:
1. Go to **Account Settings > Billing & Security**.
2. Scroll to the bottom and download our pre-signed **Slotem DPA**.
3. Fill in your corporate details, sign, and email to \`compliance@slotem.com\`.
`,
    },
];

export const FAQS: FAQ[] = [
    {
        id: 'free-tier',
        category: 'pricing',
        question: 'Can I use Slotem for free?',
        answer: 'Yes! Slotem offers a robust free tier for individual users that includes one calendar connection, unlimited booking types, and standard email notifications. For advanced features like team scheduling, SMS notifications, and Stripe payment integration, check out our pro plans.',
    },
    {
        id: 'change-timezone',
        category: 'settings',
        question: 'How do I change my timezone?',
        answer: "You can change your default timezone in Account Settings > General. Slotem also automatically detects your client's timezone when they view your booking page, ensuring everyone sees the correct time.",
    },
    {
        id: 'data-secure',
        category: 'security',
        question: 'Is my data secure?',
        answer: 'Absolutely. We use industry-standard SSL encryption for all data transfers and comply with GDPR, HIPAA-compliant practices, and SOC2 regulations. We never sell your data to third parties, and all calendar integrations operate with limited read-only conflict check credentials.',
    },
    {
        id: 'reschedule-cancel',
        category: 'bookings',
        question: 'Can attendees reschedule or cancel appointments?',
        answer: 'Yes. In every confirmation email and calendar invite, Slotem includes unique rescheduling and cancellation links. You can also define your buffer requirements (e.g. "No cancellations within 2 hours of start time") in the Event Type editor.',
    },
    {
        id: 'api-access',
        category: 'developers',
        question: 'Do you offer API access or Webhooks?',
        answer: 'Yes, our Developer and Enterprise plans include full API access and webhook alerts. You can listen for events like "booking.created", "booking.cancelled", and "booking.rescheduled" to sync seamlessly with your internal CRM or custom database.',
    },
];

export const DOCUMENTATION_CONTENT = {
    overview: `
# Welcome to the Slotem Help Center

Find help, tutorials, and deep dive documentation for setting up, managing, and maximizing your Slotem scheduling experience.

## Quick Start Path
1. **Connect your calendar**: Navigate to Account Settings > Calendar Connections to link Google or Outlook.
2. **Create an Event Type**: Set up a "30 Minute Consulting" or "Discovery Call" booking type.
3. **Configure your Availability**: Set your working hours (e.g. 9:00 AM - 5:00 PM, Mon-Fri).
4. **Share your Link**: Copy your unique link and send it to clients, or embed it on your website!

## Essential Guides
* **For Solopreneurs**: Learn how to use scheduling templates, buffers, and dynamic redirects to run your practice.
* **For Sales Teams**: Harness round-robin dispatch, collective scheduling, and CRM integrations to accelerate pipeline velocity.
* **For Recruitment**: Configure panel interviews, candidate SMS nudges, and calendar co-hosting with ease.
`,
    documentation: `
# Complete Documentation

Welcome to our structured product manuals. Browse through the core pillars of the Slotem scheduling engine.

## 🚀 Getting Started
* Account Setup & Profile Customization
* Understanding Event Types vs. One-off meetings
* Setting up your custom domain slug

## 📅 Availability Management
* Creating weekly recurring schedule templates
* Adding date overrides for holidays and vacations
* Adjusting minimum scheduling notice and booking buffers

## 💳 Billing & Payment Capture
* Connecting Stripe and PayPal
* Setting deposit amounts and full upfront payments
* Handling automated receipts, taxes, and transaction refunds

## 🔒 Security & Team Compliance
* Role-based access controls (Owner, Admin, Member, View-only)
* SSO Integration (SAML, Okta, Azure AD)
* General GDPR compliance, cookie consent, and data exports
`,
    faqs: `
# Frequently Asked Questions Directory

Can't find the answers you need? Here is a comprehensive library of general inquiries. Use the search bar above to query any keyword.

## Pricing & Billing
* **Do you have a free trial of premium features?**
  Yes, every new account starts with a 14-day free trial of our Team Plan. No credit card is required.
* **Can I cancel my subscription at any time?**
  Absolutely. You can downgrade to our free plan or close your account from the Billing tab with a single click.

## Product Mechanics
* **How does Slotem handle conflict detection?**
  Slotem queries your authorized calendar provider in real-time. If you have an existing personal appointment marked "Busy", Slotem will instantly omit that slot from your public booking page.
* **Can I embed Slotem directly into my website?**
  Yes! We offer standard responsive inline embeds, pop-up text widgets, and pop-up buttons. Simply copy the lightweight JavaScript snippet from your dashboard.
`,
    terms: `
# Terms of Service

*Last updated: July 14, 2026*

Welcome to Slotem. Please read these Terms of Service ("Terms") carefully before using our software applications, website, and scheduling services.

## 1. Acceptance of Terms
By creating a Slotem account or accessing our services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must immediately cease usage of the services.

## 2. Account Security
You are solely responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access.

## 3. Acceptable Use
You agree not to use Slotem to:
* Send spam, unsolicited meeting requests, or phishing links.
* Abuse, harass, or double-book systems in a malicious manner.
* Host fraudulent event services.

## 4. Limitation of Liability
Slotem is provided "as is" and "as available". In no event shall Slotem Inc. be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the scheduling platform.
`,
    privacy: `
# Privacy Policy

*Last updated: July 14, 2026*

At Slotem, we respect your privacy and are committed to protecting the personal data of both our hosts (users) and attendees (clients).

## 1. Data We Collect
* **Account Info**: Your name, email, avatar, and timezone.
* **Calendar Data**: We request temporary OAuth access to view "busy/free" blocks. We never store meeting descriptions or guest emails on our servers unless explicitly requested for notifications.
* **Attendee Booking Info**: Name, email, answer to custom questions, and contact details provided during booking.

## 2. How We Use Data
We use the collected data solely to:
* Generate and manage your calendar bookings.
* Deliver automated SMS, email, and WhatsApp notifications.
* Process secure payments through our authorized gateway, Stripe.

## 3. Third-Party Sharing
We never sell, rent, or trade your data. Data is shared only with vital infrastructure partners (such as database hosts, payment processors, and notification gateways) as required to perform our scheduling service.
`,
};
