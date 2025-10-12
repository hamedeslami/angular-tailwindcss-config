import { Component, inject } from '@angular/core';
import { AuthTextService } from '@features/auth/services/auth-text.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
})
export class Login {
  private textService = inject(AuthTextService);
  texts = this.textService.getTexts('login');
}
