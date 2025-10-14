import { NgClass } from '@angular/common';
import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-floating-label',
  imports: [NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FloatingLabel),
      multi: true,
    },
  ],
  templateUrl: './floating-label.html',
})
export class FloatingLabel {
  label = input<string>('');
  id = input<string>('');
  error = input<boolean>(false);
  errorMessage = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  inputmode = input<'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'>('text');
  maxlength = input<number>(500);


  value: string = '';

  onChange = (value: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleInput(event: any) {
    const val = event.target.value;
    this.value = val;
    this.onChange(val);
  }
}
