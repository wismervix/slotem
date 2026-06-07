import { createContext, useContext, useState } from 'react';

// Define what your context will provide
interface BookingModalContextType {
    isOpen: boolean;
    slotId?: number;
    serviceId?: number;
    date?: string;
    openModal: (date?: string, slotId?: number, serviceId?: number) => void;
    closeModal: () => void;
}

// Create the context
const BookingModalContext = createContext<BookingModalContextType | undefined>(undefined);

// Create a Provider component (this wraps your app)
export function BookingModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [slotId, setSlotId] = useState<number>();
    const [serviceId, setServiceId] = useState<number>();
    const [date, setDate] = useState<string>();

    const openModal = (date?: string, slotId?: number, serviceId?: number) => {
        setSlotId(slotId);
        setServiceId(serviceId);
        setDate(date);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSlotId(undefined);
        setServiceId(undefined);
        setDate(undefined);
    };

    return (
        <BookingModalContext.Provider
            value={{ isOpen, slotId, serviceId, date, openModal, closeModal }}
        >
            {children}
        </BookingModalContext.Provider>
    );
}

// Custom hook to use the context (makes it easier)
export function useBookingModalContext() {
    const context = useContext(BookingModalContext);
    if (!context) {
        throw new Error('useBookingModalContext must be used within BookingModalProvider');
    }
    return context;
}
