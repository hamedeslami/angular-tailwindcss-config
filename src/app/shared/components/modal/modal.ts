import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [NgClass],
  templateUrl: './modal.html',
})
export class Modal {
  isOpen = input<boolean>(false);
  isHeader = input<boolean>(false);
  isFooter = input<boolean>(false);
  title = input<string>('');
  size = input<'sm' | 'md' | 'lg' | 'xl' | '2xl' | '2xlg'>('sm');
  variant = input<'normal' | 'success' | 'error'>('normal');
  close = output<void>();

  onClose() {
    this.close.emit();
  }

  preventClose(event: MouseEvent) {
    event.stopPropagation();
  }
}
