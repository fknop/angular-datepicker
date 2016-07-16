import { Component, Input, Output, 
        OnInit, ContentChild } from '@angular/core';
import { DateFormatter, DefaultDateFormatter } from './interfaces';
import { DatePickerComponent } from './datepicker.component';
import { Self, Optional } from '@angular/core';

@Component({
    selector: 'fk-datepicker-input',
    template: `
        <input [ngClass]="customClasses" 
               (click)="toggle()"
               readonly="true"
               type="text" 
               [style.background-color]="'inherit'"
               [value]="formatter.format(datepicker.activeDate)">

        <ng-content></ng-content>
    `
})
export class DatePickerInputComponent implements OnInit {

    @ContentChild(DatePickerComponent) datepicker: DatePickerComponent;

    @Input() formatter: DateFormatter;
    @Input() customClasses: string = 'form-control';

    constructor () {}

    toggle () {
        
        this.datepicker.open = !this.datepicker.open;
    }

    ngOnInit () {
        
        this.formatter = this.formatter || new DefaultDateFormatter();
    }
}
