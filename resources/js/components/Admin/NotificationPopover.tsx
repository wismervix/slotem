import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Heart, AlertCircle, Calendar, Plus, X } from 'lucide-react';
import { ActivityLog } from '@/types';

interface NotificationPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    logs: ActivityLog[];
    onClear: () => void;
}

export default function NotificationPopover({
    isOpen,
    onClose,
    logs,
    onClear,
}: NotificationPopoverProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Invisible backdrop to close the dropdown when clicking outside */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="animate-fade-in absolute top-12 right-0 z-50 w-80 overflow-hidden rounded-xl border border-[#e8dfee] bg-white text-[#1d1a24] shadow-xl"
            >
                <div className="flex items-center justify-between border-b border-[#e8dfee] bg-gray-50 px-4 py-3">
                    <p className="text-xs font-black text-gray-400 uppercase">
                        Clinical Logs Feed ({logs.length})
                    </p>
                    {logs.length > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            className="text-[10px] font-extrabold text-red-500 hover:underline"
                        >
                            Clear Logs
                        </button>
                    )}
                </div>

                <div className="hide-scrollbar max-h-[300px] divide-y divide-gray-100 overflow-y-auto">
                    {logs.length === 0 ? (
                        <div className="p-8 text-center text-xs text-gray-400 italic">
                            All logs cleared. Ready to track booking operations!
                        </div>
                    ) : (
                        logs.map((log) => (
                            <div
                                key={log.id}
                                className="flex gap-3 p-3.5 text-xs leading-normal transition-colors hover:bg-gray-50/50"
                            >
                                <div className="mt-0.5 shrink-0">
                                    {log.type === 'booking_cancelled' ? (
                                        <AlertCircle className="h-4 w-4 text-rose-500" />
                                    ) : log.type === 'booking_new' ? (
                                        <Plus className="h-4 w-4 text-[#630ed4]" />
                                    ) : (
                                        <Calendar className="h-4 w-4 text-[#7d3d00]" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-[#1d1a24]">
                                        {log.title}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-gray-500">
                                        {log.description}
                                    </p>
                                    <p className="mt-1 text-[9px] font-semibold text-gray-400">
                                        {log.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </>
    );
}
