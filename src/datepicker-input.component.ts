import { Component, Input, Output, 
        OnInit, ContentChild,
        AfterContentInit, OnDestroy } from '@angular/core';
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
               [value]="formatter.format(datepicker.activeDate)" />
        <ng-content></ng-content>
    `
})
export class DatePickerInputComponent implements OnInit, AfterContentInit, OnDestroy {

    @ContentChild(DatePickerComponent) datepicker: DatePickerComponent;

    @Input() formatter: DateFormatter;
    @Input() customClasses: string = 'form-control';

    private subscription: any;

    constructor () {}

    toggle () {
        
        if (this.datepicker.isOpen()) {
            this.datepicker.close();
        }
        else {
            this.datepicker.closeOnClickAway = false; // Make sure if the user sets it to true.
            this.datepicker.open();
        }
    }

    ngOnInit () {
        
        this.formatter = this.formatter || new DefaultDateFormatter();
    }

    ngAfterContentInit () {

        if (!this.datepicker) {
            throw new Error('DatePickerComponent not projected into DatePickerInputComponent');
        }

        this.subscription = this.datepicker.toggle.subscribe((open) => {
            setTimeout(() => {
                this.datepicker.closeOnClickAway = open;
            }, 0);
        });
    }

    ngOnDestroy () {

        this.subscription.unsubscribe();
    }

}
