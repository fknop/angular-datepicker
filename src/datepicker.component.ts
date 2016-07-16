import { Component, ChangeDetectionStrategy, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { 
    checkDate, 
    getDates, 
    getFirstDayOfWeekIndex,
    getRealDate, 
    sameDate,
    sameMonthAndYear,
    split
} from './facade';

import { DateModel } from './date-model';
import {
     DayLabels, 
     defaultDayLabels, 
     defaultMonthLabels,
     FirstDayOfWeek, 
     MonthLabels
} from './interfaces';

import { DayComponent } from './day.component';

const DEFAULT_STYLES: string = `
    :host {
        position: absolute;
        z-index: 1000;
        display: none;
        float: left;
        min-width: 296px;
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

    :host > table.calendar > tbody > tr > td.off {
        color: #999999;
        pointer-events: none;
        cursor: default;
    }

    :host > table.calendar > tbody > tr > td:not(.off):not(.selected):hover {
        color: #262626;
        cursor: pointer;
        background-color: #f5f5f5;
    }


    :host.open > .datepicker, :host.open {
        display: block;
    }
`;

const TEMPLATE: string = `
    <table class="table calendar table-bordered">
        <thead> 
            <tr class="months-header"> 
                <th class="month" colspan="4"> 
                    <a class="previous" (click)="moveMonth(-1)">
                        <i class="glyphicon glyphicon-chevron-left"></i>
                    </a> 
                    <span>
                        {{ months[activeDate.getMonth()] }}
                    </span> 
                    <a class="next" (click)="moveMonth(1)">
                        <i class="glyphicon glyphicon-chevron-right"></i>
                    </a> 
                </th> 
                <th class="year" colspan="3"> 
                    <a class="previous" (click)="moveYear(-1)">
                        <i class="glyphicon glyphicon-chevron-left"></i>
                    </a> 
                    <span>
                        {{ activeDate.getFullYear() }}
                    </span> 
                    <a class="next" (click)="moveYear(1)">
                        <i class="glyphicon glyphicon-chevron-right"></i>
                    </a> 
                </th> 
            </tr> 
            <tr class="days-header"> 
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
                        (click)="selectDate(col.date, rowIndex, colIndex)">
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
    styles: [DEFAULT_STYLES],
    directives: [DayComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit {
    
    @HostBinding('class.open') @Input() public open = false;
    @Output() selection: EventEmitter<Date> = new EventEmitter<Date>();

    @Input() minDate: Date;
    @Input() maxDate: Date;
    @Input() initialDate: Date = new Date();

    @Input() set monthLabels (labels: MonthLabels) {

        this.months = Object.keys(labels).map((key: string) => labels[key]);
    }

    @Input() set dayLabels (labels: DayLabels) {

        this.days = Object.keys(labels).map((key: string) => labels[key]);
    }

    @Input() firstDayOfWeek: FirstDayOfWeek = 'su';

    private firstDayIndex: number;
    private days: string[];
    private months: string[];

    private rows: DateModel[][];
    private currentIndex: {i: number, j: number} = null;

    private _activeDate: Date;
    get activeDate (): Date {

        return this._activeDate;
    }

    constructor (/* Future configuration object */) {}

    ngOnInit () {

        if (this.minDate && this.maxDate && this.maxDate < this.minDate) {
            throw new Error('DatePicker: minDate cannot be smaller than maxDate');
        }

        if (!this.months) {
            this.monthLabels = defaultMonthLabels;
        }

        if (!this.days) {
            this.dayLabels = defaultDayLabels;
        }

        this.firstDayIndex = getFirstDayOfWeekIndex(this.firstDayOfWeek);

        this.setDate(this.initialDate || new Date());
        this.refreshView();
    }

    private getDayLabel (index: number) {

        return this.days[(this.firstDayIndex + index) % 7];
    }

    // Sets the current index of the selected day to retrieve it later
    private setCurrentIndex (i: number, j: number) {

        this.currentIndex = {
            i: i,
            j: j
        };
    }

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

        // May update a FormControl later...
        
        this.selection.emit(this.activeDate);
    }
}
