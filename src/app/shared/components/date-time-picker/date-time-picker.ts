import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  OnDestroy,
  inject,
  effect,
  HostListener,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { format, isValid, startOfDay, setHours, setMinutes } from 'date-fns';
import { DateService } from './date.service';
import { LangService } from '@core/services/lang.service';
import { CalendarService } from './calendar/calendar.service';
import {
  PickerMode,
  CalendarView,
  TimeSelection,
} from './models/calendar-types';
import { TimePicker } from './time-picker/time-picker';
import { YearSelector } from './calendar/year-selector/year-selector';
import { MonthSelector } from './calendar/month-selector/month-selector';
import { Calendar } from './calendar/calendar';


@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.html',
  imports: [
    TimePicker,
    YearSelector,
    MonthSelector,
    Calendar,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true,
    },
  ],
})
export class DateTimePickerComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() dateFormat: string = 'auto';
  @Input() timeFormat: string = 'auto';
  @Input() mode: PickerMode = 'both';
  @Input() placeholder: string = 'Select date and time';
  @Input() disabled: boolean = false;
  @Output() dateTimeChange = new EventEmitter<Date | null>();

  // State management
  selectedDate: Date | null = null;
  selectedTime: string = '';
  showPicker: boolean = false;
  showTimeSection: boolean = false;
  is24Hour: boolean = true;
  currentView: CalendarView = 'calendar';
  currentMonth: Date = new Date();

  // Services
  private dateService = inject(DateService);
  private langService = inject(LangService);
  private calendarService = inject(CalendarService);

  // ControlValueAccessor
  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};
  private langEffect: any;

  constructor() {
    this.langEffect = effect(() => {
      const lang = this.langService.lang();
      // Refresh when language changes
    });
  }

  ngOnInit() {
    if (this.mode === 'time') {
      this.showTimeSection = true;
    }
  }

  ngOnDestroy() {
    if (this.langEffect) {
      this.langEffect.destroy();
    }
  }

  writeValue(value: any): void {
    if (value instanceof Date && isValid(value)) {
      this.selectedDate = value;
      this.selectedTime = format(value, 'HH:mm');
    } else if (value === null || value === undefined) {
      this.selectedDate = null;
      this.selectedTime = '';
    } else if (typeof value === 'string') {
      const date = new Date(value);
      if (isValid(date)) {
        this.selectedDate = date;
        this.selectedTime = format(date, 'HH:mm');
      } else {
        this.selectedDate = null;
        this.selectedTime = '';
      }
    } else {
      this.selectedDate = null;
      this.selectedTime = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Date selection handlers
  onDateSelected(date: Date): void {
    let newDate: Date;

    if (this.selectedDate && this.selectedTime) {
      const [hours, minutes] = this.selectedTime.split(':').map(Number);
      newDate = setHours(setMinutes(date, minutes), hours);
    } else {
      newDate = startOfDay(date);
    }

    this.selectedDate = newDate;

    if (this.mode === 'both') {
      this.showTimeSection = true;
    } else {
      this.showPicker = false;
    }

    this.updateValue();
  }

  onTimeSelected(time: TimeSelection): void {
    this.selectedTime = `${time.hour.toString().padStart(2, '0')}:${time.minute
      .toString()
      .padStart(2, '0')}`;

    let newDate: Date;
    if (this.selectedDate) {
      newDate = setHours(setMinutes(this.selectedDate, time.minute), time.hour);
    } else {
      const today = new Date();
      newDate = setHours(setMinutes(today, time.minute), time.hour);
    }

    this.selectedDate = newDate;
    this.showPicker = false;
    this.showTimeSection = false;
    this.updateValue();
  }

  onMonthSelected(month: number): void {
    const calendarType = this.dateService.getCalendarType();

    if (calendarType === 'jalali') {
      const jalali = this.dateService.toJalali(this.currentMonth);
      this.currentMonth = this.dateService.toGregorian(jalali.jy, month, 1);
    } else {
      this.currentMonth = new Date(
        this.currentMonth.getFullYear(),
        month - 1,
        1
      );
    }

    this.backToCalendar();
  }

  onYearSelected(year: number): void {
    const calendarType = this.dateService.getCalendarType();

    if (calendarType === 'jalali') {
      const jalali = this.dateService.toJalali(this.currentMonth);
      this.currentMonth = this.dateService.toGregorian(year, jalali.jm, 1);
    } else {
      this.currentMonth = new Date(year, this.currentMonth.getMonth(), 1);
    }

    this.backToCalendar();
  }

  onViewChange(view: CalendarView): void {
    this.currentView = view;
  }

  onTimeFormatToggled(): void {
    this.is24Hour = !this.is24Hour;
  }

  // UI actions
  togglePicker(): void {
    if (this.disabled) return;

    this.showPicker = !this.showPicker;

    if (this.showPicker) {
      this.backToCalendar();
      if (this.mode === 'time') {
        this.showTimeSection = true;
      } else if (this.mode === 'both') {
        this.showTimeSection = false;
      }
    }
  }

  closePicker(): void {
    this.showPicker = false;
    this.showTimeSection = false;
  }

  backToCalendar(): void {
    this.currentView = 'calendar';
  }

  clearSelection(): void {
    this.selectedDate = null;
    this.selectedTime = '';
    this.updateValue();
  }

  selectToday(): void {
    this.backToCalendar();
    const today = new Date();
    const calendarType = this.dateService.getCalendarType();

    if (calendarType === 'jalali') {
      const jalaliToday = this.dateService.toJalali(today);
      this.currentMonth = this.dateService.toGregorian(
        jalaliToday.jy,
        jalaliToday.jm,
        1
      );
    } else {
      this.currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    this.selectTodayDate(today);
  }

  private selectTodayDate(date: Date): void {
    let newDate: Date;
    if (this.selectedDate && this.selectedTime) {
      const [hours, minutes] = this.selectedTime.split(':').map(Number);
      newDate = setHours(setMinutes(date, minutes), hours);
    } else {
      newDate = startOfDay(date);
    }
    this.selectedDate = newDate;
    if (this.mode === 'both') {
      this.showTimeSection = true;
    }
    this.updateValue();
  }

  // Value management
  private updateValue(): void {
    this.onChange(this.selectedDate);
    this.onTouched();
    this.dateTimeChange.emit(this.selectedDate);
  }

  private getEffectiveDateFormat(): string {
    if (this.dateFormat !== 'auto') return this.dateFormat;
    return this.dateService.getCalendarType() === 'jalali'
      ? 'yyyy/MM/dd'
      : 'MM/dd/yyyy';
  }

  private getEffectiveTimeFormat(): string {
    if (this.timeFormat !== 'auto') return this.timeFormat;
    return this.is24Hour ? 'HH:mm' : 'hh:mm a';
  }

  get displayValue(): string {
    if (!this.selectedDate) return '';

    const dateFormat = this.getEffectiveDateFormat();
    const timeFormat = this.getEffectiveTimeFormat();

    switch (this.mode) {
      case 'date':
        return this.dateService.formatDate(this.selectedDate, dateFormat);
      case 'time':
        return this.dateService.formatDate(this.selectedDate, timeFormat);
      case 'both':
        return `${this.dateService.formatDate(
          this.selectedDate,
          dateFormat
        )} ${this.dateService.formatDate(this.selectedDate, timeFormat)}`;
      default:
        return '';
    }
  }

  get isRTL(): boolean {
    return this.langService.dir() === 'rtl';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative') && this.showPicker) {
      this.closePicker();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event) {
    if (this.currentView !== 'calendar') {
      this.backToCalendar();
    } else if (this.showPicker) {
      this.closePicker();
    }
  }
}
