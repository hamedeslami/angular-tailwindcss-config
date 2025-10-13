import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
  private themeService = inject(ThemeService);
  isDark = computed(() => this.themeService.theme() === 'dark');

  toggleTheme(event: MouseEvent) {
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const current = this.themeService.theme();
    const desired = current === 'light' ? 'dark' : 'light';
    const ev = new CustomEvent('darkModeToggle', { detail: { x: centerX, y: centerY, theme: desired } });
    window.dispatchEvent(ev);
  }
}
