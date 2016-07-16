# angular-fk-datepicker

This library is a fully Angular 2 datepicker. 

## Install

```
npm install angular-fk-datepicker
```

## Usage

The library has two main component, the main one is obviously the datepicker itself. The second one is the input of the datepicker.
By separating the two, you are able to use the datepicker in any way you want. It's not dependant on the input text.

The input can take a DateFormatter, it's an interface that has `format` function which takes a `Date` and returns a `string`.
By default, the formatter used does `Date#toLocaleString`.
For example, you can pass your own formatter which uses `moment` for advanced formatting.

**A word on styling**

For now by default the style uses `Bootstrap 3`. In the future, it will support custom classes/styles that can be applied to every
part of the datepicker.

```typescript
import { Component } from '@angular/core';
import { DatePickerComponent, DatePickerInputComponent } from 'angular-fk-datepicker';

...
@Component({
    ...
    directives: [DatePickerComponent, DatePickerInputComponent] // This will probably change in rc.5
})
export class A {}

```

```html

<fk-datepicker-input [formatter]="customFormatter">
    <fk-datepicker 
        [initialDate]="initialDate"
        [minDate]="minDate"
        [maxDate]="maxDate"
        firstDayOfWeek="mo">
    </fk-datepicker>
</fk-datepicker-input>
```

## Documentation

### DatePickerComponent

#### Properties

* `initialDate` (`Date`): The initial date selected by the datepicker. Default value is `new Date()`.
* `minDate` (`Date`): The minimum date that the datepicker can select. No default value.
* `maxDate` (`Date`): The maximum date that the datepicker can select. No default value.
* `firstDayOfWeek` (`string`): The initial date selected by the datepicker. Default value is `su` (sunday).
* `monthLabels` (`MonthLabels`): The labels for the months. Default values are the english months.
* `dayLabels` (`DayLabels`): The labels for the days. Default values are the english days.

#### Events

* `selection`: Event fired when a new date is selected. The event is fired a first time when the datepicker is created.

### DatePickerInputComponent

#### Properties

* `formatter` (`DateFormatter`): The date formatter that transforms the date to a custom format for the input.
* `customClasses` (`string`): Custom classes for the input. Default is `form-control`

### DateFormatter

Implement this interface to create your custom formatter;

```typescript
export interface DateFormatter {
    format (date: Date): string;
}
```

### MonthLabels

Create an object that implements this interface to pass your custom label names.

```typescript
import { MonthLabels } from 'angular-fk-datepicker';
```

```typescript
export interface MonthLabels {
    ['1']: string;
    ['2']: string;
    ['3']: string;
    ['4']: string;
    ['5']: string;
    ['6']: string;
    ['7']: string;
    ['8']: string;
    ['9']: string;
    ['10']: string;
    ['11']: string;
    ['12']: string;
}
```


### DayLabels

Create an object that implements this interface to pass your custom label names.

```typescript
import { DayLabels } from 'angular-fk-datepicker';
```

```typescript
export interface DayLabels {
    su: string;
    mo: string;
    tu: string;
    we: string;
    th: string;
    fr: string;
    sa: string;
}
```

## License

The MIT License (MIT)

Copyright (c) 2016 Florian Knop