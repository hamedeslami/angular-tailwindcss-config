import { Injectable, computed, inject, signal } from '@angular/core';
import { LangService } from '@core/services/lang.service';
import { AUTH_TEXTS, AuthSection, AuthTextKeys } from '../content/auth.texts';

@Injectable({ providedIn: 'root' })
export class AuthTextService {
    private langService = inject(LangService);

    getTexts(section: AuthSection) {
        return computed<AuthTextKeys>(() => {
            const lang = this.langService.lang();
            return AUTH_TEXTS[lang][section];
        });
    }
}
