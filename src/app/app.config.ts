import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LangService } from './core/services/lang.service';
import { LangTitleStrategy } from '@core/strategies/lang-title.strategy';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAppInitializer(() => {
      const langService = inject(LangService);
      return langService.init();
    }),
    { provide: LangTitleStrategy, useClass: LangTitleStrategy },
  ]
};
