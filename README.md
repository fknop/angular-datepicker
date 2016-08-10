[![NPM Version](https://img.shields.io/npm/v/angular-fk-datepicker.svg)](https://npmjs.com/package/angular-fk-datepicker)

# angular-fk-datepicker

This library is a fully Angular 2 datepicker. 

Click [here](http://plnkr.co/edit/ATA8TRRG95mVHof4yntb?p=preview) for a demo.

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

By default the style uses `Bootstrap 3`. It supports basic custom classes to apply custom styles. See **DatePickerCustomClasses**.

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
* `customClasses` (`DatePickerCustomClasses`): Custom classes for the datepicker elements. See defaults below.
* `closeOnClickAway` (`boolean`): Close the datepicker when clicking away. Default is true.
* `useConfig` (`boolean`): Since 1.2.0, you can set it to false to ignore global configuration object.

#### Events

* `selection` (`Date`): Event fired when a new date is selected. The event is fired a first time when the datepicker is created.
* `toggle` (`boolean`): Event fired when the datepicker is opened or closed. True if open, false if closed.

#### FormControlName

The datepicker supports the `formControlName` directive. Just set `formControlName` with the name of your 
control like any other control. If a value is already present in the control, it will set it as initial value.
When the value is updated the control is also updated and set to dirty. It is set to `touched` as soon as the datepicker
is closed.

### NgModel

The datepicker also supports NgModel, which is the alternative to FormControlName.

#### DatePickerCustomClasses

The interface for the custom classes is:

```typescript
export interface DatePickerCustomClasses {
    mergeWithDefaults?: boolean;
    table?: string;
    headerRow?: string;
    dayLabelsRow?: string;
    month?: string;
    year?: string;
    previousIcon?: string;
    nextIcon?: string;
}
```

The defaults are:

```typescript
export const defaultClasses: DatePickerCustomClasses = {
    table: 'calendar',
    previousIcon: 'glyphicon glyphicon-chevron-left',
    nextIcon: 'glyphicon glyphicon-chevron-right',
    headerRow: 'months-header',
    dayLabelsRow: 'days-header',
    month: 'month',
    year: 'year'
};
```

If you set `mergeWithDefaults` to true, it will override the defaults, otherwise it will not take any default values.
If you change the table class, don't forget to add the styles for the `selected` day, etc. See the default styles in the 
[datepicker.component.ts](./src/datepicker.component.ts) file.


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

### Global configuration object

It's possible since `1.2.0` to configure the datepicker with a global configuration object. 

The configuration interface is FkDatePickerConfig:

```typescript
export interface FkDatePickerConfig {
    minDate?: Date;
    maxDate?: Date;
    initialDate?: Date;
    monthLabels?: MonthLabels;
    dayLabels?: DayLabels;
    firstDayOfWeek?: FirstDayOfWeek;
    formatter: DateFormatter; // Since 1.3.2
}
```

Example (RC.5)

```typescript

import { NgModule } from '@angular/core';
import { FkDatePickerModule } from 'angular-fk-datepicker';

@NgModule({
    imports: [FkDatePickerModule]
})
export class ModuleWithoutConfig {}

@NgModule({
    imports: [
        FkDatePickerModule.withConfig({
            initialDate: new Date(2016, 08, 27)
        });
    ]
})
export class ModuleWithConfig {}

```

If you need to provide a configuration at the component level, you can still use the `fkDatePickerConfigProvider`.



Example (RC.4 - DEPRECATED - WILL BE REMOVED IN RC.6):

```typescript
import { fkDatePickerProviders } from 'angular-fk-datepicker';

// The fkDatePickerProviders also includes with the configuration object, the components as platform directives.
// It will change in rc.5 to NgModule.
// If you only need to provide a configuration, import fkDatePickerConfigProvider
bootstrap(AppComponent, [
    fkDatePickerProviders({
        initialDate: new Date(2016, 08, 27) // All datepicker that do not override initialDate will have this one
    })
]);
```

How this works: 

* If the value is passed by data-binding, it will override the configuration.
* If `useConfig` is set to true (which is the default), the datepicker will look for the value in the configuration object.
* If the value is absent, it will set the default, for example, date of day for `initialDate`.


## License

The MIT License (MIT)

Copyright (c) 2016 Florian Knop
