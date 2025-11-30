import { Component, Output, EventEmitter, inject } from '@angular/core';
import { DateService } from '../../date.service';
import { LangService } from '@core/services/lang.service';
import { MonthInfo } from '../../models/calendar-types';

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.html',
})
export class MonthSelector {
  @Output() monthSelected = new EventEmitter<number>();
  @Output() backToCalendar = new EventEmitter<void>();

  private dateService = inject(DateService);
  private langService = inject(LangService);

  getMonthsGrid(): MonthInfo[][] {
    const months = this.dateService.getMonthsList();
    const grid: MonthInfo[][] = [];

    for (let i = 0; i < 4; i++) {
      grid.push(months.slice(i * 3, (i + 1) * 3));
    }

    return grid;
  }

  selectMonth(month: number): void {
    this.monthSelected.emit(month);
  }

  get isRTL(): boolean {
    return this.langService.dir() === 'rtl';
  }
}
