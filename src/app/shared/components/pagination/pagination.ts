import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
})

export class Pagination {
totalItems = input<number>(0);
itemsPerPage = input<number>(5);
currentPage = input<number>(1);
itemsPerPageStep = input<number>(5);
itemsPerPageOptions = input<number[]>([5, 10, 15, 20]);
pageChange = output<number>();
itemsPerPageChange = output<number>();
  


  get totalPages(): number {
    return Math.ceil(this.totalItems() / this.itemsPerPage());
  }

  // Dynamic range display
  get startItem(): number {
    return this.totalItems() === 0 ? 0 : (this.currentPage() - 1) * this.itemsPerPage() + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage() * this.itemsPerPage(), this.totalItems());
  }

  // Smart pages with ellipsis
  get visiblePages(): (number | '...')[] {
    const pages: (number | '...')[] = [];
    const total = this.totalPages;
    const current = this.currentPage();

    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const left = current - 2;
    const right = current + 2;

    // First page
    pages.push(1);

    // Left ellipsis
    if (left > 2) {
      pages.push('...');
    } else {
      for (let i = 2; i < Math.max(left, 2); i++) pages.push(i);
    }

    // Middle pages
    for (let i = Math.max(2, left); i <= Math.min(right, total - 1); i++) pages.push(i);

    // Right ellipsis
    if (right < total - 1) {
      pages.push('...');
    } else {
      for (let i = right + 1; i < total; i++) pages.push(i);
    }

    // Last page
    pages.push(total);

    return pages;
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage()) return;
    this.pageChange.emit(page);
  }

  changeItemsPerPage(count: number) {
    const num = parseInt(count as any, 10);
    if (!isNaN(num) && num > 0) {
      // this.itemsPerPage() = num;
      // this.currentPage() = 1;
      this.itemsPerPageChange.emit(num);
      this.pageChange.emit(this.currentPage()); // notify parent of page reset
    }
  }


  goToPageFromEvent(event: Event) {
    const input = event.target as HTMLInputElement;
    this.goToPage(input.value);
    input.value = '';
  }

  goToPage(value: string) {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= this.totalPages && num !== this.currentPage()) {
      this.changePage(num);
    }
  }

}
