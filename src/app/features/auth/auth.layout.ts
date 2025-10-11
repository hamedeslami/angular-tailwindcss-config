import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="flex min-h-screen items-center justify-center bg-gray-50">
      <section class="w-full max-w-md p-6">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
})
export class AuthLayout {}
