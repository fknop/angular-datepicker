import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { fkDatePickerConfigProvider, FkDatePickerConfig } from './config';
import { DayComponent } from './day.component';
import { DateValueAccessor } from './date-value-accessor';
import { DatePickerComponent } from './datepicker.component';
import { DatePickerInputComponent } from './datepicker-input.component';


const FK_DATEPICKER_DIRECTIVES: any[] = [
    DateValueAccessor,
    DatePickerComponent,
    DatePickerInputComponent
];


@NgModule({
    declarations: [FK_DATEPICKER_DIRECTIVES, DayComponent], // Not sure yet if it's really needed for now, will test later
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