import { Component, ElementRef, input, output, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-pin-code-input',
  standalone: true,
  templateUrl: './pin-code-input.html',
})
export class PinCodeInput {
  length = input<number>(6);
  startFromRight = input<boolean>(false);
  autoFocus = input<boolean>(true);
  error = input<boolean>(false);
  errorMessage = input<string>('');

  codeChanged = output<string>();
  codeCompleted = output<string>();
  codeCleared = output<void>();


  code: string[] = [];

  @ViewChildren('codeInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  ngOnInit() {
    this.code = Array(this.length()).fill('');
  }

  ngAfterViewInit() {
    if (this.autoFocus() && this.inputs.first) {
      this.inputs.first.nativeElement.focus();
    }
  }

  onKeyUp(event: KeyboardEvent, index: number) {
    const inputEl = event.target as HTMLInputElement;
    const value = inputEl.value.slice(-1);
    const arr = this.inputs.toArray();

    if (value.length > 0 && index < this.code.length - 1) {
      arr[index + 1].nativeElement.focus();
    } else if (value.length === 0 && event.key === 'Backspace' && index > 0) {
      arr[index - 1].nativeElement.focus();
    }

    this.code[index] = value;
    this.emitChanges();
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = (event.clipboardData || (window as any).clipboardData).getData('text');
    const digits: string[] = pasteData.replace(/\D/g, '').split('');

    const arr = this.inputs.toArray();

    digits.forEach((digit: string, i: number) => {
      if (arr[i]) {
        arr[i].nativeElement.value = digit.slice(0, 1);
        this.code[i] = digit.slice(0, 1);
      }
    });

    const lastPos = Math.min(digits.length, arr.length - 1);
    if (arr[lastPos]) {
      arr[lastPos].nativeElement.focus();
    }

    this.emitChanges();
  }

  private emitChanges() {
    const value = this.code.join('');
    this.codeChanged.emit(value);

    const isComplete = this.code.every(c => c !== '');
    if (isComplete) {
      this.codeCompleted.emit(value);
    }

    const isCleared = this.code.every(c => c === '');
    if (isCleared) {
      this.codeCleared.emit();
    }
  }
}
