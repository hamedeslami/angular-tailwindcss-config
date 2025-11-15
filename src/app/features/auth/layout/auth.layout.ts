import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TextService } from '@core/services/text.service';
import { ThemeToggle } from './components/theme-toggle/theme-toggle';
import { AUTH_TEXTS } from '../content/auth.texts';


@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth.layout.html'
})
export class AuthLayout {
  private textService = inject(TextService);
  readonly texts = this.textService.getTexts(AUTH_TEXTS, 'main');
}
