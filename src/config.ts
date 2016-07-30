import { OpaqueToken } from '@angular/core';

import { MonthLabels, DayLabels, FirstDayOfWeek } from './interfaces';

export const FK_DATEPICKER_CONFIG = new OpaqueToken('angular-fk-datepicker');

export interface FkDatePickerConfig {
    minDate?: Date;
    maxDate?: Date;
    initialDate?: Date;
    monthLabels?: MonthLabels;
    dayLabels?: DayLabels;
    firstDayOfWeek?: FirstDayOfWeek;
    customClasses?: any; // TODO - change to interface
}


export function fkDatePickerConfigProvider (config: FkDatePickerConfig) {

    return {
        provide: FK_DATEPICKER_CONFIG,
        useValue: config
    };
}   