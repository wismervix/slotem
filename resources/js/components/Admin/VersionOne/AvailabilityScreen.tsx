import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
    CalendarDays,
    Clock,
    HelpCircle,
    Info,
    CheckCircle,
    AlertTriangle,
    Lock,
    Unlock,
    RefreshCw,
} from 'lucide-react';
import { AdminBooking, Staff } from '@/types';
import { ROOMS } from '@/data/initial-data';

interface AvailabilityScreenProps {
    bookings: AdminBooking[];
    staff: Staff[];
    selectedDate?: string;
}

const HOURS = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM', // lunch break preset
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
];

export default function AvailabilityScreen({
    bookings,
    staff,
}: AvailabilityScreenProps) {
    const [selectedDate, setSelectedDate] = useState<string>('2026-06-09');
    const [viewType, setViewType] = useState<'rooms' | 'dentists'>('rooms');

    // local customized override of blocked slots by room/hour for temporary clinic breaks
    // Format: "roomName:hourString" -> 'blocked' | 'free'
    const [manuallyBlocked, setManuallyBlocked] = useState<
        Record<string, 'blocked' | 'free'>
    >({
        '102:12:00 PM': 'blocked',
        '104:12:00 PM': 'blocked',
        '105:12:00 PM': 'blocked',
        '201:12:00 PM': 'blocked',
    });

    const handleToggleSlot = (key: string) => {
        setManuallyBlocked((prev) => {
            const current = prev[key];
            const next = current === 'blocked' ? 'free' : 'blocked';
            return { ...prev, [key]: next };
        });
    };

    // Determine matching booking for a specific slot
    const findBookingForSlot = (
        targetType: 'rooms' | 'dentists',
        targetId: string,
        timeHour: string,
    ) => {
        return bookings.find((b) => {
            if (b.date !== selectedDate || b.status === 'Cancelled')
                return false;

            // Check if candidate time matches the booking's hourly slot (e.g. "09:00 AM")
            // Quick parser to match e.g. "09:00 AM" with "09:00 AM" or similar
            const bookingHourStr = b.time.trim(); // e.g. "09:00 AM"

            const matchCriteria =
                targetType === 'rooms'
                    ? b.room === targetId
                    : b.staffId === targetId;

            return matchCriteria && bookingHourStr === timeHour;
        });
    };

    return (
        <div className="animate-fade-in text-[#1d1a24]">
            {/* Header element */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="mb-1 text-3xl font-bold tracking-tight text-[#1d1a24]">
                        Availability Planner
                    </h2>
                    <p className="text-gray-500">
                        Live clinical room allocation, dental staff shifts, and
                        calendar slots blockages.
                    </p>
                </div>

                {/* Calendar Picker toggle */}
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-[#630ed4]" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="rounded-lg border border-[#e8dfee] bg-white px-3 py-1.5 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#630ed4] focus:outline-none"
                    />
                </div>
            </div>

            {/* Info indicator panel */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e8dfee] bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Info className="h-4 w-4 text-amber-500" />
                    <span>
                        Interactive grid: Click any empty slot to toggle clinic
                        rest blockages. Lunch slots are auto-blocked!
                    </span>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-md border border-emerald-300 bg-emerald-50"></span>
                        <span className="font-bold text-emerald-700">Free</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-md border border-violet-400 bg-violet-100"></span>
                        <span className="text-[#630ed4]">
                            Occupied (Booked)
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-md border border-rose-200 bg-rose-50"></span>
                        <span className="text-rose-600">
                            Blocked (Rest/Break)
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid Switch Button Tabs */}
            <div className="mb-6 flex max-w-xs gap-2 self-start rounded-xl bg-gray-100 p-1.5">
                <button
                    onClick={() => setViewType('rooms')}
                    className={`flex-1 cursor-pointer rounded-lg px-4 py-2 text-center text-xs font-bold transition-all ${
                        viewType === 'rooms'
                            ? 'bg-white text-[#630ed4] shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    View by Rooms
                </button>
                <button
                    onClick={() => setViewType('dentists')}
                    className={`flex-1 cursor-pointer rounded-lg px-4 py-2 text-center text-xs font-bold transition-all ${
                        viewType === 'dentists'
                            ? 'bg-white text-[#630ed4] shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    View by Doctors
                </button>
            </div>

            {/* Dynamic Grid Board */}
            <div className="overflow-hidden rounded-xl border border-[#e8dfee] bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] table-fixed border-collapse text-left">
                        <thead>
                            <tr className="border-b border-[#e8dfee] bg-gray-50">
                                <th className="w-44 px-6 py-4 text-xs font-black tracking-wider text-gray-500 uppercase">
                                    {viewType === 'rooms'
                                        ? 'Clinic Rooms'
                                        : 'Dental Doctor'}
                                </th>
                                {HOURS.map((hr) => (
                                    <th
                                        key={hr}
                                        className="px-2 py-4 text-center text-[10px] font-bold tracking-tight text-gray-500 uppercase"
                                    >
                                        {hr.replace(' ', '\n')}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(viewType === 'rooms'
                                ? ROOMS
                                : staff.filter((s) => s.role !== 'Lead Admin')
                            ).map((entity) => {
                                const entityId =
                                    typeof entity === 'string'
                                        ? entity
                                        : entity.id;
                                const entityDisplayLabel =
                                    typeof entity === 'string'
                                        ? `Room ${entity}`
                                        : entity.name;
                                const entityExtra =
                                    typeof entity === 'string'
                                        ? 'Equipped'
                                        : entity.role;

                                return (
                                    <tr
                                        key={entityId}
                                        className="transition-colors hover:bg-gray-50/20"
                                    >
                                        {/* Entity Header Header (Row Leftmost title) */}
                                        <td className="border-r border-[#e8dfee] bg-gray-50/50 px-6 py-5 font-bold">
                                            <p className="text-sm text-gray-900">
                                                {entityDisplayLabel}
                                            </p>
                                            <p className="text-[10px] font-semibold text-gray-400">
                                                {entityExtra}
                                            </p>
                                        </td>

                                        {/* Hourly Blocks */}
                                        {HOURS.map((hr) => {
                                            const slotKey = `${entityId}:${hr}`;
                                            const hasActiveBooking =
                                                findBookingForSlot(
                                                    viewType,
                                                    entityId,
                                                    hr,
                                                );
                                            const isLunchHourSetting =
                                                hr === '12:00 PM';
                                            const isTemporarilyBlocked =
                                                manuallyBlocked[slotKey] ===
                                                    'blocked' ||
                                                (isLunchHourSetting &&
                                                    manuallyBlocked[slotKey] !==
                                                        'free');

                                            let cellBg =
                                                'bg-emerald-50/40 hover:bg-emerald-100/60 border border-emerald-100';
                                            let statusText = 'Available';
                                            let labelColor = 'text-emerald-700';

                                            if (hasActiveBooking) {
                                                cellBg =
                                                    'bg-[#f3ebfa] hover:bg-[#ede0ff] border border-brand-primary/20 cursor-help';
                                                statusText =
                                                    hasActiveBooking.clientName;
                                                labelColor =
                                                    'text-[#630ed4] font-semibold';
                                            } else if (isTemporarilyBlocked) {
                                                cellBg =
                                                    'bg-rose-50/50 hover:bg-rose-100/30 border border-rose-100';
                                                statusText = isLunchHourSetting
                                                    ? 'Lunch Rest Break'
                                                    : 'Blocked Slot';
                                                labelColor = 'text-rose-500';
                                            }

                                            return (
                                                <td
                                                    key={hr}
                                                    className="border-r border-gray-100 p-1"
                                                >
                                                    <div
                                                        title={
                                                            hasActiveBooking
                                                                ? `Booked for ${hasActiveBooking.clientName}\nTreatment: ${hasActiveBooking.notes || 'None'}`
                                                                : `Click to toggle rest block`
                                                        }
                                                        onClick={() => {
                                                            if (
                                                                !hasActiveBooking
                                                            ) {
                                                                handleToggleSlot(
                                                                    slotKey,
                                                                );
                                                            }
                                                        }}
                                                        className={`flex h-16 cursor-pointer flex-col justify-between rounded-lg p-2 text-center transition-all select-none ${cellBg}`}
                                                    >
                                                        <span className="text-[9px] font-bold text-gray-400">
                                                            {hr.split(' ')[0]}
                                                        </span>

                                                        <div className="flex flex-col items-center justify-center">
                                                            {hasActiveBooking ? (
                                                                <span
                                                                    className={`line-clamp-1 text-[10px] font-bold ${labelColor}`}
                                                                >
                                                                    {statusText}
                                                                </span>
                                                            ) : isTemporarilyBlocked ? (
                                                                <Lock className="mb-0.5 h-3 w-3 shrink-0 text-rose-400" />
                                                            ) : (
                                                                <Unlock className="h-3 w-3 shrink-0 text-emerald-400 opacity-0 transition-opacity hover:opacity-100" />
                                                            )}
                                                            {!hasActiveBooking && (
                                                                <span
                                                                    className={`mt-0.5 max-w-full truncate text-[9px] leading-none font-medium ${labelColor}`}
                                                                >
                                                                    {statusText}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Dummy empty spacer */}
                                                        <div className="h-1"></div>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
