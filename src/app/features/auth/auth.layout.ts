import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RevealCanvas } from '@shared/components/reveal-canvas/reveal-canvas';
import { ThemeToggle } from '@shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage, ThemeToggle, RevealCanvas],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth.layout.html'
})
export class AuthLayout {
  
}
