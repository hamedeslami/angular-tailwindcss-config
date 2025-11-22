import { CommonModule, NgClass } from '@angular/common';
import { Component, Input, Output, EventEmitter, input, output } from '@angular/core';
import { Spinner } from '../spinner/spinner';

@Component({
  selector: 'app-button',
  imports: [Spinner, NgClass],
  templateUrl: './button.html',
})
export class Button {
  variant = input<'contained' | 'outline' | 'text'>('contained');
  icon = input<string>();
  className = input<string>('');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  onClick = output<MouseEvent>();

  handleClick(event: MouseEvent) {
    this.onClick.emit(event);
  }

}
