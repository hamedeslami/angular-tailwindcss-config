import { Injectable, inject } from '@angular/core';
import { LangService } from '@core/services/lang.service';
import { toJalaali, toGregorian, isValidJalaaliDate } from 'jalaali-js';
import { CalendarType, MonthInfo } from './models/calendar-types';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private langService = inject(LangService);

  private readonly PERSIAN_MONTHS = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];

  private readonly ENGLISH_MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  private readonly PERSIAN_WEEK_DAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  private readonly ENGLISH_WEEK_DAYS = [
    'Su',
    'Mo',
    'Tu',
    'We',
    'Th',
    'Fr',
    'Sa',
  ];

  getCalendarType(): CalendarType {
    return this.langService.calendarType();
  }

  toJalali(date: Date): { jy: number; jm: number; jd: number } {
    return toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  toGregorian(jy: number, jm: number, jd: number): Date {
    const gregorian = toGregorian(jy, jm, jd);
    return new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd);
  }

  formatDate(date: Date, format: string = 'yyyy/MM/dd'): string {
    if (this.getCalendarType() === 'jalali') {
      const jalali = this.toJalali(date);
      return this.formatJalaliDate(jalali, format);
    } else {
      return this.formatGregorianDate(date, format);
    }
  }

  getMonthName(month: number): string {
    const months =
      this.getCalendarType() === 'jalali'
        ? this.PERSIAN_MONTHS
        : this.ENGLISH_MONTHS;
    return months[month - 1] || '';
  }

  getWeekDays(): string[] {
    return this.getCalendarType() === 'jalali'
      ? this.PERSIAN_WEEK_DAYS
      : this.ENGLISH_WEEK_DAYS;
  }

  getMonthsList(): MonthInfo[] {
    return Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      name: this.getMonthName(i + 1),
    }));
  }

  isValidDate(year: number, month: number, day: number): boolean {
    if (this.getCalendarType() === 'jalali') {
      return isValidJalaaliDate(year, month, day);
    } else {
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    }
  }

  getDaysInMonth(year: number, month: number): number {
    if (this.getCalendarType() === 'jalali') {
      if (month <= 6) return 31;
      if (month <= 11) return 30;
      return this.isJalaliLeapYear(year) ? 30 : 29;
    } else {
      return new Date(year, month, 0).getDate();
    }
  }

  isCurrentMonth(date: Date, currentMonth: Date): boolean {
    const calendarType = this.getCalendarType();

    if (calendarType === 'jalali') {
      const currentJalali = this.toJalali(currentMonth);
      const dateJalali = this.toJalali(date);
      return (
        currentJalali.jy === dateJalali.jy && currentJalali.jm === dateJalali.jm
      );
    } else {
      return (
        date.getMonth() === currentMonth.getMonth() &&
        date.getFullYear() === currentMonth.getFullYear()
      );
    }
  }

  getDayNumber(date: Date): number {
    const calendarType = this.getCalendarType();

    if (calendarType === 'jalali') {
      const jalali = this.toJalali(date);
      return jalali.jd;
    } else {
      return date.getDate();
    }
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  isFriday(date: Date): boolean {
    return date.getDay() === 5;
  }

  isWeekend(date: Date): boolean {
    const calendarType = this.getCalendarType();
    return calendarType === 'jalali'
      ? date.getDay() === 5
      : date.getDay() === 0 || date.getDay() === 6;
  }

  getHourLabel(hour: number, is24Hour: boolean): string {
    if (is24Hour) {
      return hour.toString().padStart(2, '0');
    } else {
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour < 12 ? 'AM' : 'PM';
      return `${displayHour.toString().padStart(2, '0')} ${period}`;
    }
  }

  private isJalaliLeapYear(jy: number): boolean {
    return (
      ((((jy - (jy > 0 ? 474 : 473)) % 2820) + 474 + 38) * 682) % 2816 < 682
    );
  }

  private formatJalaliDate(
    jalali: { jy: number; jm: number; jd: number },
    format: string
  ): string {
    let result = format;

    result = result.replace('yyyy', jalali.jy.toString());
    result = result.replace('MM', jalali.jm.toString().padStart(2, '0'));
    result = result.replace('dd', jalali.jd.toString().padStart(2, '0'));
    result = result.replace('M', jalali.jm.toString());
    result = result.replace('d', jalali.jd.toString());
    result = result.replace('MMMM', this.getMonthName(jalali.jm));

    return result;
  }

  private formatGregorianDate(date: Date, format: string): string {
    let result = format;
    result = result.replace('yyyy', date.getFullYear().toString());
    result = result.replace(
      'MM',
      (date.getMonth() + 1).toString().padStart(2, '0')
    );
    result = result.replace('dd', date.getDate().toString().padStart(2, '0'));
    result = result.replace('M', (date.getMonth() + 1).toString());
    result = result.replace('d', date.getDate().toString());
    result = result.replace('MMMM', this.getMonthName(date.getMonth() + 1));
    return result;
  }

  getCalendarYear(date: Date): number {
    const calendarType = this.getCalendarType();

    if (calendarType === 'jalali') {
      const jalali = this.toJalali(date);
      return jalali.jy;
    } else {
      return date.getFullYear();
    }
  }

  getCurrentYear(): number {
    const calendarType = this.getCalendarType();

    if (calendarType === 'jalali') {
      const jalali = this.toJalali(new Date());
      return jalali.jy;
    } else {
      return new Date().getFullYear();
    }
  }
}
