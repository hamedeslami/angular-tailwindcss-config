import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TextService } from '@core/services/text.service';
import { AUTH_TEXTS } from '@features/auth/content/auth.texts';
import { ILoginForm } from '@features/auth/models/login.model';
import { Button } from '@shared/components/button/button';
import { FloatingLabel } from '@shared/components/floating-label/floating-label';
import { getErrorMessage } from '@shared/utils/get-error-message';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FloatingLabel, Button, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private textService = inject(TextService);
  readonly texts = this.textService.getTexts(AUTH_TEXTS, 'login');

  readonly loading = signal(false);
  readonly form: FormGroup<ILoginForm>;

  readonly isLoading = computed(() => this.loading());

  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.nonNullable.group({
      username: ['', [Validators.required, Validators.pattern(/^[^\u0600-\u06FF\s]+$/)]],
      password: ['', [Validators.required, Validators.pattern(/^[^\u0600-\u06FF\s]+$/)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    this.loading.set(true);
    console.log({ username, password: '••••••' });
  }

  getError(controlName: string): string {
    return getErrorMessage(this.form, controlName, this.texts());
  }

}