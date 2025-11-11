import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TextService } from '@core/services/text.service';
import { Button } from '@shared/components/button/button';
import { NOT_FOUND_TEXTS } from '../content/not-found.text';

@Component({
  selector: 'app-not-found',
  imports: [Button],
  templateUrl: './not-found.html',
})
export class NotFound {
  private router = inject(Router);

  private textService = inject(TextService);
  readonly texts = this.textService.getTexts(NOT_FOUND_TEXTS, 'main');


  gotHomePage(): void {
    this.router.navigate(['/dashboard']);
  }
}
