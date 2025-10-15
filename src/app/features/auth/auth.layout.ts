import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggle } from '@shared/components/theme-toggle/theme-toggle';
import { AuthTextService } from './services/auth-text.service';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth.layout.html'
})
export class AuthLayout {
  private textService = inject(AuthTextService);
  readonly texts = this.textService.getTexts('main');
}
