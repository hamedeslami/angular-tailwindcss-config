import { Component, inject } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
})
export class Home {
  private themeService = inject(ThemeService)
  colors = [
    { name: 'blue', value: '#162556' },
    { name: 'Red', value: '#9f0712' },
    { name: 'orange', value: '#ca3500' },
    { name: 'yellow', value: '#f0b100' },
    { name: 'green', value: '#016630' },
    { name: 'black', value: '#0a0a0a' },
    { name: 'gray', value: '#1f1f1f' },
    { name: 'cyan', value: '#007595' },
    { name: 'sky', value: '#0069a8' },
    { name: 'purple', value: '#6e11b0' },
    { name: 'pink', value: '#c6005c' },
    { name: 'rose', value: '#c70036' }



  ];

  changeColor(colorName: string) {
    const root = document.documentElement;
    const name = colorName.toLowerCase();

    const isDark = root.getAttribute('data-theme') === 'dark';

    const variable = isDark
      ? `var(--sidebar-${name}-dark)`
      : `var(--sidebar-${name}-light)`;

    root.style.setProperty('--sidebar-bg', variable);

    this.themeService.setSidebarColor(colorName);
  }
}
