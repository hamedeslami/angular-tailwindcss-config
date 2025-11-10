// core/services/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  toastsObs$ = this.toasts$.asObservable();

  show(message: string, type: Toast['type'] = 'info', duration?: number) {
    const id = Date.now();

    const defaultDurations: Record<NonNullable<Toast['type']>, number> = {
      success: 3000,
      info: 3500,
      warning: 4500,
      error: 5500,
    };

    const finalDuration = duration ?? defaultDurations[type];
    const toast: Toast = { id, message, type, duration: finalDuration };
    this.toasts$.next([...this.toasts$.value, toast]);
    setTimeout(() => this.remove(id), finalDuration);
  }


  remove(id: number) {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }
}
