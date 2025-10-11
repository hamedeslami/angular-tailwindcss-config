import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
})
export class Login {
  form: FormGroup;
  submitting = false;
  error: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.error = null;
    try {
      const val = this.form.value;
      // TODO: call your auth service here. Example:
      // await this.auth.login(val.email, val.password, val.remember);
      await new Promise((r) => setTimeout(r, 700)); // demo delay
      console.log('login', val);
      // redirect on success...
    } catch (e: any) {
      this.error = e?.message || 'خطا در لاگین';
    } finally {
      this.submitting = false;
    }
  }
}
