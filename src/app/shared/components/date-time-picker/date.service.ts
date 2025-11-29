import { Injectable, inject } from '@angular/core';
import { LangService } from '@core/services/lang.service';
import { toJalaali, toGregorian, isValidJalaaliDate } from 'jalaali-js';

export type CalendarType = 'gregorian' | 'jalali';

@Injectable({
    providedIn: 'root'
})
export class DateService {
    private langService = inject(LangService);

    getCalendarType(): CalendarType {
        return this.langService.calendarType();
    }

    toJalali(date: Date): { jy: number, jm: number, jd: number } {
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
        if (this.getCalendarType() === 'jalali') {
            const persianMonths = [
                'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
            ];
            return persianMonths[month - 1] || '';
        } else {
            const englishMonths = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            return englishMonths[month - 1] || '';
        }
    }

    getWeekDays(): string[] {
        if (this.getCalendarType() === 'jalali') {
            return ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
        } else {
            return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        }
    }

    isValidDate(year: number, month: number, day: number): boolean {
        if (this.getCalendarType() === 'jalali') {
            return isValidJalaaliDate(year, month, day);
        } else {
            const date = new Date(year, month - 1, day);
            return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
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

    private isJalaliLeapYear(jy: number): boolean {
        return (((jy - (jy > 0 ? 474 : 473)) % 2820) + 474 + 38) * 682 % 2816 < 682;
    }

    private formatJalaliDate(jalali: { jy: number, jm: number, jd: number }, format: string): string {
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
        result = result.replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'));
        result = result.replace('dd', date.getDate().toString().padStart(2, '0'));
        result = result.replace('M', (date.getMonth() + 1).toString());
        result = result.replace('d', date.getDate().toString());
        result = result.replace('MMMM', this.getMonthName(date.getMonth() + 1));
        return result;
    }
}