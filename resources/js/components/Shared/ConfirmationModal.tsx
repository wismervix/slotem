// ============================================
// IMPORTS
// ============================================
import { AlertTriangle, X } from 'lucide-react';
import { ReactNode } from 'react';

// ============================================
// CONFIRM MODAL TYPES
// ============================================
export type ConfirmVariant = 'danger' | 'warning' | 'info';

export interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ConfirmVariant;
    icon?: ReactNode;
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'warning',
    icon,
    isLoading = false,
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            iconBg: 'bg-red-100 dark:bg-red-950/50',
            iconColor: 'text-red-500',
            buttonBg: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
        },
        warning: {
            iconBg: 'bg-amber-100 dark:bg-amber-950/50',
            iconColor: 'text-amber-500',
            buttonBg: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
        },
        info: {
            iconBg: 'bg-blue-100 dark:bg-blue-950/50',
            iconColor: 'text-blue-500',
            buttonBg: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
        },
    };

    const styles = variantStyles[variant];

    // ============================================
    // RENDER
    // ============================================
    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded-xl border border-outline-variant bg-surface p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-3">
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.iconBg}`}
                    >
                        {icon || (
                            <AlertTriangle
                                className={`h-5 w-5 ${styles.iconColor}`}
                            />
                        )}
                    </div>

                    <div className="flex-1">
                        <h3
                            id="confirm-modal-title"
                            className="text-sm font-bold text-on-surface dark:text-white"
                        >
                            {title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-on-surface-variant dark:text-slate-400">
                            {message}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="cursor-pointer rounded p-1 text-on-surface-variant transition-colors hover:bg-surface-container dark:text-slate-400 dark:hover:bg-slate-800"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="cursor-pointer rounded-lg border border-outline px-4 py-2 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        autoFocus
                        className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:opacity-50 ${styles.buttonBg}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Loading...
                            </span>
                        ) : (
                            confirmLabel
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
