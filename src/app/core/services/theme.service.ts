import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly THEME_KEY = 'theme';
    theme = signal<'light' | 'dark'>('light');

    constructor() {
        const saved = localStorage.getItem(this.THEME_KEY) as 'light' | 'dark' | null;
        if (saved) this.theme.set(saved);
        else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.theme.set(prefersDark ? 'dark' : 'light');
        }
        this.applyThemeImmediate(this.theme());
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.THEME_KEY)) {
                const sys = e.matches ? 'dark' : 'light';
                this.theme.set(sys);
                this.applyThemeImmediate(sys);
            }
        });
    }

    setThemeImmediate(next: 'light' | 'dark'): void {
        this.theme.set(next);
        this.applyThemeImmediate(next);
        localStorage.setItem(this.THEME_KEY, next);
    }

    toggleThemeImmediate(): void {
        const next = this.theme() === 'dark' ? 'light' : 'dark';
        this.setThemeImmediate(next);
    }

    private applyThemeImmediate(theme: 'light' | 'dark'): void {
        document.documentElement.setAttribute('data-theme', theme);
    }
}
