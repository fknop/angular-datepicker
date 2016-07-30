import { PLATFORM_DIRECTIVES } from '@angular/core';

import { fkDatePickerConfigProvider, FkDatePickerConfig } from './config';
import { DateValueAccessor } from './date-value-accessor';
import { DatePickerComponent } from './datepicker.component';
import { DatePickerInputComponent } from './datepicker-input.component';


export const FK_DATEPICKER_DIRECTIVES: any[] = [
    DateValueAccessor,
    DatePickerComponent,
    DatePickerInputComponent
];

// Change for rc.5
export function fkDatePickerProviders (config?: FkDatePickerConfig) {

    const providers: any[] = [
        { provide: PLATFORM_DIRECTIVES, useValue: FK_DATEPICKER_DIRECTIVES, multi: true }
    ];

    if (config) {
        providers.push(fkDatePickerConfigProvider(config));
    }

    return providers;
}