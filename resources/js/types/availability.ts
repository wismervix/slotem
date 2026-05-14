export interface TimeSlot {
    start_time: string;
    end_time: string;
}

export interface Availability {
    date: string;

    time_slots: TimeSlot[];
}
