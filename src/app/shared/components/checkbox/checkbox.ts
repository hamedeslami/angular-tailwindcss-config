import { CommonModule } from '@angular/common';
import { Component, input, output, model } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  imports: [CommonModule],
  templateUrl: './checkbox.html',
})
export class Checkbox {

  label = input<string>('');
  checked = model(false);
  className = input<string>('');
  id = input<string>('');
  disabled = input<boolean>(false);
  checkedChange = output<boolean>();

  onChange(event: Event) {
    if (this.disabled()) return;
    
    const input = event.target as HTMLInputElement;
    this.checked.set(input.checked);
    this.checkedChange.emit(input.checked);
  }
}



