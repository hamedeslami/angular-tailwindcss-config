import { inject } from '@angular/core';
import { LangService } from '@core/services/lang.service';
import type { LangCode } from '@core/services/lang.service';

export function withLangTitle<T extends Record<string, any>>(
  texts: Record<LangCode, T>,
  sectionKey: keyof T
): () => string {
  return () => {
    const lang = inject(LangService).currentLang as LangCode;
    const section = texts[lang][sectionKey];
    return section?.title || '';
  };
}
