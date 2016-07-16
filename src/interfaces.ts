import { DateModel } from './date-model';

export interface DateFormatter {
    format (date: Date): string;
}

export class DefaultDateFormatter implements DateFormatter {

    format (date: Date): string {
        return date.toLocaleDateString();
    }
}


export interface DayLabels {
    su: string;
    mo: string;
    tu: string;
    we: string;
    th: string;
    fr: string;
    sa: string;
}

export interface MonthLabels {
    ['1']: string;
    ['2']: string;
    ['3']: string;
    ['4']: string;
    ['5']: string;
    ['6']: string;
    ['7']: string;
    ['8']: string;
    ['9']: string;
    ['10']: string;
    ['11']: string;
    ['12']: string;
}

export type FirstDayOfWeek = 'su' | 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa';

export const defaultDayLabels: DayLabels = {
    su: 'Sun',
    mo: 'Mon',
    tu: 'Tue',
    we: 'Wed',
    th: 'Thu',
    fr: 'Fri',
    sa: 'Sat'
};

export const defaultMonthLabels: MonthLabels = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
};
