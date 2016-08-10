import { Component, Input, Output, OnInit, Optional, Inject, ContentChild, AfterContentInit, ChangeDetectionStrategy} from '@angular/core';
import { DateFormatter, DefaultDateFormatter } from './interfaces';
import { DatePickerComponent } from './datepicker.component';
import { FK_DATEPICKER_CONFIG, FkDatePickerConfig } from './config';

@Component({
    selector: 'fk-datepicker-input',
    template: `
        <input [ngClass]="customClasses" 
               (click)="toggle()"
               readonly="true"
               type="text" 
               [style.background-color]="'inherit'"
               [value]="formatter.format(datepicker.activeDate)" />
        <ng-content></ng-content>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerInputComponent implements OnInit, AfterContentInit {

    @ContentChild(DatePickerComponent) datepicker: DatePickerComponent;

    @Input() formatter: DateFormatter;
    @Input() customClasses: string = 'form-control';

    constructor(
        @Optional() @Inject(FK_DATEPICKER_CONFIG) private config: FkDatePickerConfig
    ) {}

    toggle () {
        
        if (this.datepicker.isOpen()) {
            this.datepicker.close();
        }
        else {
            this.datepicker.open();
        }
    }

    ngOnInit () {
        
        if (this.config) {
            this.formatter = this.formatter || this.config.formatter;
        }
        
        this.formatter = this.formatter || new DefaultDateFormatter();
    }

    ngAfterContentInit () {

        if (!this.datepicker) {
            throw new Error('DatePickerComponent not projected into DatePickerInputComponent');
        }

    }
}
