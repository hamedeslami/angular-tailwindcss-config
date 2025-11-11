import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LangService } from './core/services/lang.service';
import { LangTitleStrategy } from '@core/strategies/lang-title.strategy';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAppInitializer(() => {
      const langService = inject(LangService);
      return langService.init();
    }),
    { provide: LangTitleStrategy, useClass: LangTitleStrategy },
  ]
};
