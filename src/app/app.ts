import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LangService } from '@core/services/lang.service';
import { Toast } from '@shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'angular-config';
  private langService = inject(LangService);

  readonly toastPostion = computed(() => {
    const lang = this.langService.currentLang;
    return lang === 'fa' ? 'top-right' : 'top-left';
  });
}
