import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ILoginForm } from '@features/auth/models/login.model';
import { AuthTextService } from '@features/auth/services/auth-text.service';
import { Button } from '@shared/components/button/button';
import { FloatingLabel } from '@shared/components/floating-label/floating-label';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FloatingLabel, Button, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private textService = inject(AuthTextService);
  readonly texts = this.textService.getTexts('login');
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

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return this.texts()[`required${controlName[0].toUpperCase() + controlName.slice(1)}`] ?? '';
    }

    if (control.errors['pattern']) {
      return this.texts()[`invalid${controlName[0].toUpperCase() + controlName.slice(1)}`] ?? '';
    }

    return '';
  }


}