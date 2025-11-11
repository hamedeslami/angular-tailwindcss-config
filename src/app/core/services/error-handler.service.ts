import { computed, inject, Injectable } from '@angular/core';
import { ToastService } from './toast.service';  // مسیر ToastService
import { LangService } from './lang.service';
import { ERROR_HANDLER_TEXTS} from '@core/content/error-handler.text';
import { TextService } from './text.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private textService = inject(TextService);
  private toastService = inject(ToastService);
  readonly texts = this.textService.getTexts(ERROR_HANDLER_TEXTS, 'httpCode');

  handleError(errorCode: number, errorMessage: string): void {
    let message = '';

    switch (errorCode) {
      case 400:
        message = this.texts()['400'];
        break;
      case 401:
        message = this.texts()['401'];
        break;
      case 403:
        message = this.texts()['403'];
        break;
      case 404:
        message = this.texts()['404'];
        break;
      case 500:
        message = this.texts()['500'];
        break;
      case 503:
        message = this.texts()['503'];
        break;
      default:
        message = errorMessage || this.texts()['default'];
    }

    this.toastService.show(message, 'error');
  }

  handleResponseError(response: any): void {
    if (response && response.responseCode && response.responseCode !== 200) {
      this.toastService.show(response.message || this.texts()['default']);
    }
  }
}
