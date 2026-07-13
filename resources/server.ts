import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory lead database initialized with high-quality mock data
let leads = [
    {
        id: 'lead-1',
        fullName: 'Alex Rivera',
        company: 'Acme Corp',
        workEmail: 'alex@acme.com',
        phoneNumber: '+1 (555) 321-9876',
        companySize: '251-1000',
        industry: 'Technology',
        country: 'United States',
        message:
            'We need an advanced round-robin scheduling system integrated with our Salesforce CRM for 400 sales representatives. Would love to see a demo of this integration.',
        createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
        status: 'New',
    },
    {
        id: 'lead-2',
        fullName: 'Monica Geller',
        company: 'Healthera LLC',
        workEmail: 'monica@healthera.org',
        phoneNumber: '+1 (555) 765-4321',
        companySize: '51-250',
        industry: 'Healthcare',
        country: 'Canada',
        message:
            'Is Slotem HIPAA compliant? We are looking to schedule patient telehealth follow-ups through automated multi-host booking flows.',
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
        status: 'Contacted',
    },
    {
        id: 'lead-3',
        fullName: 'Kenji Sato',
        company: 'Nippon Finance',
        workEmail: 'sato.k@nippon-finance.co.jp',
        phoneNumber: '+81 3-5555-1234',
        companySize: '1000+',
        industry: 'Finance',
        country: 'Japan',
        message:
            'Looking for dedicated on-prem or single-tenant cloud option. Security SLAs are our top priority. We need custom contracts for 2000+ seats.',
        createdAt: new Date(Date.now() - 48 * 3600000).toISOString(), // 2 days ago
        status: 'In Progress',
    },
];

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        console.warn(
            'GEMINI_API_KEY is not defined or is placeholder. Falling back to local smart router.',
        );
        return null;
    }
    if (!aiClient) {
        try {
            aiClient = new GoogleGenAI({
                apiKey: apiKey,
                httpOptions: {
                    headers: {
                        'User-Agent': 'aistudio-build',
                    },
                },
            });
        } catch (err) {
            console.error('Failed to initialize GoogleGenAI client:', err);
            return null;
        }
    }
    return aiClient;
}

// ----------------------------------------------------
// Lead Management Endpoints
// ----------------------------------------------------

app.get('/api/leads', (req, res) => {
    res.json(leads);
});

app.post('/api/leads', (req, res) => {
    const {
        fullName,
        company,
        workEmail,
        phoneNumber,
        companySize,
        industry,
        country,
        message,
    } = req.body;

    if (!fullName || !workEmail || !company) {
        return res
            .status(400)
            .json({
                error: 'Name, Company, and Work Email are required fields.',
            });
    }

    const newLead = {
        id: `lead-${Date.now()}`,
        fullName,
        company,
        workEmail,
        phoneNumber: phoneNumber || '',
        companySize: companySize || 'Select Size',
        industry: industry || 'Select Industry',
        country: country || 'United States',
        message: message || '',
        createdAt: new Date().toISOString(),
        status: 'New' as const,
    };

    leads.unshift(newLead);
    res.status(201).json(newLead);
});

app.patch('/api/leads/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const leadIndex = leads.findIndex((l) => l.id === id);
    if (leadIndex === -1) {
        return res.status(404).json({ error: 'Lead not found.' });
    }

    const validStatuses = [
        'New',
        'Contacted',
        'In Progress',
        'Qualified',
        'Unqualified',
    ];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value.' });
    }

    leads[leadIndex] = {
        ...leads[leadIndex],
        status: status || leads[leadIndex].status,
    };

    res.json(leads[leadIndex]);
});

app.delete('/api/leads/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = leads.length;
    leads = leads.filter((l) => l.id !== id);

    if (leads.length === initialLength) {
        return res.status(404).json({ error: 'Lead not found.' });
    }

    res.json({ success: true, id });
});

// ----------------------------------------------------
// AI Chat endpoint
// ----------------------------------------------------

// Smart offline fallback response logic for the AI Assistant
function getLocalFallbackResponse(userMessage: string): string {
    const msg = userMessage.toLowerCase();

    if (msg.includes('hello') || msg.includes('hi ') || msg.includes('hey')) {
        return "Hello! I'm the Slotem Sales Assistant. I can tell you all about Slotem's enterprise scheduling capabilities, integrations, pricing, or security compliance. How can I help you today?";
    }

    if (
        msg.includes('pricing') ||
        msg.includes('cost') ||
        msg.includes('plan') ||
        msg.includes('subscription')
    ) {
        return (
            'Slotem offers flexible options for teams of all sizes:\n\n' +
            '• **Growth Plan**: $15/seat/month. Designed for expanding teams needing standard integrations, round-robin, and timezone routing.\n' +
            '• **Enterprise Plan**: Custom volume pricing. Includes tailored SLAs, custom contracts, HIPAA compliance support, single sign-on (SSO), and dedicated 24/7 success managers.\n\n' +
            'Would you like to request an enterprise demo via our main page form?'
        );
    }

    if (
        msg.includes('integration') ||
        msg.includes('integrate') ||
        msg.includes('google') ||
        msg.includes('outlook') ||
        msg.includes('salesforce') ||
        msg.includes('hubspot')
    ) {
        return (
            'Yes! Slotem integrates natively with your existing tech stack:\n\n' +
            '• **Calendars**: Full bidirectional sync with Google Calendar, Outlook/Office 365, Exchange, and iCloud Calendar.\n' +
            '• **CRMs**: Automatic lead-routing and activity logging with Salesforce, HubSpot, and Marketo.\n' +
            '• **Video**: Zoom, Google Meet, Microsoft Teams, and Webex link generation.\n\n' +
            "Our round-robin assignment ensures that hot leads are immediately dispatched to the right rep's calendar and updated inside your CRM in real time."
        );
    }

    if (
        msg.includes('security') ||
        msg.includes('hipaa') ||
        msg.includes('soc') ||
        msg.includes('privacy') ||
        msg.includes('compliance') ||
        msg.includes('gdpr')
    ) {
        return (
            'Security is our highest priority at Slotem. We are built on bank-grade infrastructure:\n\n' +
            '• **SOC 2 Type II Certified**: Rigorous auditing of all server and access protocols.\n' +
            '• **HIPAA Compliant**: Enabling healthcare operators to safely schedule patient consultations.\n' +
            '• **GDPR & CCPA Ready**: Full privacy controls and automated data erasure routines.\n' +
            '• **Single Sign-On (SSO)**: SAML, Okta, and Azure Active Directory integration.'
        );
    }

    if (
        msg.includes('round robin') ||
        msg.includes('round-robin') ||
        msg.includes('routing') ||
        msg.includes('distribution')
    ) {
        return (
            'Our intelligent routing engine handles all complex business scenarios:\n\n' +
            '• **Round-Robin**: Distributes incoming meetings equally or with weightings among team members.\n' +
            '• **Timezone Routing**: Seamlessly localizes team availability so prospects see times in their own zones.\n' +
            '• **Multi-Host (Collective)**: Requires multiple team members (e.g., Sales Engineer and Account Executive) to be free before offering a slot.'
        );
    }

    return (
        "That's an excellent question! Slotem is designed exactly to solve complex enterprise scheduling hurdles. We offer high-availability bidirectional calendar syncing, custom-weighted routing, Salesforce mapping, and premium SLA support.\n\n" +
        'To explore this feature in detail, feel free to fill out the **Request a Demo** form on our homepage and a dedicated Solutions Specialist will show you a live demo matching your workflow!'
    );
}

app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res
            .status(400)
            .json({ error: 'A valid array of messages is required.' });
    }

    const lastUserMessage = messages[messages.length - 1]?.text || '';
    const client = getAiClient();

    if (!client) {
        // Offline / Local fallback path
        const fallbackText = getLocalFallbackResponse(lastUserMessage);
        return res.json({ text: fallbackText });
    }

    try {
        const prompt = lastUserMessage;
        const systemInstruction =
            "You are an expert, professional, and friendly Enterprise Sales Specialist and Assistant for 'Slotem' (a scheduling and booking engine built for high-growth enterprises).\n" +
            "Your goal is to answer potential clients' questions clearly and professionally.\n" +
            'Include key details about Slotem when relevant:\n' +
            '- Custom bidirectional syncing with Google Calendar, Outlook, and Salesforce.\n' +
            '- Multi-host collective meetings, timezone automatic routing, and weighted round-robin lead allocation.\n' +
            '- Security features: SOC 2 Type II Certified, GDPR Compliant, and HIPAA-ready encryption.\n' +
            '- Pricing: Growth plan ($15/seat/month), Enterprise Plan (Custom bulk volume pricing with 24/7 dedicated account manager).\n' +
            "Keep responses highly professional, clean, formatting with markdown list items if listing details. Always encourage them to fill out the 'Request a Demo' form on the homepage so a solutions specialist can connect with them in under 2 hours.";

        const response = await client.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
            config: {
                systemInstruction,
                temperature: 0.7,
            },
        });

        res.json({ text: response.text });
    } catch (err: any) {
        console.error('Gemini API error:', err);
        // Graceful fallback to local answers on rate-limits, quota, or network issues
        const fallbackText = getLocalFallbackResponse(lastUserMessage);
        res.json({ text: fallbackText, error: err.message });
    }
});

// ----------------------------------------------------
// Dev Server & Production Static Asset Handling
// ----------------------------------------------------

async function startServer() {
    if (process.env.NODE_ENV !== 'production') {
        // In development mode, dynamically import and mount Vite's middleware
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    } else {
        // In production mode, serve compiled static files from dist
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();
