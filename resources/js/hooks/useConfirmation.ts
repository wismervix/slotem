import { useState } from 'react';

export interface ConfirmOptions {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void | Promise<void>;
}

export function useConfirmation() {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const confirm = (opts: ConfirmOptions) => {
        setOptions(opts);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setOptions(null);
        setIsLoading(false);
    };

    const handleConfirm = async () => {
        if (!options) return;

        setIsLoading(true);
        try {
            await options.onConfirm();
        } catch (error) {
            console.error('Confirmation action failed:', error);
        } finally {
            setIsLoading(false);
            close();
        }
    };

    return {
        isOpen,
        isLoading,
        confirm,
        close,
        handleConfirm,
        options,
    };
}
