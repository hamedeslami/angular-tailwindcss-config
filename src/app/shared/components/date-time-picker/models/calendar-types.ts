export type PickerMode = 'date' | 'time' | 'both';
export type CalendarType = 'gregorian' | 'jalali';
export type CalendarView = 'calendar' | 'month' | 'year';

export interface CalendarDate {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isDisabled: boolean;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  isFriday: boolean;
}

export interface DateTimePickerConfig {
  minDate?: Date;
  maxDate?: Date;
  dateFormat: string;
  timeFormat: string;
  mode: PickerMode;
  placeholder: string;
  disabled: boolean;
}

export interface MonthInfo {
  number: number;
  name: string;
}

export interface TimeSelection {
  hour: number;
  minute: number;
}
