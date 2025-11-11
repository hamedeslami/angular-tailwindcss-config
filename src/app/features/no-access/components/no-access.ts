import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TextService } from '@core/services/text.service';
import { Button } from '@shared/components/button/button';
import { NO_ACCESS_TEXTS } from '../content/no-access.text';

@Component({
  selector: 'app-no-access',
  imports: [Button],
  templateUrl: './no-access.html',
})
export class NoAccess {
  private router = inject(Router);

  private textService = inject(TextService);
  readonly texts = this.textService.getTexts(NO_ACCESS_TEXTS, 'main');


  gotHomePage(): void {
    this.router.navigate(['/dashboard']);
  }
}
