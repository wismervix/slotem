import { Link, useForm } from '@inertiajs/react';
import { Mail, ArrowRight, CalendarCheck, Gauge } from 'lucide-react'; //Lock (password input icon) removed for OTP flow
import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import './login.css';

export default function UserAuth() {
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [countdown, setCountdown] = useState(600);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        otp: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 'email') {
            post(route('user.login.store'), {
                preserveScroll: true,

                onSuccess: () => {
                    setStep('otp');
                    setCountdown(600);
                },
            });
        } else {
            post(route('user.verify'), {
                preserveScroll: true,
            });
        }
    };

    useEffect(() => {
        if (step !== 'otp') return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [step]);

    useEffect(() => {
        if (
            step === 'otp' &&
            data.otp.length === 6 &&
            !processing &&
            countdown > 0
        ) {
            post(route('user.verify'), {
                preserveScroll: true,
            });
        }
    }, [data.otp, step, processing, countdown, post]);

    useEffect(() => {
        if (step === 'otp') {
            const firstInput = document.querySelector<HTMLInputElement>(
                'input[name="otp-digit"]',
            );

            firstInput?.focus();
        }
    }, [step]);

    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const maskEmail = (email: string) => {
        const [name, domain] = email.split('@');

        if (!name || !domain) return email;

        const visibleChars = name.slice(0, 2);
        const masked = '*'.repeat(Math.max(name.length - 2, 0));

        return `${visibleChars}${masked}@${domain}`;
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const otpArray = data.otp.split('');
        otpArray[index] = value;

        const newOtp = otpArray.join('');

        setData('otp', newOtp);

        if (value && index < 5) {
            const nextInput = document.querySelectorAll<HTMLInputElement>(
                'input[name="otp-digit"]',
            )[index + 1];

            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === 'Backspace' && !data.otp[index] && index > 0) {
            const prevInput = document.querySelectorAll<HTMLInputElement>(
                'input[name="otp-digit"]',
            )[index - 1];

            prevInput?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const pasted = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 6);

        if (!pasted) return;

        const chars = pasted.split('');

        // fill to 6 slots
        const otpArray = Array(6).fill('');

        chars.forEach((char, i) => {
            otpArray[i] = char;
        });

        setData('otp', otpArray.join(''));
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="pointer-events-none fixed top-0 left-0 -z-10 h-full w-full">
                <div className="absolute top-[-10%] left-[-5%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
                <div className="absolute right-[5%] bottom-[5%] h-[30%] w-[30%] rounded-full bg-secondary-container/20 blur-[100px]"></div>
            </div>

            <main className="px-margin-page py-stack-lg flex grow items-center justify-center">
                <div className="gap-gutter grid w-full max-w-7xl grid-cols-1 items-center md:grid-cols-12">
                    {/* Left Branding Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-stack-md pr-gutter hidden flex-col justify-center md:col-span-7 md:flex"
                    >
                        <div className="space-y-stack-sm">
                            <span className="font-label-sm tracking-[0.2em] text-primary uppercase">
                                Appointment Mastery
                            </span>
                            <h1 className="font-h1 max-w-md leading-tight text-on-surface">
                                Streamline your schedule with Slotem.
                            </h1>
                            <p className="font-body-lg max-w-lg text-on-surface-variant">
                                Manage your professional appointments with a
                                system designed for surgical precision and calm
                                efficiency. Join thousands of businesses
                                optimizing their time.
                            </p>
                        </div>

                        {/* Stats Snippet */}
                        <div className="pt-stack-lg gap-unit grid grid-cols-2">
                            <div className="p-stack-md rounded-xl border border-outline-variant bg-surface-container-low shadow-sm transition-transform hover:scale-[1.02]">
                                <CalendarCheck className="mb-2 h-6 w-6 text-primary" />
                                <div className="font-h3">99.9%</div>
                                <div className="font-label-sm text-secondary">
                                    Uptime Reliability
                                </div>
                            </div>
                            <div className="p-stack-md rounded-xl border border-outline-variant bg-surface-container-low shadow-sm transition-transform hover:scale-[1.02]">
                                <Gauge className="mb-2 h-6 w-6 text-primary" />
                                <div className="font-h3">2.4s</div>
                                <div className="font-label-sm text-secondary">
                                    Avg. Booking Time
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Login Card Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="col-span-1 flex justify-center md:col-span-5 md:justify-end"
                    >
                        <div className="bg-surface-container-lowest p-stack-lg w-full max-w-md rounded-xl border border-outline-variant shadow-xl">
                            <div className="mb-stack-lg text-center md:text-left">
                                <div className="font-h2 mb-1 font-bold text-primary">
                                    Slotem
                                </div>
                                <h2 className="font-h3 text-on-surface">
                                    Welcome back
                                </h2>
                                <p className="font-body-md text-on-surface-variant">
                                    Please enter your details to sign in.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-stack-md"
                            >
                                {/* Email Field */}
                                <div className="space-y-unit">
                                    <label
                                        className="font-label-sm block text-on-surface-variant"
                                        htmlFor="email"
                                    >
                                        Email Address
                                    </label>
                                    <div className="group relative">
                                        <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-on-surface-variant/60 transition-colors group-focus-within:text-primary" />
                                        <input
                                            className={`font-body-md w-full rounded-lg border bg-white py-3 pr-4 pl-10 text-on-surface transition-all placeholder:text-neutral-400 focus:outline-none dark:border-outline-variant-dark dark:text-gray-400 ${
                                                errors.email
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary'
                                            }`}
                                            id="email"
                                            name="email"
                                            disabled={step === 'otp'}
                                            placeholder="name@company.com"
                                            required
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                        />
                                    </div>

                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {step === 'otp' && (
                                    <div className="space-y-unit">
                                        <label
                                            className="font-label-sm block text-on-surface-variant"
                                            htmlFor="otp"
                                        >
                                            Verification Code
                                        </label>

                                        <div className="flex items-center justify-between gap-2">
                                            {Array.from({ length: 6 }).map(
                                                (_, index) => (
                                                    <input
                                                        key={index}
                                                        name="otp-digit"
                                                        type="text"
                                                        inputMode="numeric"
                                                        autoComplete="one-time-code"
                                                        maxLength={1}
                                                        value={
                                                            data.otp[index] ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            handleOtpChange(
                                                                index,
                                                                e.target.value,
                                                            )
                                                        }
                                                        onKeyDown={(e) =>
                                                            handleOtpKeyDown(
                                                                index,
                                                                e,
                                                            )
                                                        }
                                                        onPaste={handleOtpPaste}
                                                        className={`h-14 w-14 rounded-xl border text-center text-xl font-semibold transition-all focus:outline-none ${
                                                            errors.otp
                                                                ? 'border-red-500 focus:ring-red-500'
                                                                : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary'
                                                        }`}
                                                    />
                                                ),
                                            )}
                                        </div>

                                        {errors.otp && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.otp}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Login Button */}
                                <button
                                    className="text-on-primary font-h3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 shadow-lg transition-all hover:bg-primary-container hover:shadow-primary/20 active:scale-[0.98]"
                                    type="submit"
                                    disabled={
                                        processing ||
                                        (step === 'otp' && countdown <= 0)
                                    }
                                >
                                    <span>
                                        {processing
                                            ? step === 'email'
                                                ? 'Sending Verification Code...'
                                                : 'Verifying OTP...'
                                            : step === 'email'
                                              ? 'Send Verification Code'
                                              : 'Verify OTP'}
                                    </span>

                                    {!processing && (
                                        <ArrowRight className="h-5 w-5" />
                                    )}
                                </button>
                                {step === 'otp' && countdown <= 0 && (
                                    <>
                                        <p className="text-sm text-red-500">
                                            OTP expired. Please request a new
                                            code.
                                        </p>

                                        <button
                                            className="text-on-primary font-h3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 shadow-lg transition-all hover:bg-primary-container hover:shadow-primary/20 active:scale-[0.98]"
                                            type="button"
                                            onClick={() => {
                                                post(
                                                    route('user.login.store'),
                                                    {
                                                        preserveScroll: true,

                                                        onSuccess: () => {
                                                            setStep('otp');
                                                            setCountdown(600);
                                                            setData('otp', '');
                                                        },
                                                    },
                                                );
                                            }}
                                        >
                                            Resend Code
                                        </button>
                                    </>
                                )}
                            </form>

                            {/* Sign Up Link */}
                            <div className="mt-stack-lg pt-stack-md border-t border-outline-variant text-center">
                                <p className="font-body-md text-on-surface-variant">
                                    Seamless Identification Process
                                </p>
                                {step === 'otp' && (
                                    <div className="space-y-1">
                                        <p className="font-body-md text-sm text-green-600">
                                            Verification code sent to{' '}
                                            {maskEmail(data.email)}
                                        </p>

                                        <p
                                            className={`text-sm ${
                                                countdown < 60
                                                    ? 'text-red-500'
                                                    : 'text-on-surface-variant'
                                            }`}
                                        >
                                            Code expires in {formattedTime}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-stack-lg px-margin-page bg-surface-container-lowest w-full border-t border-outline-variant">
                <div className="gap-stack-md mx-auto flex max-w-7xl flex-col items-center justify-between md:flex-row">
                    <Link href={route('home')} className="text-center md:text-left">
                        <span className="font-h3 font-bold text-primary">
                            Slotem
                        </span>
                        <p className="font-label-sm text-secondary mt-1">
                            © 2024 Slotem Booking Systems. All rights reserved.
                        </p>
                    </Link>
                    <nav className="gap-x-gutter flex flex-wrap justify-center gap-y-2">
                        <Link
                            className="font-label-sm text-secondary transition-colors hover:text-primary"
                            href={route('privacy-policy')}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            className="font-label-sm text-secondary transition-colors hover:text-primary"
                            href={route('terms-of-service')}
                        >
                            Terms of Service
                        </Link>
                        <Link
                            className="font-label-sm text-secondary transition-colors hover:text-primary"
                            href={route('help-center')}
                        >
                            Help Center
                        </Link>
                        <Link
                            className="font-label-sm text-secondary transition-colors hover:text-primary"
                            href={route('contact-sales')}
                        >
                            Contact Sales
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
