import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
    X,
    User,
    Phone,
    Mail,
    MapPin,
    Stethoscope,
    UserCheck,
    Clock,
    Calendar,
    AlertOctagon,
    CheckCircle,
    FileText,
    Trash2,
    AlertCircle,
} from 'lucide-react';
import { AdminBooking, ClinicService, Staff } from '@/types';

interface BookingDetailsModalProps {
    booking: AdminBooking | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStatus: (id: string, nextStatus: AdminBooking['status']) => void;
    onUpdateNotes: (id: string, nextNotes: string) => void;
    services: ClinicService[];
    staff: Staff[];
}

export default function BookingDetailsModal({
    booking,
    isOpen,
    onClose,
    onUpdateStatus,
    onUpdateNotes,
    services,
    staff,
}: BookingDetailsModalProps) {
    const [localNotes, setLocalNotes] = useState(booking?.notes || '');
    const [isEditingNotes, setIsEditingNotes] = useState(false);

    React.useEffect(() => {
        if (booking) {
            setLocalNotes(booking.notes || '');
            setIsEditingNotes(false);
        }
    }, [booking]);

    if (!isOpen || !booking) return null;

    const srv = services.find((s) => s.id === booking.serviceId);
    const clinician = staff.find((s) => s.id === booking.staffId);

    const handleSaveNotes = () => {
        onUpdateNotes(booking.id, localNotes);
        setIsEditingNotes(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#1d1a24]/60 p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="animate-fade-in w-full max-w-[500px] overflow-hidden rounded-2xl border border-[#e8dfee] bg-white text-[#1d1a24] shadow-2xl"
            >
                {/* Header line */}
                <div className="flex items-center justify-between border-b border-[#e8dfee] bg-gray-50 px-6 py-4">
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase">
                            Appointment Ledger
                        </span>
                        <p className="mt-0.5 text-sm font-extrabold text-[#1d1a24]">
                            Reference ID: {booking.id}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer rounded-lg border bg-white p-1 text-gray-400 transition-transform hover:scale-105 hover:text-gray-900"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Info Layout */}
                <div className="space-y-6 p-6">
                    {/* Patient identification contact card */}
                    <div className="flex items-start gap-3.5 rounded-xl border border-violet-100 bg-violet-50/40 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaddff] text-sm font-black text-[#630ed4]">
                            {booking.clientName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-base leading-tight font-bold text-gray-900">
                                {booking.clientName}
                            </h4>
                            <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                                <Phone className="h-3 w-3" />{' '}
                                {booking.clientPhone}
                            </p>
                            <br />
                            <p className="mt-0.5 inline-flex items-center gap-1 font-mono text-xs text-gray-400">
                                <Mail className="h-3 w-3" />{' '}
                                {booking.clientEmail}
                            </p>
                        </div>
                    </div>

                    {/* Details list */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                        {/* Treatment */}
                        <div className="rounded-lg bg-gray-50 p-3">
                            <p className="mb-1 text-[10px] font-bold text-gray-400 uppercase">
                                Treatment Plan
                            </p>
                            <p className="truncate text-xs font-bold text-[#1d1a24]">
                                {srv?.name || booking.serviceId}
                            </p>
                            <p className="mt-0.5 text-[10px] font-medium text-gray-500">
                                ${srv?.price} • {srv?.durationMinutes} mins
                            </p>
                        </div>

                        {/* Clinician */}
                        <div className="rounded-lg bg-gray-50 p-3">
                            <p className="mb-1 text-[10px] font-bold text-gray-400 uppercase">
                                Assigned Physician
                            </p>
                            <p className="truncate font-bold text-gray-800">
                                {clinician
                                    ? `Dr. ${clinician.name}`
                                    : 'Unassigned'}
                            </p>
                            <p className="mt-0.5 text-[10px] font-medium text-gray-500">
                                {clinician?.role || 'Clinician'}
                            </p>
                        </div>

                        {/* Time & Date */}
                        <div className="rounded-lg bg-gray-50 p-3">
                            <p className="mb-1 text-[10px] font-bold text-gray-400 uppercase">
                                Sheduled At
                            </p>
                            <p className="text-xs font-bold text-gray-800">
                                {booking.time}
                            </p>
                            <p className="mt-0.5 text-[10px] font-medium text-gray-500">
                                {booking.date}
                            </p>
                        </div>

                        {/* Room */}
                        <div className="rounded-lg bg-gray-50 p-3">
                            <p className="mb-1 text-[10px] font-bold text-gray-400 uppercase">
                                Designated Space
                            </p>
                            <p className="text-xs font-black text-gray-800">
                                Room {booking.room}
                            </p>
                            <p className="mt-0.5 text-[10px] text-gray-500">
                                Sterility Verified
                            </p>
                        </div>
                    </div>

                    {/* Status badge and controls */}
                    <div>
                        <p className="mb-2 text-[10px] font-bold text-gray-400 uppercase">
                            Check-in Status Control Action
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {(
                                [
                                    'Upcoming',
                                    'Confirmed',
                                    'In Progress',
                                    'Completed',
                                    'Cancelled',
                                ] as AdminBooking['status'][]
                            ).map((st) => (
                                <button
                                    key={st}
                                    onClick={() =>
                                        onUpdateStatus(booking.id, st)
                                    }
                                    className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                                        booking.status === st
                                            ? 'bg-[#630ed4] text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes column list */}
                    <div className="border-t border-gray-100 pt-4">
                        <div className="mb-1.5 flex items-center justify-between">
                            <label className="mb-1 text-[10px] font-bold text-gray-400 uppercase">
                                Pre-treatment clinical complaints
                            </label>
                            {!isEditingNotes ? (
                                <button
                                    onClick={() => setIsEditingNotes(true)}
                                    className="text-xs font-bold text-[#630ed4] hover:underline"
                                >
                                    Edit complaints
                                </button>
                            ) : (
                                <button
                                    onClick={handleSaveNotes}
                                    className="text-xs font-bold text-emerald-600 hover:underline"
                                >
                                    Save complaints
                                </button>
                            )}
                        </div>

                        {isEditingNotes ? (
                            <textarea
                                value={localNotes}
                                onChange={(e) => setLocalNotes(e.target.value)}
                                className="min-h-[70px] w-full resize-none rounded-lg border p-2 text-xs focus:outline-none"
                            />
                        ) : (
                            <p className="rounded-lg bg-gray-50 p-2.5 text-xs leading-normal text-gray-600 italic">
                                {booking.notes ||
                                    'No pre-treatment medical complaints reported yet.'}
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
