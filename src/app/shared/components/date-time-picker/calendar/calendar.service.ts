import { Injectable, inject } from '@angular/core';
import { DateService } from '../date.service';
import { CalendarDate, CalendarType } from '../models/calendar-types';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private dateService = inject(DateService);

  generateCalendarDays(
    currentMonth: Date,
    selectedDate: Date | null,
    minDate?: Date | null,
    maxDate?: Date | null
  ): CalendarDate[] {
    const calendarType = this.dateService.getCalendarType();
    const days =
      calendarType === 'jalali'
        ? this.generateJalaliCalendarDays(currentMonth)
        : this.generateGregorianCalendarDays(currentMonth);

    return days.map((date) =>
      this.createCalendarDate(
        date,
        currentMonth,
        selectedDate,
        minDate,
        maxDate
      )
    );
  }

  private createCalendarDate(
    date: Date,
    currentMonth: Date,
    selectedDate: Date | null,
    minDate?: Date | null,
    maxDate?: Date | null
  ): CalendarDate {
    return {
      date,
      dayNumber: this.dateService.getDayNumber(date),
      isCurrentMonth: this.dateService.isCurrentMonth(date, currentMonth),
      isDisabled: this.isDateDisabled(date, minDate, maxDate),
      isToday: this.dateService.isToday(date),
      isSelected: this.isSelectedDate(date, selectedDate),
      isWeekend: this.dateService.isWeekend(date),
      isFriday: this.dateService.isFriday(date),
    };
  }

  private generateGregorianCalendarDays(currentMonth: Date): Date[] {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  }

  private generateJalaliCalendarDays(currentMonth: Date): Date[] {
    const jalali = this.dateService.toJalali(currentMonth);
    const jy = jalali.jy;
    const jm = jalali.jm;

    const firstDayGregorian = this.dateService.toGregorian(jy, jm, 1);
    const firstDayOfWeek = firstDayGregorian.getDay();

    const startDate = new Date(firstDayGregorian);
    startDate.setDate(firstDayGregorian.getDate() - ((firstDayOfWeek + 1) % 7));

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  }

  private isDateDisabled(
    date: Date,
    minDate?: Date | null,
    maxDate?: Date | null
  ): boolean {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }

  private isSelectedDate(date: Date, selectedDate: Date | null): boolean {
    return selectedDate
      ? date.toDateString() === selectedDate.toDateString()
      : false;
  }

  getCalendarHeader(currentMonth: Date): string {
    const calendarType = this.dateService.getCalendarType();

    if (calendarType === 'jalali') {
      const jalali = this.dateService.toJalali(currentMonth);
      const monthName = this.dateService.getMonthName(jalali.jm);
      return `${monthName} ${jalali.jy}`;
    } else {
      return currentMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    }
  }

  getCalendarMonthName(currentMonth: Date): string {
    const calendarType = this.dateService.getCalendarType();

    if (calendarType === 'jalali') {
      const jalali = this.dateService.toJalali(currentMonth);
      return this.dateService.getMonthName(jalali.jm);
    } else {
      return currentMonth.toLocaleDateString('en-US', { month: 'long' });
    }
  }

  getCalendarYear(currentMonth: Date): number {
    const calendarType = this.dateService.getCalendarType();

    if (calendarType === 'jalali') {
      const jalali = this.dateService.toJalali(currentMonth);
      return jalali.jy;
    } else {
      return currentMonth.getFullYear();
    }
  }

  getCurrentYear(): number {
    const calendarType = this.dateService.getCalendarType();

    if (calendarType === 'jalali') {
      const jalali = this.dateService.toJalali(new Date());
      return jalali.jy;
    } else {
      return new Date().getFullYear();
    }
  }

  navigateMonth(currentMonth: Date, direction: 'previous' | 'next'): Date {
    const calendarType = this.dateService.getCalendarType();

    if (calendarType === 'jalali') {
      const jalali = this.dateService.toJalali(currentMonth);
      let newJm = direction === 'previous' ? jalali.jm - 1 : jalali.jm + 1;
      let newJy = jalali.jy;

      if (newJm < 1) {
        newJm = 12;
        newJy--;
      } else if (newJm > 12) {
        newJm = 1;
        newJy++;
      }

      return this.dateService.toGregorian(newJy, newJm, 1);
    } else {
      return new Date(
        currentMonth.getFullYear(),
        direction === 'previous'
          ? currentMonth.getMonth() - 1
          : currentMonth.getMonth() + 1,
        1
      );
    }
  }

  navigateYear(currentMonth: Date, direction: 'previous' | 'next'): Date {
    const calendarType = this.dateService.getCalendarType();

    if (calendarType === 'jalali') {
      const jalali = this.dateService.toJalali(currentMonth);
      const newJy = direction === 'previous' ? jalali.jy - 1 : jalali.jy + 1;
      return this.dateService.toGregorian(newJy, jalali.jm, 1);
    } else {
      return new Date(
        direction === 'previous'
          ? currentMonth.getFullYear() - 1
          : currentMonth.getFullYear() + 1,
        currentMonth.getMonth(),
        1
      );
    }
  }
}
