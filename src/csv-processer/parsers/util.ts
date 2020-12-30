
export function parseDate(s: string): Date {
    let [year, month, day] = s.split('/');
    if (month.length == 1) {
        month = '0' + month;
    }
    if (day.length == 1) {
        day = '0' + day;
    }

    return new Date(`${year}-${month}-${day}T00:00:00Z`);
}

export function parseAmount(s: string): number {
    let i = Number.parseInt(s, 10)
    if (Number.isNaN(i)) {
        return 0;
    }
    return i;
}
