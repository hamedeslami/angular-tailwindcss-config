import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthTextService } from '@features/auth/services/auth-text.service';
import { Button } from '@shared/components/button/button';
import { FloatingLabel } from '@shared/components/floating-label/floating-label';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FloatingLabel, Button, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  loading = signal(false);
  form!: FormGroup;

  private textService = inject(AuthTextService);
  texts = this.textService.getTexts('login');

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[^\u0600-\u06FF\s]+$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[^\u0600-\u06FF\s]+$/),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.value);
  }

  isLoading(): boolean {
    return false;
  }
}
