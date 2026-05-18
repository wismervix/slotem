import { Link, router, useForm } from '@inertiajs/react';
import {
    Scissors,
    Calendar,
    Clock,
    Info,
    CheckCircle,
    SquarePen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Stepper } from '@/components/Shared/Stepper';
import GuestLayout from '@/layouts/Guest/GuestLayout';
import type { Service, TimeSlot } from '@/types';

interface CreateProps {
    service: Service;
    selectedDate: string;
    slot: TimeSlot;
}

export const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');

    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(date);
};

const Create = ({ service, selectedDate, slot }: CreateProps) => {
    const [isBooked, setIsBooked] = useState(false);
    const [booking, setBooking] = useState<any>(null);

    useEffect(() => {
        if (!service || !slot || !selectedDate) {
            router.visit(route('services'));
        }
    }, [service, slot, selectedDate]);

    const { data, setData, post, processing, errors } = useForm({
        client_name: '',
        client_email: '',
        service_id: service.id,
        time_slot_id: slot.id,
        date: selectedDate,
    });

    // const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();

    // const response = await fetch(route('booking.store'), {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         Accept: 'application/json',
    //         'X-CSRF-TOKEN':
    //             document
    //                 .querySelector('meta[name="csrf-token"]')
    //                 ?.getAttribute('content') || '',
    //     },
    //     body: JSON.stringify(data),
    // });

    // const result = await response.json();

    // if (result.success) {
    //     setBooking(result.booking);
    //     setIsBooked(true);
    // }
    // };
    const handleConfirm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // console.log('Submitting booking:', data);

        post(route('booking.store'), {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.success) {
                    setIsBooked(true);
                    setBooking(page.props.booking);
                }
            },

            onError: (errors) => {
                console.log(errors);
            },

            onFinish: () => {
                console.log('Form Submitted!', data);
            },
        });
    };

    // console.log('CreateProps: ', service, selectedDate, slot);

    return (
        <GuestLayout>
            <main className="py-24">
                {/* Stepper Section */}
                <div className="pb-8" id="stepper-section">
                    <Stepper currentStep={3} />
                </div>

                <div className="flex flex-grow items-center justify-center overflow-hidden px-6">
                    <div className="grid w-full max-w-5xl grid-cols-1 items-start gap-8 md:grid-cols-12">
                        {/* Left Column: Form */}
                        <section className="rounded-2xl border border-outline-variant bg-white p-8 shadow-sm md:col-span-7 dark:border-gray-800 dark:border-outline-variant-dark dark:bg-slate-900 dark:shadow-lg dark:shadow-white/10">
                            <div className="mb-8">
                                <h1 className="mb-2 text-3xl font-bold tracking-tight text-on-surface dark:text-on-surface-dark">
                                    Almost there
                                </h1>
                                <p className="text-base text-on-surface dark:text-on-surface-dark">
                                    Please provide your contact details to
                                    finalize the booking.
                                </p>
                            </div>

                            <form
                                className="space-y-6"
                                onSubmit={handleConfirm}
                            >
                                <div>
                                    <label
                                        className="mb-2 block text-xs font-medium tracking-wider text-on-surface uppercase dark:text-gray-100 dark:text-on-surface-dark"
                                        htmlFor="full_name"
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        className={`w-full rounded-lg border bg-white px-4 py-3 text-on-surface transition-all placeholder:text-neutral-400 focus:outline-none dark:border-outline-variant-dark dark:text-gray-400 ${
                                            errors.client_name
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                        id="full_name"
                                        value={data.client_name}
                                        onChange={(e) =>
                                            setData(
                                                'client_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter your full name"
                                        type="text"
                                        required
                                    />

                                    {errors.client_name && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.client_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        className="mb-2 block text-xs font-medium tracking-wider text-on-surface uppercase dark:text-gray-100 dark:text-on-surface-dark"
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>
                                    <input
                                        className={`w-full rounded-lg border bg-white px-4 py-3 text-on-surface transition-all placeholder:text-neutral-400 focus:outline-none dark:border-outline-variant-dark dark:text-gray-400 ${
                                            errors.client_email
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'
                                        }`}
                                        id="email"
                                        value={data.client_email}
                                        onChange={(e) =>
                                            setData(
                                                'client_email',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter your email"
                                        type="email"
                                        required
                                    />

                                    {errors.client_email && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.client_email}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-start gap-4 rounded-xl bg-surface-container p-4 dark:bg-surface-container-dark">
                                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                    <p className="text-xs leading-relaxed text-on-surface dark:text-on-surface-dark">
                                        A confirmation Email will be sent to
                                        this email 15 minutes before your
                                        appointment starts.
                                    </p>
                                </div>

                                <button
                                    className="hover:bg-primary-hover flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-primary py-4 text-lg font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                                    type="submit"
                                    disabled={processing || isBooked}
                                >
                                    {processing
                                        ? 'Confirming...'
                                        : 'Confirm Booking'}
                                    {!processing && (
                                        <CheckCircle className="h-5 w-5" />
                                    )}
                                </button>
                            </form>
                        </section>

                        {/* Right Column: Sidebar */}
                        <aside className="flex flex-col gap-4 md:col-span-5">
                            <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container/50 p-6 backdrop-blur-sm dark:border-outline-variant-dark dark:bg-surface-container-dark">
                                <div className="pointer-events-none absolute -top-4 -right-4 opacity-[0.03]">
                                    <Calendar className="h-48 w-48 rotate-12" />
                                </div>

                                <div className="mb-8 flex items-center justify-between">
                                    <h3 className="text-lg font-bold tracking-tight text-primary">
                                        Booking Summary
                                    </h3>

                                    <Link
                                        href={route('booking.date-time', {
                                            service: service.id,
                                        })}
                                        className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary dark:text-on-surface-variant-dark"
                                    >
                                        <SquarePen className="h-4 w-4" />
                                        Edit
                                    </Link>
                                </div>

                                <div className="space-y-3">
                                    <Link
                                        href={route('services')}
                                        className="group flex w-full items-start gap-4 rounded-xl p-3 text-left transition-all hover:bg-surface-accent/40 hover:shadow-sm dark:hover:bg-surface-accent-dark/40"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-accent transition-all group-hover:scale-105 group-hover:bg-primary/10 dark:bg-surface-accent-dark">
                                            <Scissors className="h-5 w-5 text-primary" />
                                        </div>

                                        <div>
                                            <p className="mb-1 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase transition-colors group-hover:text-primary dark:text-on-surface-variant-dark">
                                                Service
                                            </p>

                                            <p className="text-base leading-tight font-semibold transition-colors group-hover:text-primary dark:text-on-surface-dark">
                                                {service.name}
                                            </p>
                                        </div>
                                    </Link>

                                    <Link
                                        href={route('booking.date-time', {
                                            service: service.id,
                                        })}
                                        className="group flex w-full items-start gap-4 rounded-xl p-3 text-left transition-all hover:bg-surface-accent/40 hover:shadow-sm dark:hover:bg-surface-accent-dark/40"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-accent transition-all group-hover:scale-105 group-hover:bg-primary/10 dark:bg-surface-accent-dark">
                                            <Calendar className="h-5 w-5 text-primary" />
                                        </div>

                                        <div>
                                            <p className="mb-1 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase transition-colors group-hover:text-primary dark:text-on-surface-variant-dark">
                                                Date
                                            </p>

                                            <p className="text-base leading-tight font-semibold transition-colors group-hover:text-primary dark:text-on-surface-dark">
                                                {new Intl.DateTimeFormat(
                                                    'en-US',
                                                    {
                                                        weekday: 'long',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    },
                                                ).format(
                                                    new Date(selectedDate),
                                                )}
                                                {/* Tuesday, Oct 24, 2024 */}
                                            </p>
                                        </div>
                                    </Link>

                                    <Link
                                        href={route('booking.date-time', {
                                            service: service.id,
                                        })}
                                        className="group flex w-full items-start gap-4 rounded-xl p-3 text-left transition-all hover:bg-surface-accent/40 hover:shadow-sm dark:hover:bg-surface-accent-dark/40"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-accent transition-all group-hover:scale-105 group-hover:bg-primary/10 dark:bg-surface-accent-dark">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>

                                        <div>
                                            <p className="mb-1 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase transition-colors group-hover:text-primary dark:text-on-surface-variant-dark">
                                                Time
                                            </p>

                                            <p className="text-base leading-tight font-semibold transition-colors group-hover:text-primary dark:text-on-surface-dark">
                                                {formatTime(slot.start_time)} —{' '}
                                                {formatTime(slot.end_time)}
                                                {/* 10:30 AM — 11:15 AM */}
                                            </p>
                                        </div>
                                    </Link>
                                </div>

                                <div className="mt-12 flex items-center justify-between border-t border-outline-variant px-1 pt-6 dark:border-outline-variant-dark">
                                    <span className="text-sm font-medium text-on-surface text-on-surface-variant dark:text-on-surface-dark dark:text-on-surface-variant-dark">
                                        Total Duration
                                    </span>
                                    <span className="text-sm font-bold text-on-surface dark:text-on-surface-dark">
                                        {service.duration} Minutes
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container/30 p-4 dark:border-outline-variant-dark dark:bg-surface-container-dark">
                                <div className="relative">
                                    <img
                                        className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMfYV4KrqpvAuHuOtgjAqlZnRDfy5DWqpZYcHyWUkktOfwI4970Sx5WvHtqmBAEBKf8FYKk7x7pNmcDuhnSdDKinM4S3SvQbQ6nU7wzz1IN5HMbSimpGgnMRzjjm7N0x4TGguAjoH64B04jaRrz7PLIgaxboFBNuP_1uoi0VkYiwMnEIJE5IjuowNAkGbCP7IdGDf419FNveBSyQpp-9ngOJ7H38rHFrttfcESGndR6P9bL9_fke4CKXxXluuTro1hxZnpS-ZPd8o"
                                        alt="Jordan Henderson"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                                <div>
                                    <p className="mb-1 text-[10px] font-bold tracking-widest text-on-surface text-on-surface-variant uppercase dark:text-on-surface-dark dark:text-on-surface-variant-dark">
                                        Your Stylist
                                    </p>
                                    <p className="text-base font-bold text-primary">
                                        Jordan Henderson
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Success Overlay */}
            <AnimatePresence>
                {isBooked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-md"
                        >
                            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-2xl shadow-primary/30">
                                <CheckCircle className="h-12 w-12 text-white" />
                            </div>

                            <h1 className="mb-3 text-4xl font-bold tracking-tight text-on-surface dark:text-on-surface-dark">
                                Booking Confirmed!
                            </h1>
                            <p className="mb-10 text-lg leading-relaxed text-on-surface text-on-surface-variant dark:text-on-surface-dark dark:text-on-surface-variant-dark">
                                We've sent the confirmation details to your
                                phone. See you soon!
                            </p>

                            <div className="mb-10 rounded-2xl border border-outline-variant bg-surface-container p-8 text-left shadow-sm dark:border-outline-variant-dark">
                                <div className="mb-6 flex items-center justify-between">
                                    <span className="text-xs font-bold tracking-widest text-on-surface text-on-surface-variant uppercase dark:text-on-surface-dark dark:text-on-surface-variant-dark">
                                        Booking ID
                                    </span>
                                    <span className="rounded-full bg-surface-accent px-3 py-1 text-sm font-bold text-primary dark:bg-surface-accent-dark">
                                        #{booking?.id}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-on-surface dark:text-on-surface-dark">
                                        <Scissors className="h-5 w-5 text-primary opacity-70" />
                                        <span className="font-semibold">
                                            {service.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-on-surface dark:text-on-surface-dark">
                                        <Calendar className="h-5 w-5 text-primary opacity-70" />
                                        <span className="font-semibold">
                                            {new Intl.DateTimeFormat('en-US', {
                                                weekday: 'long',
                                                month: 'short',
                                                day: 'numeric',
                                            }).format(new Date(selectedDate))}
                                            • {formatTime(slot.start_time)}
                                            {/* Tuesday, Oct 24 • 10:30 AM */}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button className="hover:bg-primary-hover w-full rounded-xl bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all">
                                    Add to Calendar
                                </button>
                                <button
                                    onClick={() =>
                                        router.visit(route('user.bookings'))
                                    }
                                    className="w-full rounded-xl border-2 border-primary py-4 text-lg font-bold text-primary transition-all hover:bg-primary/5"
                                >
                                    View My Bookings
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GuestLayout>
    );
};

export default Create;
