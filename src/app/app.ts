import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LangService } from '@core/services/lang.service';
import { ThemeService } from '@core/services/theme.service';
import { Toast } from '@shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'angular-config';

  private themeService = inject(ThemeService);
  private langService = inject(LangService);

  constructor() { 
    this.themeService.initializeTheme();
  }

  readonly toastPostion = computed(() => {
    const lang = this.langService.currentLang;
    return lang === 'fa' ? 'top-right' : 'top-left';
  });
}
