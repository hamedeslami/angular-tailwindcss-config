import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
  private themeService = inject(ThemeService);

  isDark = this.themeService.isDark;

  toggleTheme(event: Event): void {
    event.preventDefault();
    this.themeService.toggleTheme();
  }
}
