import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { Checkbox } from '../checkbox/checkbox';
import { FilterConfig, FilterState, SortState } from './types/filter.types';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, Checkbox],
  templateUrl: './table.html',
})
export class Table {
  columns = input<Array<any>>([]);
  data = input<any[]>([]);
  selectable = input<boolean>(false);
  templateMap = input<{ [key: string]: any }>({});

  filters = input<FilterConfig[]>([]);
  filterChanged = output<FilterState[]>();
  sortChanged = output<SortState>();

  currentSort = signal<SortState | null>(null);

  selectedRows: any[] = [];
  selectAll = false;

  activeFilters = signal<FilterState[]>([]);
  openFilterMenu = signal<string | null>(null);

  toggleAll() {
    this.selectAll = !this.selectAll;
    this.selectedRows = this.selectAll ? this.data().map((d) => d.id) : [];
  }

  toggleRow(id: string) {
    this.selectedRows.includes(id)
      ? (this.selectedRows = this.selectedRows.filter((x) => x !== id))
      : (this.selectedRows = [...this.selectedRows, id]);
  }

  getValue(obj: any, key?: string) {
    if (!key) return '';
    return key.split('.').reduce((acc: any, k: string) => acc?.[k], obj);
  }

  toggleFilterMenu(columnKey: string) {
    this.openFilterMenu.set(
      this.openFilterMenu() === columnKey ? null : columnKey
    );
  }

  applyFilter(columnKey: string, value: any, operator: string = 'equals') {
    const existingFilterIndex = this.activeFilters().findIndex(
      filter => filter.key === columnKey
    );

    if (value === null || value === '' || value === undefined) {
      if (existingFilterIndex !== -1) {
        const newFilters = this.activeFilters().filter(
          (_, index) => index !== existingFilterIndex
        );
        this.activeFilters.set(newFilters);
        this.filterChanged.emit(newFilters);
      }
    } else {
      const newFilter: FilterState = {
        key: columnKey,
        value,
        operator
      };

      if (existingFilterIndex !== -1) {
        const newFilters = [...this.activeFilters()];
        newFilters[existingFilterIndex] = newFilter;
        this.activeFilters.set(newFilters);
      } else {
        this.activeFilters.set([...this.activeFilters(), newFilter]);
      }

      this.filterChanged.emit(this.activeFilters());
    }

    this.openFilterMenu.set(null);
  }

  removeFilter(columnKey: string) {
    const newFilters = this.activeFilters().filter(
      filter => filter.key !== columnKey
    );
    this.activeFilters.set(newFilters);
    this.filterChanged.emit(newFilters);
  }

  hasFilter(columnKey: string): boolean {
    return this.activeFilters().some(filter => filter.key === columnKey);
  }

  getFilterConfig(columnKey: string): FilterConfig | undefined {
    return this.filters().find(filter => filter.key === columnKey);
  }

  toggleSort(columnKey: string) {
    const current = this.currentSort();

    if (current?.key === columnKey) {
      const newDirection = current.direction === 'asc' ? 'desc' :
        current.direction === 'desc' ? 'none' : 'asc';

      if (newDirection === 'none') {
        this.currentSort.set(null);
        this.sortChanged.emit({ key: '', direction: 'none' });
      } else {
        const newSort: SortState = { key: columnKey, direction: newDirection };
        this.currentSort.set(newSort);
        this.sortChanged.emit(newSort);
      }
    } else {
      const newSort: SortState = { key: columnKey, direction: 'asc' };
      this.currentSort.set(newSort);
      this.sortChanged.emit(newSort);
    }
  }

  isSortable(columnKey: string): boolean {
    const filterConfig = this.getFilterConfig(columnKey);
    return filterConfig?.sortable === true;
  }

  getSortIcon(columnKey: string): string {
    const current = this.currentSort();
    if (current?.key !== columnKey) {
      return 'sort-none';
    }

    return current.direction === 'asc' ? 'sort-asc' :
      current.direction === 'desc' ? 'sort-desc' : 'sort-none';
  }

  getSortDirection(columnKey: string): 'asc' | 'desc' | 'none' {
    const current = this.currentSort();
    if (current?.key !== columnKey) {
      return 'none';
    }
    return current.direction;
  }

  getFilterLabel(columnKey: string): string {
    const column = this.columns().find(col => col.key === columnKey);
    return column?.label || columnKey;
  }

  getFilterDisplayValue(filter: FilterState): string {
    const filterConfig = this.getFilterConfig(filter.key);

    if (!filterConfig) return filter.value;

    if (filterConfig.type === 'select' && filterConfig.options) {
      const option = filterConfig.options.find(opt => opt.value === filter.value);
      return option?.label || filter.value;
    }

    if (filterConfig.type === 'date') {
      return new Date(filter.value).toLocaleDateString('fa-IR');
    }

    return filter.value;
  }

  removeSpecificFilter(filter: FilterState) {
    this.removeFilter(filter.key);
  }

  clearAllFilters() {
    this.activeFilters.set([]);
    this.filterChanged.emit([]);
  }

  getCurrentFilterValue(columnKey: string): any {
  const filter = this.activeFilters().find(f => f.key === columnKey);
  return filter?.value || '';
}
}
