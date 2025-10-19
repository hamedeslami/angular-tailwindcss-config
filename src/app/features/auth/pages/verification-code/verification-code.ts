import { Component, inject, signal } from '@angular/core';
import { AuthTextService } from '@features/auth/services/auth-text.service';
import { Button } from '@shared/components/button/button';
import { PinCodeInput } from '@shared/components/pin-code-input/pin-code-input';
import { Timer } from '@shared/components/timer/timer';

@Component({
  selector: 'app-verification-code',
  standalone: true,
  imports: [PinCodeInput, Timer, Button],
  templateUrl: './verification-code.html',
})
export class VerificationCode {
  private textService = inject(AuthTextService);
  readonly texts = this.textService.getTexts('verificationCode');

  pinCompleted: string = '';
  isShowResetMessage = signal<boolean>(false);

  onCodeCompleted(value: string) {
    this.pinCompleted = value;
  }

  onCodeCleared() {
  }

  isError(): boolean {
    return false;
  }

  errorMessage(): string {
    return '';
  }

  onTimerDone() {
    this.isShowResetMessage.set(true);
  }

  getVerificationCode() {
    this.isShowResetMessage.set(false);
  }

}
