import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastType {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastProps {
    toasts: ToastType[];
    removeToast: (id: string) => void;
}

export default function Toast({ toasts, removeToast }: ToastProps) {
    return (
        <div className="fixed right-6 bottom-6 z-50 flex w-full max-w-sm flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={`flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg ${
                            toast.type === 'success'
                                ? 'border-green-100 text-green-800'
                                : toast.type === 'error'
                                  ? 'border-red-100 text-red-800'
                                  : 'border-blue-100 text-blue-800'
                        }`}
                    >
                        {toast.type === 'success' && (
                            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                        )}
                        {toast.type === 'error' && (
                            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                        )}
                        {toast.type === 'info' && (
                            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                        )}

                        <div className="flex-1 text-sm font-medium">
                            {toast.message}
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
