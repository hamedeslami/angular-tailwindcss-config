import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';


@Component({
  selector: 'app-theme-toggle-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theme-toggle-button.html'
})
export class ThemeToggleButton {
    private themeService = inject(ThemeService);

  isDark = this.themeService.isDark;

  toggleTheme(event: Event): void {
    event.preventDefault();
    this.themeService.toggleTheme();
  }
}