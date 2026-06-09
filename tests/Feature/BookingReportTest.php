<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_download_booking_history_report(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->get(route('user.bookings.report'));

        $response->assertOk();
        $response->assertHeader('content-disposition', 'attachment; filename="booking-history-report.pdf"');
        $response->assertHeader('content-type', 'application/pdf');
    }
}
