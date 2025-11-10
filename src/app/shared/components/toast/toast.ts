import { NgClass } from '@angular/common';
import { Component, OnInit, Input, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastService } from '@core/services/toast.service';
import type { Toast as ToastModel } from '@core/services/toast.service';



@Component({
  selector: 'app-toast',
  imports: [NgClass],
  templateUrl: './toast.html',
  standalone: true,
  styleUrls: ['./toast.css']
})
export class Toast implements OnInit  {
  @Input() position: string = 'top-right';
  toasts: ToastModel[] = [];

  constructor(private toastService: ToastService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.toastService.toastsObs$.subscribe(toasts => this.toasts = toasts);
  }

  removeToast(id: number) {
    this.toastService.remove(id);
  }

  getIcon(type = 'info'): SafeHtml {
    let icon: string = '';
    switch (type) {
      case 'success':
        icon = `
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
        `;
        break;
      case 'error':
        icon = `
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
        </svg>
        `;
        break;
      case 'warning':
        icon = `
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
        </svg>
        `;
        break;
      case 'info':
        icon = `
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
        </svg>
        `;
        break;
      default:
        icon = `
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0Zm-8 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm1-8a1 1 0 0 0-2 0v5a1 1 0 0 0 2 0V5Z" clip-rule="evenodd"/>
        </svg>
        `;
    }

    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  getColorClasses(type = 'info'): string {
    switch (type) {
      case 'success':
        return 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200';
      case 'warning':
        return 'text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200';
      case 'info':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200';
      default:
        return 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200';
    }
  }

  getPositionClasses(): string {
    switch (this.position) {
      case 'top-left':
        return 'top-5 left-5';
      case 'top-right':
        return 'top-5 right-5';
      case 'bottom-left':
        return 'bottom-5 left-5';
      case 'bottom-right':
        return 'bottom-5 right-5';
      case 'top-center':
        return 'top-5 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-5 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-5 right-5';
    }
  }

}
