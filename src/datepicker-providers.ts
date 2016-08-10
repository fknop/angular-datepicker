import { PLATFORM_DIRECTIVES, NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { fkDatePickerConfigProvider, FkDatePickerConfig } from './config';
import { DateValueAccessor } from './date-value-accessor';
import { DatePickerComponent } from './datepicker.component';
import { DatePickerInputComponent } from './datepicker-input.component';


/**
 * @deprecated will be removed in rc.6
 */
export const FK_DATEPICKER_DIRECTIVES: any[] = [
    DateValueAccessor,
    DatePickerComponent,
    DatePickerInputComponent
];

/**
 * @deprecated will be removed in rc.6
 */
export function fkDatePickerProviders (config?: FkDatePickerConfig) {

    console.warn(`fkDatePickerProviders is deprecated and will be removed in rc.6. 
                  Use FkDatePickerModule instead or FkDatePickerModule.withConfig to provide
                  a configuration object.`);

    const providers: any[] = [
        { provide: PLATFORM_DIRECTIVES, useValue: FK_DATEPICKER_DIRECTIVES, multi: true }
    ];

    if (config) {
        providers.push(fkDatePickerConfigProvider(config));
    }

    return providers;
}

@NgModule({
    declarations: [FK_DATEPICKER_DIRECTIVES],
    exports: [FK_DATEPICKER_DIRECTIVES],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FkDatePickerModule {

    static withConfig (config: FkDatePickerConfig): ModuleWithProviders {

        return {
            ngModule: FkDatePickerModule,
            providers: [
                fkDatePickerConfigProvider(config)
            ]
        };
    }
}