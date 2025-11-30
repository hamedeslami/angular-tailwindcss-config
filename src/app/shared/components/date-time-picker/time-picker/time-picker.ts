import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { DateService } from '../date.service';
import { LangService } from '@core/services/lang.service';
import { TimeSelection } from '../models/calendar-types';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.html'
})
export class TimePicker implements OnInit, OnChanges {
  @Input() selectedTime: string = '';
  @Input() is24Hour: boolean = false;
  @Output() timeSelected = new EventEmitter<TimeSelection>();
  @Output() timeFormatToggled = new EventEmitter<void>();

  // Time selection state
  selectedHour: number = 0;
  selectedMinute: number = 0;
  isPm: boolean = false;

  // Scrollable lists
  hours: number[] = [];
  minutes: number[] = [];

  private dateService = inject(DateService);
  private langService = inject(LangService);

  ngOnInit() {
    this.initializeSelection();
    this.updateHoursList();
    this.updateMinutesList();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedTime'] || changes['is24Hour']) {
      this.initializeSelection();
      this.updateHoursList();
      this.updateMinutesList();
    }
  }

  private initializeSelection(): void {
    if (this.selectedTime) {
      const [hours, minutes] = this.selectedTime.split(':').map(Number);
      this.selectedHour = hours;
      this.selectedMinute = minutes;
      this.isPm = hours >= 12;
    } else {
      const now = new Date();
      this.selectedHour = now.getHours();
      this.selectedMinute = now.getMinutes();
      this.isPm = this.selectedHour >= 12;
    }
  }

  private updateHoursList(): void {
    this.hours = Array.from({ length: 24 }, (_, i) => i);
  }

  private updateMinutesList(): void {
    this.minutes = Array.from({ length: 60 }, (_, i) => i);
  }

  // Time selection
  selectTime(hour: number, minute: number): void {
    // Convert to 24-hour format if needed
    let finalHour = hour;
    if (!this.is24Hour && this.isPm && hour !== 12) {
      finalHour += 12;
    } else if (!this.is24Hour && !this.isPm && hour === 12) {
      finalHour = 0;
    }

    this.selectedHour = finalHour;
    this.selectedMinute = minute;
    // Don't emit here, only when confirm is clicked
  }

  // AM/PM toggle
  toggleAmPm(): void {
    this.isPm = !this.isPm;
    // Update the time with new AM/PM setting
    this.selectTime(this.getDisplayHourAsNumber(), this.selectedMinute);
  }

  // Input handlers
  onHourInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let hour = parseInt(input.value, 10);

    if (isNaN(hour)) return;

    // Validate range based on 12/24 hour format
    if (this.is24Hour) {
      if (hour < 0) hour = 0;
      if (hour > 23) hour = 23;
    } else {
      if (hour < 1) hour = 1;
      if (hour > 12) hour = 12;
    }

    // Update input value with leading zero for single digits
    input.value = hour.toString().padStart(2, '0');
    this.selectTime(hour, this.selectedMinute);
  }

  onMinuteInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let minute = parseInt(input.value, 10);

    if (isNaN(minute)) return;

    // Validate range
    if (minute < 0) minute = 0;
    if (minute > 59) minute = 59;

    // Update input value with leading zero
    input.value = minute.toString().padStart(2, '0');
    this.selectTime(this.getDisplayHourAsNumber(), minute);
  }

  // Display methods
  getDisplayHour(): string {
    let displayHour: number;
    
    if (this.is24Hour) {
      displayHour = this.selectedHour;
    } else {
      displayHour = this.selectedHour;
      if (displayHour === 0) {
        displayHour = 12;
      } else if (displayHour > 12) {
        displayHour -= 12;
      }
    }
    
    return displayHour.toString().padStart(2, '0');
  }

  // Helper method to convert display hour back to number
  getDisplayHourAsNumber(): number {
    const displayHour = this.getDisplayHour();
    return parseInt(displayHour, 10);
  }

  getDisplayTime(): string {
    const hour = this.getDisplayHour();
    const minute = this.selectedMinute.toString().padStart(2, '0');
    const ampm = this.is24Hour ? '' : (this.isPm ? ' PM' : ' AM');

    return `${hour}:${minute}${ampm}`;
  }

  // Style methods
  getHourButtonClasses(hour: number): string {
    const baseClasses = 'w-full py-1.5 text-xs rounded transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500';
    const currentHour = this.getDisplayHourAsNumber();

    if (currentHour === hour) {
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    }

    return `${baseClasses} text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600`;
  }

  getMinuteButtonClasses(minute: number): string {
    const baseClasses = 'w-full py-1.5 text-xs rounded transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500';

    if (this.selectedMinute === minute) {
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    }

    return `${baseClasses} text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600`;
  }

  getAmPmButtonClasses(): string {
    const baseClasses = 'px-6 py-3 text-base font-medium rounded-lg transition-all duration-200';

    if (this.isPm) {
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    }

    return `${baseClasses} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600`;
  }

  // Action methods
  confirmSelection(): void {
    this.emitTimeSelection();
  }

  cancelSelection(): void {
    this.timeSelected.emit({ hour: -1, minute: -1 });
  }

  private emitTimeSelection(): void {
    this.timeSelected.emit({
      hour: this.selectedHour,
      minute: this.selectedMinute
    });
  }

  get isRTL(): boolean {
    return this.langService.dir() === 'rtl';
  }
}