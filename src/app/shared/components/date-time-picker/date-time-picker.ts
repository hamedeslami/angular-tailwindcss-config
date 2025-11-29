import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy, inject, effect, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { format, isValid, startOfDay, setHours, setMinutes } from 'date-fns';
import { DateService } from './date.service';
import { LangService } from '@core/services/lang.service';

export type PickerMode = 'date' | 'time' | 'both';

@Component({
    selector: 'app-date-time-picker',
    templateUrl: './date-time-picker.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateTimePicker),
            multi: true
        }
    ]
})
export class DateTimePicker implements ControlValueAccessor, OnInit, OnDestroy {
    @Input() minDate: Date | null = null;
    @Input() maxDate: Date | null = null;
    @Input() dateFormat: string = 'auto';
    @Input() timeFormat: string = 'auto';
    @Input() mode: PickerMode = 'both';
    @Input() placeholder: string = 'Select date and time';
    @Input() disabled: boolean = false;
    @Output() dateTimeChange = new EventEmitter<Date | null>();

    private dateService = inject(DateService);
    private langService = inject(LangService);

    selectedDate: Date | null = null;
    selectedTime: string = '';
    showPicker: boolean = false;
    showTimeSection: boolean = false;
    is24Hour: boolean = true;

    showMonthView: boolean = false;
    showYearView: boolean = false;
    currentView: 'calendar' | 'month' | 'year' = 'calendar';
    showMonthList: boolean = false;
    showYearList: boolean = false;
    years: number[] = [];

    currentDecade: number = 0;
    decadeYears: number[] = [];

    currentMonth: Date = new Date();
    days: Date[] = [];
    weekDays: string[] = [];

    hours: number[] = [];
    minutes: number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    private onChange: (value: Date | null) => void = () => { };
    private onTouched: () => void = () => { };
    private langEffect: any;

    constructor() {
        this.langEffect = effect(() => {
            const lang = this.langService.lang();
            this.updateCalendarDirection();
            this.generateCalendar();

        });
    }

    ngOnInit() {
        this.generateCalendar();
        this.updateHoursList();
        this.setCurrentDecade();

        if (this.mode === 'time') {
            this.showTimeSection = true;
        }
    }

    ngOnDestroy() {
        if (this.langEffect) {
            this.langEffect.destroy();
        }
    }

    private setCurrentDecade(): void {
        const calendarType = this.dateService.getCalendarType();
        let currentYear: number;

        if (calendarType === 'jalali') {
            const jalali = this.dateService.toJalali(this.currentMonth);
            currentYear = jalali.jy;
        } else {
            currentYear = this.currentMonth.getFullYear();
        }

        this.currentDecade = Math.floor(currentYear / 10) * 10;
        this.generateDecadeYears();
    }

    private generateDecadeYears(): void {
        this.decadeYears = Array.from({ length: 12 }, (_, i) => this.currentDecade - 1 + i);
    }

    previousDecade(): void {
        this.currentDecade -= 10;
        this.generateDecadeYears();
    }

    nextDecade(): void {
        this.currentDecade += 10;
        this.generateDecadeYears();
    }

    jumpToDecade(decade: number): void {
        this.currentDecade = decade;
        this.generateDecadeYears();
    }

    getAvailableDecades(): number[] {
        const calendarType = this.dateService.getCalendarType();
        const currentYear = calendarType === 'jalali' ?
            this.dateService.toJalali(new Date()).jy :
            new Date().getFullYear();

        const currentDecade = Math.floor(currentYear / 10) * 10;
        return [
            currentDecade - 20,
            currentDecade - 10,
            currentDecade,
            currentDecade + 10,
            currentDecade + 20
        ];
    }


    showMonthSelection(): void {
        this.currentView = 'month';
        this.showMonthView = true;
        this.showYearView = false;
    }

    showYearSelection(): void {
        this.currentView = 'year';
        this.showYearView = true;
        this.showMonthView = false;
        this.setCurrentDecade();
    }

    backToCalendar(): void {
        this.currentView = 'calendar';
        this.showMonthView = false;
        this.showYearView = false;
    }


    private generateYearsList(): void {
        const calendarType = this.dateService.getCalendarType();
        let currentYear: number;

        if (calendarType === 'jalali') {
            const jalali = this.dateService.toJalali(new Date());
            currentYear = jalali.jy;
        } else {
            currentYear = new Date().getFullYear();
        }

        this.years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
    }

    toggleMonthList(): void {
        this.showMonthList = !this.showMonthList;
        this.showYearList = false;
    }

    toggleYearList(): void {
        this.showYearList = !this.showYearList;
        this.showMonthList = false;
        this.generateYearsList();
    }


    selectMonth(month: number): void {
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            const jalali = this.dateService.toJalali(this.currentMonth);
            this.currentMonth = this.dateService.toGregorian(jalali.jy, month, 1);
        } else {
            this.currentMonth = new Date(this.currentMonth.getFullYear(), month - 1, 1);
        }

        this.backToCalendar();
        this.generateCalendar();
    }

    selectYear(year: number): void {
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            const jalali = this.dateService.toJalali(this.currentMonth);
            this.currentMonth = this.dateService.toGregorian(year, jalali.jm, 1);
        } else {
            this.currentMonth = new Date(year, this.currentMonth.getMonth(), 1);
        }

        this.backToCalendar();
        this.generateCalendar();
    }

    getMonthsGrid(): { number: number, name: string }[][] {
        const months = this.getMonthsList();
        const grid: { number: number, name: string }[][] = [];

        for (let i = 0; i < 4; i++) {
            grid.push(months.slice(i * 3, (i + 1) * 3));
        }

        return grid;
    }

    getYearsGrid(): number[][] {
        const grid: number[][] = [];

        for (let i = 0; i < 5; i++) {
            grid.push(this.years.slice(i * 4, (i + 1) * 4));
        }

        return grid;
    }

    getMonthsList(): { number: number, name: string }[] {
        const calendarType = this.dateService.getCalendarType();
        const months = [];

        for (let i = 1; i <= 12; i++) {
            months.push({
                number: i,
                name: this.dateService.getMonthName(i)
            });
        }

        return months;
    }

    closeAllDropdowns(): void {
        this.showMonthList = false;
        this.showYearList = false;
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
        this.generateCalendar();
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

    get isRTL(): boolean {
        return this.langService.dir() === 'rtl';
    }

    private updateCalendarDirection(): void {
        this.weekDays = this.dateService.getWeekDays();
    }

    updateHoursList(): void {
        if (this.is24Hour) {
            this.hours = Array.from({ length: 24 }, (_, i) => i);
        } else {
            this.hours = Array.from({ length: 12 }, (_, i) => i + 1);
        }
    }

    toggleTimeFormat(): void {
        this.is24Hour = !this.is24Hour;
        this.updateHoursList();
    }

    getHourLabel(hour: number): string {
        if (this.is24Hour) {
            return hour.toString().padStart(2, '0');
        } else {
            const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
            const period = hour < 12 ? 'AM' : 'PM';
            return `${displayHour.toString().padStart(2, '0')} ${period}`;
        }
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

    generateCalendar(): void {
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            this.generateJalaliCalendar();
        } else {
            this.generateGregorianCalendar();
        }
    }

    private generateGregorianCalendar(): void {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDate = new Date(firstDay);
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);

        this.days = [];
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            this.days.push(date);
        }
    }

    private generateJalaliCalendar(): void {
        const jalali = this.dateService.toJalali(this.currentMonth);
        const jy = jalali.jy;
        const jm = jalali.jm;

        const firstDayGregorian = this.dateService.toGregorian(jy, jm, 1);
        const firstDayOfWeek = firstDayGregorian.getDay();

        const startDate = new Date(firstDayGregorian);
        startDate.setDate(firstDayGregorian.getDate() - ((firstDayOfWeek + 1) % 7));

        this.days = [];
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            this.days.push(date);
        }
    }

    previousMonth(): void {
        this.backToCalendar();
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            const jalali = this.dateService.toJalali(this.currentMonth);
            let newJm = jalali.jm - 1;
            let newJy = jalali.jy;

            if (newJm < 1) {
                newJm = 12;
                newJy--;
            }

            this.currentMonth = this.dateService.toGregorian(newJy, newJm, 1);
        } else {
            this.currentMonth = new Date(
                this.currentMonth.getFullYear(),
                this.currentMonth.getMonth() - 1,
                1
            );
        }

        this.generateCalendar();
    }

    nextMonth(): void {
        this.backToCalendar();
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            const jalali = this.dateService.toJalali(this.currentMonth);
            let newJm = jalali.jm + 1;
            let newJy = jalali.jy;

            if (newJm > 12) {
                newJm = 1;
                newJy++;
            }

            this.currentMonth = this.dateService.toGregorian(newJy, newJm, 1);
        } else {
            this.currentMonth = new Date(
                this.currentMonth.getFullYear(),
                this.currentMonth.getMonth() + 1,
                1
            );
        }

        this.generateCalendar();
    }

    getCalendarHeader(): string {
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            const jalali = this.dateService.toJalali(this.currentMonth);
            const monthName = this.dateService.getMonthName(jalali.jm);
            return `${monthName} ${jalali.jy}`;
        } else {
            return this.currentMonth.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        }
    }

    getDayNumber(date: Date): number {
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            const jalali = this.dateService.toJalali(date);
            return jalali.jd;
        } else {
            return date.getDate();
        }
    }

    isCurrentMonth(date: Date): boolean {
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            const currentJalali = this.dateService.toJalali(this.currentMonth);
            const dateJalali = this.dateService.toJalali(date);
            return currentJalali.jy === dateJalali.jy && currentJalali.jm === dateJalali.jm;
        } else {
            return date.getMonth() === this.currentMonth.getMonth() &&
                date.getFullYear() === this.currentMonth.getFullYear();
        }
    }

    selectDate(date: Date): void {
        if (!this.isCurrentMonth(date)) {
            console.log('Date not in current month:', date);
            return;
        }

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


    selectTime(hour: number, minute: number): void {
        this.selectedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        let newDate: Date;
        if (this.selectedDate) {
            newDate = setHours(setMinutes(this.selectedDate, minute), hour);
        } else {
            const today = new Date();
            newDate = setHours(setMinutes(today, minute), hour);
        }

        this.selectedDate = newDate;
        this.showPicker = false;
        this.showTimeSection = false;
        this.updateValue();
    }

    selectToday(): void {
        this.backToCalendar();
        const today = new Date();
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            const jalaliToday = this.dateService.toJalali(today);
            this.currentMonth = this.dateService.toGregorian(jalaliToday.jy, jalaliToday.jm, 1);
        } else {
            this.currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        }
        this.generateCalendar();
        this.selectTodayDate(today);
    }

    private selectTodayDate(date: Date): void {
        if (!this.isCurrentMonth(date)) {
            console.log('Date not in current month:', date);
            return;
        }

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

    isFriday(date: Date): boolean {
        const calendarType = this.dateService.getCalendarType();
        if (calendarType === 'jalali') {
            return date.getDay() === 5;
        } else {
            return date.getDay() === 5;
        }
    }

    isWeekend(date: Date): boolean {
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            return date.getDay() === 5;
        } else {
            return date.getDay() === 0 || date.getDay() === 6;
        }
    }

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

    private getEffectiveDateFormat(): string {
        if (this.dateFormat !== 'auto') return this.dateFormat;
        return this.dateService.getCalendarType() === 'jalali' ? 'yyyy/MM/dd' : 'MM/dd/yyyy';
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
                return `${this.dateService.formatDate(this.selectedDate, dateFormat)} ${this.dateService.formatDate(this.selectedDate, timeFormat)}`;
            default:
                return '';
        }
    }

    isDateDisabled(date: Date): boolean {
        if (this.minDate && date < this.minDate) return true;
        if (this.maxDate && date > this.maxDate) return true;
        return false;
    }

    getDayClasses(date: Date): string {
        const baseClasses = 'w-8 h-8 bg-gray-100 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';

        if (!this.isCurrentMonth(date) || this.isDateDisabled(date)) {
            return `${baseClasses} text-gray-400 dark:text-gray-500 cursor-not-allowed`;
        }

        if (this.isFriday(date)) {
            if (this.isSelectedDate(date)) {
                return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
            }

            if (this.isToday(date)) {
                return `${baseClasses} bg-blue-100 text-red-600 dark:bg-blue-900 dark:text-red-400 hover:bg-blue-200 dark:hover:bg-blue-800 border border-red-500`;
            }

            return `${baseClasses} text-red-600 cursor-pointer dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600`;
        }

        if (this.isSelectedDate(date)) {
            return `${baseClasses} !bg-blue-600 text-white hover:bg-blue-700 cursor-pointer`;
        }

        if (this.isToday(date)) {
            return `${baseClasses} bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer`;
        }

        return `${baseClasses} text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer`;
    }

    isSelectedDate(date: Date): boolean {
        return this.selectedDate ?
            date.toDateString() === this.selectedDate.toDateString() : false;
    }

    isToday(date: Date): boolean {
        return date.toDateString() === new Date().toDateString();
    }

    getTimeButtonClasses(value: number, type: 'hour' | 'minute'): string {
        const baseClasses = 'w-full py-2 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
        const currentValue = type === 'hour' ? this.getCurrentHour() : this.getCurrentMinute();

        if (currentValue === value) {
            return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
        }

        return `${baseClasses} text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600`;
    }

    private updateValue(): void {
        this.onChange(this.selectedDate);
        this.onTouched();
        this.dateTimeChange.emit(this.selectedDate);
    }


    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (!target.closest('.relative') && this.showPicker) {
            this.closePicker();
        }
    }


    @HostListener('document:keydown.escape', ['$event']) onEscape(event: Event) {
        if (this.currentView !== 'calendar') {
            this.backToCalendar();
        } else if (this.showPicker) {
            this.closePicker();
        }
    }

    clearSelection(): void {
        this.selectedDate = null;
        this.selectedTime = '';
        this.updateValue();
    }


    previousYear(): void {
        this.backToCalendar();
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            const jalali = this.dateService.toJalali(this.currentMonth);
            this.currentMonth = this.dateService.toGregorian(jalali.jy - 1, jalali.jm, 1);
        } else {
            this.currentMonth = new Date(this.currentMonth.getFullYear() - 1, this.currentMonth.getMonth(), 1);
        }

        this.generateCalendar();
    }

    nextYear(): void {
        this.backToCalendar();
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            const jalali = this.dateService.toJalali(this.currentMonth);
            this.currentMonth = this.dateService.toGregorian(jalali.jy + 1, jalali.jm, 1);
        } else {
            this.currentMonth = new Date(this.currentMonth.getFullYear() + 1, this.currentMonth.getMonth(), 1);
        }

        this.generateCalendar();
    }

    getCalendarMonthName(): string {
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            const jalali = this.dateService.toJalali(this.currentMonth);
            return this.dateService.getMonthName(jalali.jm);
        } else {
            return this.currentMonth.toLocaleDateString('en-US', { month: 'long' });
        }
    }

    getCalendarYear(): number {
        const calendarType = this.dateService.getCalendarType();

        if (calendarType === 'jalali') {
            const jalali = this.dateService.toJalali(this.currentMonth);
            return jalali.jy;
        } else {
            return this.currentMonth.getFullYear();
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

    getYearButtonClasses(year: number): string {
        const baseClasses = 'p-3 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border';
        const currentYear = this.getCurrentYear();
        const selectedYear = this.getCalendarYear();

        if (year === selectedYear) {
            return `${baseClasses} bg-blue-600 text-white border-blue-600 hover:bg-blue-700`;
        }

        if (year === currentYear) {
            return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50`;
        }

        return `${baseClasses} bg-white text-gray-900 dark:bg-gray-700 dark:text-white border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600`;
    }
}