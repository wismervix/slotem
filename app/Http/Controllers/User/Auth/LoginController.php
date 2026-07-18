<?php

namespace App\Http\Controllers\User\Auth;

use App\Models\LoginOtp;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Notifications\User\WelcomeNotification;

class LoginController extends Controller
{
    private function nameFromEmail(string $email): string
    {
        $name = explode('@', $email)[0];

        $name = str_replace(['.', '_', '-'], ' ', $name);

        return ucwords($name);
    }

    public function showLoginForm()
    {
        return inertia('User/Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email']
        ]);

        $otp = random_int(100000, 999999);

        LoginOtp::updateOrCreate(
            ['email' => $request->email],
            [
                'code' => $otp,
                'expires_at' => now()->addMinutes(10)
            ]
        );

        Mail::raw(
            "Your Slotem login otp is: {$otp}",
            fn($message) => $message
                ->to($request->email)
                ->subject('Your Slotem verification otp')
        );

        return back()->with([
            'otp_sent' => true
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required']
        ]);

        $otp = LoginOtp::where('email', $request->email)
            ->where('code', $request->otp)
            ->first();

        if (!$otp || $otp->expires_at->isPast()) {
            return back()->withErrors([
                'otp' => 'Invalid or expired otp.'
            ]);
        }

        $user = User::firstOrCreate(
            ['email' => $request->email],
            ['name' => $this->nameFromEmail($request->email)]
        );

        Auth::login($user);

        $request->session()->regenerate();

        /** @var User $user */
        $user = Auth::user();

        // Send welcome notification on first login
        if (!$user->hasLoggedInBefore()) {
            $user->notify(new WelcomeNotification($user));
            $user->markFirstLogin();
        }

        // Track last login
        $user->updateLastLogin();

        $otp->delete();

        return redirect()->route('user.dashboard');
        }
        
        public function logout(Request $request)
        {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('user.login');
    }
}
