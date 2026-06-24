export function formatDate(date: Date): string {
    // return date.toISOString().split('T')[0];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export const extractAndFormatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',});
};

export const extractAndFormatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export function formatDateAndTime(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC', // 🔥 prevents timezone shifting
    });
}

export const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');

    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(date);
};

export function isSameDate(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function isPastDate(date: Date): boolean {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return date < today;
}

export function generateCalendarDays(month: number, year: number) {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

    const calendarDays: {
        date: Date;
        currentMonth: boolean;
    }[] = [];

    // Previous month padding
    for (let i = startingDayIndex; i > 0; i--) {
        calendarDays.push({
            date: new Date(year, month, 1 - i),
            currentMonth: false,
        });
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push({
            date: new Date(year, month, day),
            currentMonth: true,
        });
    }

    // Only pad to the next multiple of 7 — don't blindly go to 42.
    // This means months that fit in 5 rows (35 cells) won't get a ghost 6th row.
    const totalSoFar = calendarDays.length;
    const remainder = totalSoFar % 7;
    const trailingDays = remainder === 0 ? 0 : 7 - remainder;

    for (let i = 1; i <= trailingDays; i++) {
        calendarDays.push({
            date: new Date(year, month + 1, i),
            currentMonth: false,
        });
    }

    return calendarDays;
}
