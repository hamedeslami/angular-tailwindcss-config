import { CommonModule } from '@angular/common';
import { Component, computed, HostBinding, input } from '@angular/core';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';

type BadgeVariant = 'light' | 'solid';
type BadgeSize = 'sm' | 'md';
type BadgeColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark';

@Component({
  selector: 'app-badge',
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './badge.html',
})
export class Badge {
  variant = input<BadgeVariant>('light');
  size = input<BadgeSize>('md');
  color = input<BadgeColor>('primary');
  startIcon = input<string>('');
  endIcon = input<string>('');

  @HostBinding('class') get hostClasses(): string {
    return 'flex';
  }

  baseStyles = 'inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium';

  sizeClass = computed(() => {
    return {
      sm: 'text-xs',
      md: 'text-sm',
    }[this.size()];
  });

  colorStyles = computed(() => {
    const variants = {
      light: {
        primary: 'bg-blue-50 text-blue-500 dark:bg-blue-500/15 dark:text-blue-400',
        success: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500',
        error: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500',
        warning: 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
        info: 'bg-blue-50 text-blue-500 dark:bg-blue-500/15 dark:text-blue-500',
        light: 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80',
        dark: 'bg-gray-500 text-white dark:bg-white/5 dark:text-white',
      },
      solid: {
        primary: 'bg-blue-500 text-white dark:text-white',
        success: 'bg-green-500 text-white dark:text-white',
        error: 'bg-red-500 text-white dark:text-white',
        warning: 'bg-orange-500 text-white dark:text-white',
        info: 'bg-blue-500 text-white dark:text-white',
        light: 'bg-gray-400 dark:bg-white/5 text-white dark:text-white/80',
        dark: 'bg-gray-700 text-white dark:text-white',
      },
    };
    return variants[this.variant()][this.color()];
  });

  badgeClass = computed(() => {
    return `${this.baseStyles} ${this.sizeClass()} ${this.colorStyles()}`;
  });
}