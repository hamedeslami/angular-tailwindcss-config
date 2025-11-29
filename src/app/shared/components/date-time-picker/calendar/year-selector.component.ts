import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { DateService } from '../date.service';
import { LangService } from '@core/services/lang.service';

@Component({
  selector: 'app-year-selector',
  templateUrl: './year-selector.component.html',
})
export class YearSelectorComponent {
  @Input() currentMonth!: Date;
  @Output() yearSelected = new EventEmitter<number>();
  @Output() backToCalendar = new EventEmitter<void>();

  currentDecade: number = 0;
  decadeYears: number[] = [];

  private dateService = inject(DateService);
  private langService = inject(LangService);

  ngOnInit() {
    this.setCurrentDecade();
  }

  ngOnChanges() {
    this.setCurrentDecade();
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
    this.decadeYears = Array.from(
      { length: 12 },
      (_, i) => this.currentDecade - 1 + i
    );
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

  selectYear(year: number): void {
    this.yearSelected.emit(year);
  }

  getAvailableDecades(): number[] {
    const calendarType = this.dateService.getCalendarType();
    const currentYear =
      calendarType === 'jalali'
        ? this.dateService.toJalali(new Date()).jy
        : new Date().getFullYear();

    const currentDecade = Math.floor(currentYear / 10) * 10;
    return [
      currentDecade - 20,
      currentDecade - 10,
      currentDecade,
      currentDecade + 10,
      currentDecade + 20,
    ];
  }

  getCurrentYear(): number {
    return this.dateService.getCurrentYear();
  }

  getYearButtonClasses(year: number): string {
    const baseClasses =
      'p-3 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border';
    const currentYear = this.getCurrentYear();
    const selectedYear = this.dateService.getCalendarYear(this.currentMonth);

    if (year === selectedYear) {
      return `${baseClasses} bg-blue-600 text-white border-blue-600 hover:bg-blue-700`;
    }

    if (year === currentYear) {
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50`;
    }

    return `${baseClasses} bg-white text-gray-900 dark:bg-gray-700 dark:text-white border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600`;
  }

  get isRTL(): boolean {
    return this.langService.dir() === 'rtl';
  }
}
