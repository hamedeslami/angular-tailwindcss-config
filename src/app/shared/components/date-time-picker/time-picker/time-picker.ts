import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { DateService } from '../date.service';
import { LangService } from '@core/services/lang.service';
import { TimeSelection } from '../models/calendar-types';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.html',
})
export class TimePicker implements OnInit, OnChanges {
  @Input() selectedTime: string = '';
  @Input() is24Hour: boolean = true;
  @Output() timeSelected = new EventEmitter<TimeSelection>();
  @Output() timeFormatToggled = new EventEmitter<void>();

  hours: number[] = [];
  minutes: number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  private dateService = inject(DateService);
  private langService = inject(LangService);

  ngOnInit() {
    this.updateHoursList();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['is24Hour']) {
      this.updateHoursList();
    }
  }

  selectTime(hour: number, minute: number): void {
    this.timeSelected.emit({ hour, minute });
  }

  toggleTimeFormat(): void {
    this.timeFormatToggled.emit();
  }

  private updateHoursList(): void {
    this.hours = this.is24Hour
      ? Array.from({ length: 24 }, (_, i) => i)
      : Array.from({ length: 12 }, (_, i) => i + 1);
  }

  getCurrentHour(): number {
    if (!this.selectedTime) return new Date().getHours();
    const timeParts = this.selectedTime.split(':');
    return timeParts.length > 0 ? Number(timeParts[0]) : new Date().getHours();
  }

  getCurrentMinute(): number {
    if (!this.selectedTime) return 0;
    const timeParts = this.selectedTime.split(':');
    return timeParts.length > 1 ? Number(timeParts[1]) : 0;
  }

  getHourLabel(hour: number): string {
    return this.dateService.getHourLabel(hour, this.is24Hour);
  }

  getTimeButtonClasses(value: number, type: 'hour' | 'minute'): string {
    const baseClasses =
      'w-full py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
    const currentValue =
      type === 'hour' ? this.getCurrentHour() : this.getCurrentMinute();

    if (currentValue === value) {
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    }

    return `${baseClasses} text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600`;
  }

  get isRTL(): boolean {
    return this.langService.dir() === 'rtl';
  }
}
