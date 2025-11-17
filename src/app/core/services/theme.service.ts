import { Injectable, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);

  isDark = signal<boolean>(false);
  sidebarColor = signal<string>('blue'); 
  
  constructor() {
    this.initializeTheme();
    this.initializeSidebarColor();

    window.addEventListener('storage', this.handleStorageChange);

    effect(() => {
      this.applyTheme(this.isDark());
      this.saveThemePreference(this.isDark());
      this.reapplySidebarColor();
    });

    effect(() => {
      this.applySidebarColor(this.sidebarColor());
      this.saveSidebarColor(this.sidebarColor());
      this.reapplySidebarColor();
    });
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

  private applySidebarColor(color: string): void {
    const html = this.document.documentElement;
    html.style.setProperty('--sidebar-bg', color);
  }

  private saveSidebarColor(color: string): void {
    localStorage.setItem('sidebar-color', color);
  }

  setSidebarColor(color: string): void {
    this.sidebarColor.set(color);
  }

  private reapplySidebarColor() {
    const name = this.sidebarColor().toLowerCase();
    const isDark = this.isDark();
    const root = this.document.documentElement;

    const variable = isDark
      ? `var(--sidebar-${name}-dark)`
      : `var(--sidebar-${name}-light)`;

    root.style.setProperty('--sidebar-bg', variable);
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
