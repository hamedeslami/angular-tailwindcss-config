import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Badge } from '../badge/badge';
import { AvatarText } from '../avatar/avatar-text/avatar-text';
import { Checkbox } from '../checkbox/checkbox';
import { Pagination } from '../pagination/pagination';


@Component({
  selector: 'app-basic-table',
  standalone: true,
  imports: [CommonModule, Checkbox, Pagination],
  templateUrl: './basic-table.html',
})
export class BasicTable {
  @Input() columns: Array<any> = [];
  @Input() data: any[] = [];
  @Input() selectable = false;
  @Input() templateMap: { [key: string]: any } = {};

  selectedRows: any[] = [];
  selectAll = false;

  toggleAll() {
    this.selectAll = !this.selectAll;
    this.selectedRows = this.selectAll ? this.data.map(d => d.id) : [];
  }

  toggleRow(id: string) {
    this.selectedRows.includes(id)
      ? this.selectedRows = this.selectedRows.filter(x => x !== id)
      : this.selectedRows = [...this.selectedRows, id];
  }

  getValue(obj: any, key?: string) {
    if (!key) return '';
    return key.split('.').reduce((acc: any, k: string) => acc?.[k], obj);
  }
}
