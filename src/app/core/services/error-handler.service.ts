import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';  // مسیر ToastService

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private toastService: ToastService) {}

  handleError(errorCode: number, errorMessage: string): void {
    let message = '';

    switch (errorCode) {
      case 400:
        message = 'درخواست شما معتبر نیست. لطفاً دوباره تلاش کنید.';
        break;
      case 401:
        message = 'شما وارد حساب کاربری خود نشده‌اید یا توکن منقضی شده است. لطفاً وارد شوید.';
        break;
      case 403:
        message = 'دسترسی شما محدود است. شما اجازه دسترسی به این صفحه را ندارید.';
        break;
      case 404:
        message = 'صفحه یا منبع مورد نظر یافت نشد.';
        break;
      case 500:
        message = 'خطای سرور. لطفاً دوباره تلاش کنید.';
        break;
      case 503:
        message = 'سرور در دسترس نیست. لطفاً بعداً تلاش کنید.';
        break;
      default:
        message = errorMessage || 'خطای ناشناخته، لطفاً بعداً تلاش کنید.';
    }

    this.toastService.show(message, 'error');
  }

  handleResponseError(response: any): void {
    if (response && response.responseCode && response.responseCode !== 200) {
      this.toastService.show(response.message || 'خطای ناشناخته در پردازش درخواست');
    }
  }
}
