import { 
    ChangeDetectionStrategy, 
    Component, 
    EventEmitter, 
    Host,
    HostBinding,
    HostListener, 
    Inject,
    Input,
    OnInit, 
    Optional,
    Output,
    Self
} from '@angular/core';
import { FormControlName, FormGroupDirective, NgModel } from '@angular/forms';

import { 
    checkDate, 
    getDates, 
    getFirstDayOfWeekIndex,
    getRealDate, 
    sameDate,
    sameMonthAndYear,
    split
} from './shared';

import { DateModel } from './date-model';
import {
     DatePickerCustomClasses,
     DayLabels, 
     defaultDayLabels, 
     defaultMonthLabels,
     FirstDayOfWeek, 
     MonthLabels,
     mergeCustomClasses
} from './interfaces';
import { FK_DATEPICKER_CONFIG, FkDatepickerConfig } from './config';
import { DayComponent } from './day.component';
import { DateValueAccessor } from './date-value-accessor';

// Styles inspired and modified from https://github.com/winmarkltd/BootstrapFormHelpers
const BS3_STYLES: string = `

    :host {
        position: absolute;
        z-index: 1000;
        display: none;
        float: left;
        min-width: 296px;
    }

    :host.open > .datepicker, :host.open {
        display: block;
    }

    :host > table > tbody > tr > td.off {
        color: #999999;
        pointer-events: none !important;
        cursor: default !important;
    }

    :host > table.calendar {
        width: 376px;
        background: #ffffff;
    }

    :host > table.calendar .months-header > th {
        font-size: 12px;
        text-align: center;
    }

    :host > table.calendar .months-header > th > a {
        cursor: pointer;
    }

    :host > table.calendar .months-header > th.month > span {
        display: inline-block;
        width: 100px;
    }

    :host > table.calendar .months-header > th.year > span {
        display: inline-block;
        width: 50px;
    }

    :host > table.calendar .days-header > th {
        width: 30px;
        font-size: 11px;
        line-height: 12px;
        text-align: center;
    }

    :host > table.calendar > tbody > tr > td {
        width: 30px;
        font-size: 11px;
        line-height: 12px;
        text-align: center;
    }

    :host > table.calendar > tbody > tr > td.selected {
        color: #ffffff;
        background-color: #428bca;
        pointer-events: none;
    }

    
    :host > table.calendar > tbody > tr > td:not(.off):not(.selected):hover {
        color: #262626;
        cursor: pointer;
        background-color: #f5f5f5;
    }
`;

const TEMPLATE: string = `
    <table class="table table-bordered" [ngClass]="customClasses.table">
        <thead> 
            <tr [ngClass]="customClasses.headerRow"> 
                <th [ngClass]="customClasses.month" colspan="4"> 
                    <a class="previous" (click)="moveMonth(-1)">
                        <i [ngClass]="customClasses.previousIcon"></i>
                    </a> 
                    <span>
                        {{ months[activeDate.getMonth()] }}
                    </span> 
                    <a class="next" (click)="moveMonth(1)">
                        <i [ngClass]="customClasses.nextIcon"></i>
                    </a> 
                </th> 
                <th [ngClass]="customClasses.year" colspan="3"> 
                    <a class="previous" (click)="moveYear(-1)">
                        <i [ngClass]="customClasses.previousIcon"></i>
                    </a> 
                    <span>
                        {{ activeDate.getFullYear() }}
                    </span> 
                    <a class="next" (click)="moveYear(1)">
                        <i [ngClass]="customClasses.nextIcon"></i>
                    </a> 
                </th> 
            </tr> 
            <tr [ngClass]="customClasses.dayLabelsRow"> 
                <th *ngFor="let day of [0, 1, 2, 3, 4, 5, 6]">
                    {{ getDayLabel(day) }}
                </th>
            </tr> 
        </thead> 
        <tbody>
            <tr *ngFor="let row of rows; let rowIndex = index;">
                <td *ngFor="let col of row let colIndex = index;"
                        [class.selected]="col.selected"
                        [class.off]="col.off"
                        (click)="selectDateFromTemplate(col, rowIndex, colIndex)">
                    <span>
                        <fk-day [date]="col"></fk-day>
                    </span>
                </td>
            </tr>
        </tbody>
    </table>
`;


@Component({
    selector: 'fk-datepicker',
    template: TEMPLATE,
    styles: [BS3_STYLES],
    directives: [DayComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit {
    
    @HostBinding('class.open') 
    @Input() private _open = false;

    private hostEvent: any = null;
    @HostListener('click', ['$event']) 
    private onClick (event: any) { this.hostEvent = event; }

    @HostListener('document:click', ['$event'])
    private onDocumentClick (event: any) {

        if (this._closeOnClickAway && event !== this.hostEvent) {
            this.close();
        }
    }

    @Output() selection: EventEmitter<Date> = new EventEmitter<Date>();
    @Output() toggle: EventEmitter<boolean> = new EventEmitter<boolean>();

    private _closeOnClickAway: boolean = false;
    @Input() closeOnClickAway: boolean = true;
    @Input() customClasses: DatePickerCustomClasses;
    @Input() useConfig: boolean = true;
    @Input() minDate: Date;
    @Input() maxDate: Date;
    @Input() initialDate: Date;

    @Input() set monthLabels (labels: MonthLabels) {

        this.months = Object.keys(labels).map((key: string) => labels[key]);
    }

    @Input() set dayLabels (labels: DayLabels) {

        this.days = Object.keys(labels).map((key: string) => labels[key]);
    }

    @Input() firstDayOfWeek: FirstDayOfWeek;

    private firstDayIndex: number;
    private days: string[];
    private months: string[];

    private rows: DateModel[][];
    private currentIndex: {i: number, j: number} = null;

    private _activeDate: Date;
    get activeDate (): Date { return this._activeDate; }

    constructor (
        @Optional() @Inject(FK_DATEPICKER_CONFIG) private config: FkDatepickerConfig,
        @Optional() @Self() private controlName: FormControlName,
        @Optional() @Self() private cd: NgModel
    ) {
        if (this.cd && this.controlName) {
            throw new Error('DatePickerComponent: Cannot have ngModel and formControlName on the same control');
        }
    }

    get control () {

        if (!this.controlName) {
            return null;
        }

        return this.controlName.control;
    }

    private initialize () {

        if (this.hasFormControl() && (this.control.value instanceof Date)) {
            this.initialDate = this.control.value;
        }

        if (this.cd && (this.cd.value instanceof Date)) {
            this.initialDate = this.cd.value;
        }

        if (this.useConfig) {

            this.initialDate = this.initialDate || this.config.initialDate || new Date();
            this.minDate = this.minDate || this.config.minDate;
            this.maxDate = this.maxDate || this.config.maxDate;
            this.firstDayOfWeek = this.firstDayOfWeek || this.config.firstDayOfWeek || 'su';
            this.customClasses = mergeCustomClasses(this.customClasses || this.config.customClasses);

            if (!this.months) {
                this.monthLabels = this.config.monthLabels || defaultMonthLabels;
            }

            if (!this.days) {
                this.dayLabels = this.config.dayLabels || defaultDayLabels;
            }
        }
        else {

            this.initialDate = this.initialDate || new Date();
            this.firstDayOfWeek = this.firstDayOfWeek || 'su';
            this.customClasses = mergeCustomClasses(this.customClasses);
            
            if (!this.months) {
                this.monthLabels = defaultMonthLabels;
            }

            if (!this.days) {
                this.dayLabels =  defaultDayLabels;
            }
        }

        if (!(this.initialDate instanceof Date)) {
            throw new Error('DatePickerComponent: initialDate must be an instance of Date');
        }
        
        if (this.minDate && this.maxDate && this.maxDate < this.minDate) {
            throw new Error('DatePickerComponent: minDate cannot be smaller than maxDate');
        }
    }

    ngOnInit () {

        if (!this.config) {
            this.useConfig = false;
        }

        this.initialize();

        this.firstDayIndex = getFirstDayOfWeekIndex(this.firstDayOfWeek);

        this.setDate(this.initialDate || new Date());
        this.refreshView();
        this.emitToggle();
    }

    public isOpen () {

        return this._open;
    }

    public open () {

        this._closeOnClickAway = false;
        if (!this._open) {
            this._open = true;
            this.emitToggle();

            if (this.closeOnClickAway) {
                // Wraps this on a setTimeout or it will never open
                setTimeout(() => this._closeOnClickAway = this._open, 0);
            }
        }
    }

    public close () {

        if (this._open) {
            this._open = false;
            this.emitToggle();

            // Mark as touched when it's closed
            if (this.hasFormControl()) {
                this.control.markAsTouched();
            }
        }
    }

    private hasFormControl () { return this.controlName && this.controlName.control; }
    private getDayLabel (index: number) { return this.days[(this.firstDayIndex + index) % 7]; }

    // Sets the current index of the selected day to retrieve it later
    private setCurrentIndex (i: number, j: number) { this.currentIndex = { i, j }; }

    // The setSelected method clones a day to rerender it.
    private setSelected (i: number, j: number, value: boolean) {

        this.rows[i][j] = this.rows[i][j].setSelected(value);
    }

    // Can probably make this better...
    // In the meantime, it works.
    private getNextDate (date: Date) {

        let nextDate: Date;
        if (checkDate(date, this.minDate, this.maxDate)) {
            nextDate = date;
        }
        else if (date < this.minDate) {

            if (sameMonthAndYear(date, this.minDate)) {
                nextDate = new Date(date.getFullYear(), date.getMonth(), this.minDate.getDate());
            }
            else {
                nextDate = this.minDate
            }
        }
        else if (date > this.maxDate) {

            if (sameMonthAndYear(date, this.maxDate)) {
                nextDate = new Date(date.getFullYear(), date.getMonth(), this.maxDate.getDate());
            }
            else {
                nextDate = this.maxDate;
            }
        }

        return nextDate;
    }

    // selectDate on click, it prevents selecting date if the day is off or selected
    private selectDateFromTemplate (dm: DateModel, i: number, j: number) {

        if (dm.off || dm.selected) {
            return;
        }

        this.selectDate(dm.date, i, j);
    }

    // Select date and change the current index if necessary
    private selectDate (date: Date, i?: number, j?: number) {

        this.setDate(date);

        // Only change the two days that are affected by this change
        if (typeof i !== 'undefined' && typeof j !== 'undefined') {
            this.setSelected(this.currentIndex.i, this.currentIndex.j, false);
            this.setSelected(i, j, true);
            this.setCurrentIndex(i, j);
        }
    }

    // step is -1 or 1
    private moveYear (step: number) {

        const currentYear = this.activeDate.getFullYear();

        const date = this.getNextDate(
            new Date(currentYear + step, this.activeDate.getMonth(), this.activeDate.getDate())
        );

        const refresh = !sameDate(date, this.activeDate);
        if (refresh) {
            this.selectDate(date);
            this.refreshView();
        }
    }

    // step is -1 or 1 
    private moveMonth (step: number) {

        const currentMonth = this.activeDate.getMonth();
        let newMonth = currentMonth + step;
        let newYear = this.activeDate.getFullYear();
        let newDay = this.activeDate.getDate();
        
        if (currentMonth === 0 && step === -1) {
            newMonth = 11;
            newYear -= 1;
        }
        else if (currentMonth === 11 && step === 1) {
            newMonth = 0;
            newYear += 1;
        }
        
        const date = this.getNextDate(
            new Date(newYear, newMonth, this.activeDate.getDate())
        );

        const refresh = !sameDate(date, this.activeDate);
        if (refresh) {
            this.selectDate(date);
            this.refreshView();
        }
    }

    private refreshView () {

        const count = 42;
        const { dates, selectedIndex } = getDates(this.activeDate, {
            count: count,
            minDate: this.minDate,
            maxDate: this.maxDate,
            firstDayOfWeek: this.firstDayOfWeek  
        });
        
        this.setCurrentIndex(Math.floor(selectedIndex / 7), selectedIndex % 7);
        this.rows = split(dates, 7);
    }

    private setDate (date: Date) {

        if (!this.activeDate || !sameDate(date, this.activeDate)) {
            this._activeDate = getRealDate(date);
            this.updateValue();
        }
    }

    private updateValue () {

        this.selection.emit(this.activeDate);

        if (this.cd) {
            this.cd.viewToModelUpdate(this.activeDate);

            if (!sameDate(this.initialDate, this.activeDate)) {
                this.cd.control.markAsDirty();
            }
        }

        if (this.hasFormControl()) {
            this.control.updateValue(this.activeDate);

            if (!sameDate(this.initialDate, this.activeDate)) {
                this.control.markAsDirty();
            }
        }
    }

    private emitToggle () { this.toggle.emit(this._open); }
}
