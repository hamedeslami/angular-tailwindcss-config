import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggle } from '@shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth.layout.html'
})
export class AuthLayout {
  
}
