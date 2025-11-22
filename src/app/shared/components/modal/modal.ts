import { NgClass } from '@angular/common';
import { Component, ElementRef, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [NgClass],
  templateUrl: './modal.html',
})
export class Modal {
  isOpen = input<boolean>(false);
  title = input<string>('');
  size = input<'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'>('sm');
  className = input<string>('');
  showCloseButton = input<boolean>(true);
  close = output<void>();



  constructor(private el: ElementRef) { }

  ngOnInit() {
    if (this.isOpen()) {
      document.body.style.overflow = 'hidden';
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = 'unset';
  }

  ngOnChanges() {
    document.body.style.overflow = this.isOpen() ? 'hidden' : 'unset';
  }

  onBackdropClick(event: MouseEvent) {
    this.close.emit();
  }

  onContentClick(event: MouseEvent) {
    event.stopPropagation();
  }

  @HostListener('document:keydown.escape', ['$event']) onEscape(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (this.isOpen()) {
      this.close.emit();
    }
  }
}