import { Component, input, output, OnInit, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-timer',
  standalone: true,
  templateUrl: './timer.html',
})
export class Timer implements OnInit, OnDestroy {
  seconds = input<number>(60);
  finished = output<void>();

  remaining = signal(0);
  private intervalId: any;
  private storageKey = 'app_timer_end';

  ngOnInit() {
    // ۱) بررسی کنیم قبلاً endTime ذخیره شده یا نه
    const savedEndTime = localStorage.getItem(this.storageKey);
    let endTime: number;

    if (savedEndTime) {
      endTime = parseInt(savedEndTime, 10);
    } else {
      endTime = Date.now() + this.seconds() * 1000;
      localStorage.setItem(this.storageKey, endTime.toString());
    }

    // ۲) آپدیت اولیه
    this.updateRemaining(endTime);

    // ۳) شروع شمارش
    this.startTimer(endTime);
  }

  private startTimer(endTime: number) {
    this.intervalId = setInterval(() => {
      this.updateRemaining(endTime);
    }, 1000);
  }

  private updateRemaining(endTime: number) {
    const diff = Math.floor((endTime - Date.now()) / 1000);

    if (diff <= 0) {
      this.remaining.set(0);
      this.finished.emit();
      this.stopTimer();
      localStorage.removeItem(this.storageKey);
    } else {
      this.remaining.set(diff);
    }
  }

  private stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  get formattedTime(): string {
    const total = this.remaining();
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
