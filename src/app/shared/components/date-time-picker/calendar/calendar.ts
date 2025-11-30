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
import { CalendarService } from './calendar.service';
import { DateService } from '../date.service';
import { LangService } from '@core/services/lang.service';
import {
  CalendarDate,
  CalendarView,
  MonthInfo,
} from '../models/calendar-types';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.html',
})
export class Calendar implements OnInit, OnChanges {
  @Input() currentMonth!: Date;
  @Input() selectedDate: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() viewChange = new EventEmitter<CalendarView>();

  calendarDays: CalendarDate[] = [];
  weekDays: string[] = [];
  currentView: CalendarView = 'calendar';

  private calendarService = inject(CalendarService);
  private dateService = inject(DateService);
  private langService = inject(LangService);

  ngOnInit() {
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['currentMonth'] ||
      changes['selectedDate'] ||
      changes['minDate'] ||
      changes['maxDate']
    ) {
      this.generateCalendar();
    }
  }

  private generateCalendar(): void {
    this.calendarDays = this.calendarService.generateCalendarDays(
      this.currentMonth,
      this.selectedDate,
      this.minDate,
      this.maxDate
    );
    this.weekDays = this.dateService.getWeekDays();
  }

  selectDate(date: Date): void {
    const calendarDate = this.calendarDays.find(
      (d) => d.date.getTime() === date.getTime()
    );
    if (
      calendarDate &&
      !calendarDate.isDisabled &&
      calendarDate.isCurrentMonth
    ) {
      this.dateSelected.emit(date);
    }
  }

  previousMonth(): void {
    this.currentMonth = this.calendarService.navigateMonth(
      this.currentMonth,
      'previous'
    );
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = this.calendarService.navigateMonth(
      this.currentMonth,
      'next'
    );
    this.generateCalendar();
  }

  previousYear(): void {
    this.currentMonth = this.calendarService.navigateYear(
      this.currentMonth,
      'previous'
    );
    this.generateCalendar();
  }

  nextYear(): void {
    this.currentMonth = this.calendarService.navigateYear(
      this.currentMonth,
      'next'
    );
    this.generateCalendar();
  }

  showMonthSelection(): void {
    this.currentView = 'month';
    this.viewChange.emit(this.currentView);
  }

  showYearSelection(): void {
    this.currentView = 'year';
    this.viewChange.emit(this.currentView);
  }

  backToCalendar(): void {
    this.currentView = 'calendar';
    this.viewChange.emit(this.currentView);
  }

  getCalendarHeader(): string {
    return this.calendarService.getCalendarHeader(this.currentMonth);
  }

  getCalendarMonthName(): string {
    return this.calendarService.getCalendarMonthName(this.currentMonth);
  }

  getCalendarYear(): number {
    return this.calendarService.getCalendarYear(this.currentMonth);
  }

  getDayClasses(day: CalendarDate): string {
    const baseClasses =
      'w-8 h-8 bg-gray-100 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';

    if (!day.isCurrentMonth || day.isDisabled) {
      return `${baseClasses} text-gray-400 dark:text-gray-500 cursor-not-allowed`;
    }

    if (day.isFriday) {
      if (day.isSelected) {
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
      }

      if (day.isToday) {
        return `${baseClasses} bg-blue-100 text-red-600 dark:bg-blue-900 dark:text-red-400 hover:bg-blue-200 dark:hover:bg-blue-800 border border-red-500`;
      }

      return `${baseClasses} text-red-600 cursor-pointer dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600`;
    }

    if (day.isSelected) {
      return `${baseClasses} !bg-blue-600 text-white hover:bg-blue-700 cursor-pointer`;
    }

    if (day.isToday) {
      return `${baseClasses} bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer`;
    }

    return `${baseClasses} text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer`;
  }

  get isRTL(): boolean {
    return this.langService.dir() === 'rtl';
  }
}
