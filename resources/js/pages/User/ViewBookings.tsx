import UserLayout from '@/layouts/User/UserLayout';
import type { Booking } from '@/types';

import { Search, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import BookingCard from '@/components/User/BookingCard';
import HistoryItem from '@/components/User/HistoryItem';


type ViewBookingsProps = {
    bookings: Booking[];
};

const ViewBookings = ({ bookings }: ViewBookingsProps) => {
    return (
        <UserLayout>
            {/* Header Section */}
            <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-on-surface">
                        My Bookings
                    </h2>
                    <p className="mt-1 text-sm text-on-surface-variant">
                        View and manage your upcoming and past appointments.
                    </p>
                </div>

                <div className="flex w-full rounded-xl bg-surface-container-high p-1 md:w-auto">
                    <button className="flex-1 rounded-lg bg-white py-2 text-xs font-bold text-primary shadow-sm transition-all md:px-6">
                        List View
                    </button>
                    <button className="flex-1 py-2 text-xs font-bold text-on-surface-variant transition-colors hover:text-primary md:px-6">
                        Calendar
                    </button>
                </div>
            </header>

            {/* Search & Filters */}
            <section className="mb-8 flex flex-wrap items-center gap-4">
                <div className="group relative min-w-[300px] flex-1">
                    <Search className="text-outline absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transition-colors group-focus-within:text-primary" />
                    <input
                        type="text"
                        placeholder="Search by provider, service or ID..."
                        className="bg-surface-container-lowest placeholder:text-outline w-full rounded-2xl border border-outline-variant py-3 pr-4 pl-12 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div className="flex w-full gap-2 sm:w-auto">
                    <select className="bg-surface-container-lowest flex-1 rounded-2xl border border-outline-variant px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:flex-none">
                        <option>All Status</option>
                        <option>Confirmed</option>
                        <option>Pending</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                    </select>
                    <select className="bg-surface-container-lowest flex-1 rounded-2xl border border-outline-variant px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:flex-none">
                        <option>This Month</option>
                        <option>Last 3 Months</option>
                        <option>Year 2024</option>
                    </select>
                </div>
            </section>

            {/* Bookings Content */}
            <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-lg font-bold text-on-surface">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/10"></span>
                    Upcoming Appointments
                </h3>

                <div className="space-y-4">
                    <BookingCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAPZf5SWhAUediuaG8pJZL807Mg0J6X6wb5-FdeUEz2nY0sLsKM4nY49q6fr_uXG5rpj7ctVGUB6ctxmnMyb2QGhVukJGvhTIrvF35b7bi63rcMawuBYlp9dj5TRt1zHJUGCTONYSnpBFx7iRyTzo18FQlihTFjDuO-XfVEKNGP5npwUKsQ_mh09geGG82CdxUjeOC9qTzGiqA-KVRW7i4Wcwm-gsUPwFTYfVjqemr-43W9CUi4KeRZ6x55R7VwGF6EUOs07_efsdk"
                        status="Confirmed"
                        refId="#SL-90221"
                        title="General Dental Consultation"
                        provider="Dr. Elizabeth Thorne"
                        location="City Health Plaza"
                        date="Oct 24, 2023"
                        time="10:30 AM - 11:15 AM"
                        actionLabel="Reschedule"
                    />

                    <BookingCard
                        image="https://lh3.googleusercontent.com/aida-public/AB6AXuARl6gJ20nSFeSpXBTHXAZzZvtzgQFnOx6i_NM3o4_gnj4k6mznNTlYAwWrA3t2rIZeEIx22k7DMUZcZVEDLd7JfnUkb5LUITICfHFz4KRKBLbvZsBcSJB0ru4upyea3RgH4e__9IANhUAQkuvLiw51K31cOAGCI9HpPmWGsG-jl7quim3NXB5cfwNL4u5gzD_Ew-4mqssaKGoWdE4eYo9H9UlqF_bekZIbSf9Twa1ujhE0llv2tS1uPZ5hBTvmREEXQXVFsoHK-Fk"
                        status="Pending"
                        refId="#SL-90245"
                        title="Deep Tissue Massage"
                        provider="Serenity Wellness Center"
                        location="Studio B"
                        date="Oct 28, 2023"
                        time="02:00 PM - 03:30 PM"
                        actionLabel="Cancel"
                        actionType="cancel"
                    />
                </div>

                {/* Past Bookings Section */}
                <div className="pt-8">
                    <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-on-surface">
                        <span className="bg-outline ring-outline/10 h-2.5 w-2.5 rounded-full ring-4"></span>
                        History
                    </h3>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <HistoryItem
                            title="Personal Training Session"
                            date="Oct 15, 2023"
                            status="Completed"
                            actionLabel="Rebook"
                        />
                        <HistoryItem
                            title="Legal Consultation"
                            date="Oct 10, 2023"
                            status="Cancelled"
                            actionLabel="Details"
                        />
                        <HistoryItem
                            title="Car Service - Yearly Maintenance"
                            date="Sep 28, 2023"
                            status="Completed"
                            actionLabel="Invoice"
                        />
                        <HistoryItem
                            title="Hair Styling & Beard Trim"
                            date="Sep 15, 2023"
                            status="Completed"
                            actionLabel="Rebook"
                        />
                    </div>
                </div>

                {/* Load More */}
                <div className="flex justify-center py-8">
                    <button className="border-outline text-outline rounded-full border px-8 py-2.5 text-xs font-bold transition-all hover:bg-surface-container-high">
                        View Older History
                    </button>
                </div>
            </div>

            {/* Floating Action Button for Mobile */}
            <div className="fixed right-8 bottom-8 md:hidden">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
                >
                    <Plus className="h-8 w-8" />
                </motion.button>
            </div>
        </UserLayout>
    );
};

export default ViewBookings;
