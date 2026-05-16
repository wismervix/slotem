import type { TimeSlot } from "./time-slot";

export interface Availability {
    id: number;
    date: string;
    time_slots: TimeSlot[];
    // created_at: string;
}
