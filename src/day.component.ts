import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DateModel } from './date-model';

@Component({
    selector: 'fk-day',
    template: `
        {{ date.day }}
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayComponent {

    @Input() date: DateModel;
}