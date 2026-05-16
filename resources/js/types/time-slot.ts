export interface TimeSlot {
    id: number;
    availability_id: number;
    start_time: string;
    end_time: string;
    is_booked: boolean;
}
