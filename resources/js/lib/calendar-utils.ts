export function formatDate(date: Date): string {
    // return date.toISOString().split('T')[0];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

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

    // previous month padding
    for (let i = startingDayIndex; i > 0; i--) {
        const date = new Date(year, month, 1 - i);

        calendarDays.push({
            date,
            currentMonth: false,
        });
    }

    // current month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push({
            date: new Date(year, month, day),
            currentMonth: true,
        });
    }

    // next month padding
    const remaining = 42 - calendarDays.length;

    for (let i = 1; i <= remaining; i++) {
        calendarDays.push({
            date: new Date(year, month + 1, i),
            currentMonth: false,
        });
    }

    return calendarDays;
}
