import { Injectable, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private document = inject(DOCUMENT);
    isDark = signal<boolean>(false);

    constructor() {
        this.initializeTheme();
        window.addEventListener('storage', this.handleStorageChange);
        effect(() => {
            const isDark = this.isDark();
            this.applyTheme(isDark);
            this.saveThemePreference(isDark);
        });
    }

    initializeTheme(): void {
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

        if (isDark) {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.setAttribute('data-theme', 'light');
        }
    }

    private saveThemePreference(isDark: boolean): void {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    private handleStorageChange = (event: StorageEvent): void => {
        if (event.key === 'theme') {
            const newTheme = event.newValue === 'dark';
            this.isDark.set(newTheme);
        }
    };

    toggleTheme(): void {
        this.isDark.update(value => !value);
    }
}
