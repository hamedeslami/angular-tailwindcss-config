import { Injectable, signal, effect, inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  private document = inject(DOCUMENT);

  isDark = signal<boolean>(false);
  sidebarColor = signal<string>('blue');

  constructor() {
    this.initializeTheme();
    this.initializeSidebarColor();

    window.addEventListener('storage', this.handleStorageChange);

    effect(() => {
      const isDark = this.isDark();
      const sidebarColor = this.sidebarColor();
      
      this.applyTheme(isDark);
      this.saveThemePreference(isDark);
      this.applySidebarColor(sidebarColor, isDark);
      this.saveSidebarColor(sidebarColor);
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageChange);
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      this.isDark.set(savedTheme === 'dark');
    } else {
      this.isDark.set(systemPrefersDark);
    }
  }

  private applyTheme(isDark: boolean): void {
    const html = this.document.documentElement;
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  private saveThemePreference(isDark: boolean): void {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    this.isDark.update(v => !v);
  }

  private initializeSidebarColor(): void {
    const saved = localStorage.getItem('sidebar-color');
    if (saved) {
      this.sidebarColor.set(saved);
    }
  }

  private applySidebarColor(color: string, isDark: boolean): void {
    const name = color.toLowerCase();
    const root = this.document.documentElement;
    
    const variable = isDark
      ? `var(--sidebar-${name}-dark)`
      : `var(--sidebar-${name}-light)`;

    root.style.setProperty('--sidebar-bg', variable);
  }

  private saveSidebarColor(color: string): void {
    localStorage.setItem('sidebar-color', color);
  }

  setSidebarColor(color: string): void {
    this.sidebarColor.set(color);
  }

  private handleStorageChange = (event: StorageEvent): void => {
    if (event.key === 'theme') {
      this.isDark.set(event.newValue === 'dark');
    }

    if (event.key === 'sidebar-color' && event.newValue) {
      this.sidebarColor.set(event.newValue);
    }
  };
}