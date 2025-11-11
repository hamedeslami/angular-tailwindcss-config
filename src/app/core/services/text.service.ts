import { Injectable, inject, computed, Signal } from '@angular/core';
import { LangService } from './lang.service';
import { LangCode } from '@core/types/lang-code.type';

@Injectable({ providedIn: 'root' })
export class TextService {
  private langService = inject(LangService);

  getTexts<
    TTexts extends Record<LangCode, Record<string, any>>,
    TSection extends keyof TTexts[LangCode] & string
  >(
    texts: TTexts,
    section: TSection
  ): Signal<TTexts[LangCode][TSection]> {
    return computed(() => {
      const lang = this.langService.lang();
      return texts[lang][section];
    });
  }
}
