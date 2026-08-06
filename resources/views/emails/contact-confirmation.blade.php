<!-- resources/views/emails/contact-confirmation.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contact Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: #7c3aed;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .message-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #7c3aed;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Thank You for Contacting Slotem</h1>
    </div>
    
    <div class="content">
        <p>Dear <strong>{{ $name }}</strong>,</p>
        
        <p>Thank you for reaching out to Slotem. We have received your inquiry and our team will get back to you as soon as possible.</p>
        
        <div class="message-box">
            <h3>Your Message:</h3>
            <p><strong>Subject:</strong> {{ $subject }}</p>
            <p><strong>Message:</strong></p>
            <p>{{ $message }}</p>
        </div>
        
        <p>In the meantime, you can:</p>
        <ul>
            <li>Visit our <a href="{{ route('help-center') }}">Help Center</a> for frequently asked questions</li>
            <li>Check out our <a href="{{ route('features') }}">Features</a> to learn more about Slotem</li>
            <li>Explore our <a href="{{ route('services') }}">Services</a> to see what we offer</li>
        </ul>
        
        <p>We typically respond within 24-48 hours during business days.</p>
        
        <p>Best regards,<br>
        The Slotem Team</p>
    </div>
    
    <div class="footer">
        <p>&copy; {{ date('Y') }} Slotem Booking Systems. All rights reserved.</p>
    </div>
</body>
</html>