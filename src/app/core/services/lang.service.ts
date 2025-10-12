import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly _lang = signal<'fa' | 'en'>('fa');
  readonly lang = this._lang.asReadonly();

  readonly dir = computed(() => (this._lang() === 'fa' ? 'rtl' : 'ltr'));

  init(): Promise<void> {
    return new Promise((resolve) => {
      const savedLang = localStorage.getItem('lang') as 'fa' | 'en' | null;
      const finalLang = savedLang ?? 'fa';

      this._lang.set(finalLang);
      localStorage.setItem('lang', finalLang);

      document.documentElement.setAttribute('lang', finalLang);
      document.documentElement.setAttribute('dir', this.dir());

      resolve();
    });
  }

  setLang(lang: 'fa' | 'en') {
    this._lang.set(lang);
    localStorage.setItem('lang', lang);

    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', this.dir());
  }

  get currentLang() {
    return this._lang();
  }
}
