import { DateModel } from './date-model';

export function getRealDate (date: Date): Date {

    const hours = date.getHours();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours === 23 ? hours + 2 : 0);
}

export function createDate (year: number, month: number, day: number) {

    return getRealDate(new Date(year, month, day));
}

export function getDayOfWeek (date: Date) {

    return date.getDay();
}

export function getFirstDayOfMonth (date: Date) {

    return getDayOfWeek(new Date(date.getFullYear(), date.getMonth(), 1));
}


export function sameMonth (a: Date, b: Date) {

    return a.getMonth() === b.getMonth();
}

export function sameYear (a: Date, b: Date) {

    return a.getFullYear() === b.getFullYear();
}

export function sameMonthAndYear (a: Date, b: Date) {

    return sameYear(a, b) && sameMonth(a, b);
}

export function checkDate (date: Date, minDate?: Date, maxDate?: Date) {

    const d = getRealDate(date);
    
    let condition = true;
    if (minDate) {
        condition = condition && d >= minDate;
    }

    if (condition && maxDate) {
        condition = condition && d <= maxDate;
    }

    return condition;
}

export function sameDate (a: Date, b: Date) {

    return a.getDate() === b.getDate() &&
           a.getMonth() === b.getMonth() &&
           a.getFullYear() === b.getFullYear();
}

export function getFirstDayOfWeekIndex (firstDayOfWeek: string) {

    // Faster than indexOf 
    switch (firstDayOfWeek) {
        case 'su': return 0;
        case 'mo': return 1;
        case 'tu': return 2;
        case 'we': return 3;
        case 'th': return 4;
        case 'fr': return 5;
        case 'sa': return 6;
        default: throw new Error('firstDayOfWeek must be a valid day');
    }
}

export function getDates (date: Date, { count = 42, minDate, maxDate, firstDayOfWeek = 'su' }: {
    count: number,
    minDate?: Date, 
    maxDate?: Date, 
    firstDayOfWeek: string
}): { 
    dates: DateModel[], 
    selectedIndex: number
} {

    const dates: DateModel[] = [];
    let selectedIndex: number;

    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDayOfMonth = getFirstDayOfMonth(date)
    const firstDayIndex = getFirstDayOfWeekIndex(firstDayOfWeek);
    let offset = -firstDayOfMonth + firstDayIndex;
    offset = offset > 0 ? offset - 7 : offset;

    for (let i = offset; i < (count + offset); ++i) {
        const d = createDate(year, month, 1 + i);
        const isCurrent = sameDate(date, d);

        if (isCurrent) {
            selectedIndex = i - offset;
        }

        dates.push(
            new DateModel({
                date: d,
                off: !(sameMonth(date, d) && checkDate(d, minDate, maxDate)),
                selected: isCurrent
            })
        );
    }

    return {
        dates: dates,
        selectedIndex: selectedIndex
    };
}

export function split (array: any[], size: number = 7): any[][] {

    const arrays: any[][] = [];
    while (array.length > 0) {
        arrays.push(array.splice(0, size));
    }

    return arrays;
}
