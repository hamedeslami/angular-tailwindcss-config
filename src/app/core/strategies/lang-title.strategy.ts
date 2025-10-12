import { Injectable, inject, effect } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { LangService } from '@core/services/lang.service';

@Injectable({ providedIn: 'root' })
export class LangTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly langService = inject(LangService);

  private lastSnapshot: RouterStateSnapshot | null = null;

  constructor() {
    super();

    effect(() => {
      const _ = this.langService.currentLang;

      const snapshot = this.lastSnapshot;
      if (!snapshot) return;

      const currentTitle = this.buildTitle(snapshot);
      if (currentTitle) {
        this.title.setTitle(currentTitle);
      }
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.lastSnapshot = snapshot;

    const title = this.buildTitle(snapshot);
    if (title) {
      this.title.setTitle(title);
    }
  }
}
