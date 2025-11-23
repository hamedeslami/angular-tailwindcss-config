export type FilterType = 'text' | 'select' | 'date' | 'number';

export interface FilterOption {
  value: any;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  sortable?: boolean;
}

export interface FilterState {
  key: string;
  value: any;
  operator?: string;
}

export interface SortState {
  key: string;
  direction: 'asc' | 'desc' | 'none';
}