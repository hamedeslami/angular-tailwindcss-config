import { Component, inject, signal } from '@angular/core';
import { TextService } from '@core/services/text.service';
import { AUTH_TEXTS } from '@features/auth/content/auth.texts';
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
  private textService = inject(TextService);
  readonly texts = this.textService.getTexts(AUTH_TEXTS, 'verificationCode');

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
