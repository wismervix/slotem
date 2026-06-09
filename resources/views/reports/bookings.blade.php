<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking History Report</title>
    <style>
        @page {
            margin: 18mm 14mm 18mm;
        }

        :root {
            --surface: #ffffff;
            --surface-muted: #f8fafc;
            --border: #e5e7eb;
            --text: #111827;
            --muted: #475569;
            --primary: #2563eb;
            --success: #16a34a;
            --warning: #f59e0b;
            --danger: #dc2626;
            --danger-deep: #991b1b;
            --info: #0ea5e9;
        }

        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            color: var(--text);
            background: var(--surface);
            margin: 0;
            padding: 0;
            font-size: 11px;
            line-height: 1.4;
        }

        .page {
            width: 100%;
        }

        .header {
            border: 1px solid var(--border);
            border-radius: 14px;
            background: linear-gradient(135deg, #ffffff 0%, #eff6ff 45%, #f8fafc 100%);
            padding: 18px 18px 14px;
            margin-bottom: 14px;
        }

        .brand-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 10px;
        }

        .brand {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
            letter-spacing: 0.02em;
        }

        .tagline {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: #64748b;
            margin-top: 2px;
        }

        .meta {
            text-align: right;
            font-size: 9.5px;
            color: var(--muted);
        }

        .title {
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 4px;
        }

        .subtitle {
            color: var(--muted);
            font-size: 10px;
        }

        .summary-grid {
            display: table;
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
        }

        .summary-card {
            display: table-cell;
            width: 16.66%;
            border: 1px solid var(--border);
            border-radius: 10px;
            background: #ffffff;
            padding: 10px;
            vertical-align: top;
        }

        .summary-card+.summary-card {
            margin-left: 6px;
        }

        .summary-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #64748b;
            margin-bottom: 4px;
        }

        .summary-value {
            font-size: 16px;
            font-weight: 700;
            color: #111827;
        }

        .section-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            color: #64748b;
            margin-bottom: 6px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
            background: #ffffff;
        }

        th {
            background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
            color: #111827;
            text-align: left;
            padding: 9px 8px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
        }

        td {
            padding: 8px;
            border-top: 1px solid #edf2f7;
            font-size: 10px;
            vertical-align: top;
        }

        tr:nth-child(even) td {
            background: #f8fafc;
        }

        .service-name {
            font-weight: 700;
            color: #111827;
            margin-bottom: 2px;
        }

        .service-description {
            color: #475569;
            font-size: 9px;
        }

        .badge {
            display: inline-block;
            padding: 3px 7px;
            border-radius: 999px;
            font-size: 9px;
            font-weight: 700;
            text-transform: capitalize;
            letter-spacing: 0.03em;
        }

        .badge-approved {
            background: #dbeafe;
            color: #1d4ed8;
        }

        .badge-completed {
            background: #dcfce7;
            color: #15803d;
        }

        .badge-pending {
            background: #ffedd5;
            color: #c2410c;
        }

        .badge-cancelled {
            background: #fee2e2;
            color: #b91c1c;
        }

        .badge-rejected {
            background: #7f1d1d;
            color: #fef2f2;
        }

        .footer {
            margin-top: 14px;
            border-top: 1px solid var(--border);
            padding-top: 8px;
            color: #64748b;
            font-size: 9px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .muted {
            color: #64748b;
        }
    </style>
</head>

<body>
    <div class="page">
        <div class="header">
            <div class="brand-row">
                <div>
                    <div class="brand">Slotem Management</div>
                    <div class="tagline">Booking history report</div>
                </div>
                <div class="meta">
                    Generated: {{ \Carbon\Carbon::now()->translatedFormat('F j, Y, g:i A') }}<br />
                    User: {{ $user->name ?? 'Guest' }}
                </div>
            </div>

            <div class="title">Booking History Report</div>
            <div class="subtitle">A polished summary of all bookings for {{ $user->name ?? 'this account' }}.</div>
        </div>

        <div class="section-label">Report Summary</div>
        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-label">Total</div>
                <div class="summary-value">{{ $bookings->count() }}</div>
            </div>
            <div class="summary-card">
                <div class="summary-label">Completed</div>
                <div class="summary-value">{{ $bookings->where('status', 'completed')->count() }}</div>
            </div>
            <div class="summary-card">
                <div class="summary-label">Pending</div>
                <div class="summary-value">{{ $bookings->where('status', 'pending')->count() }}</div>
            </div>
            <div class="summary-card">
                <div class="summary-label">Approved</div>
                <div class="summary-value">{{ $bookings->where('status', 'approved')->count() }}</div>
            </div>
            <div class="summary-card">
                <div class="summary-label">Cancelled</div>
                <div class="summary-value">{{ $bookings->where('status', 'cancelled')->count() }}</div>
            </div>
            <div class="summary-card">
                <div class="summary-label">Rejected</div>
                <div class="summary-value">{{ $bookings->where('status', 'rejected')->count() }}</div>
            </div>
        </div>

        <div class="section-label">Booking Table</div>
        <table>
            <thead>
                <tr>
                    <th>Service</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($bookings as $booking)
                    <tr>
                        <td>
                            <div class="service-name">{{ $booking->service->name ?? 'Service' }}</div>
                        </td>
                        <td>
                            <div class="service-description">
                                {{ $booking->service->description ?? 'No description provided.' }}</div>
                        </td>
                        <td>{{ \Carbon\Carbon::parse($booking->date)->translatedFormat('D, M j, Y') }}</td>
                        <td>{{ \Carbon\Carbon::parse($booking->start_time)->format('g:i A') }}</td>
                        <td>
                            @php($status = strtolower((string) $booking->status))
                            <span class="badge badge-{{ $status }}">{{ ucfirst($status) }}</span>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="text-align:center; color:#64748b; padding:16px;">No bookings found for
                            this report.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <div class="footer">
            <span>Generated by Slotem Management</span>
            <span>{{ $bookings->count() }} record(s)</span>
        </div>
    </div>
</body>

</html>
