import { Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const DATE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateValueAccessor),
  multi: true
};

/* 
 * Value accessor for fk-datepicker.
 * It does nothing because there is no native element to write to.
 */
@Directive({
  selector: 'fk-datepicker[formControlName],fk-datepicker[ngModel]',
  providers: [DATE_VALUE_ACCESSOR]
})
export class DateValueAccessor implements ControlValueAccessor {
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue (value: any): void {}
  registerOnChange (fn: (_: any) => void) { this.onChange = fn; }
  registerOnTouched (fn: () => void) { this.onTouched = fn; }
}
