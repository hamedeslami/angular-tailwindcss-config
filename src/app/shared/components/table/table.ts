import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Checkbox } from '../checkbox/checkbox';

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

  selectedRows: any[] = [];
  selectAll = false;

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
}
