import { Routes } from '@angular/router';
import { AuthLayout } from './auth.layout';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                title: 'ورود به حساب کاربری',
                loadComponent: () =>
                    import('./pages/login/login').then(m => m.Login),
            },
            {
                path: 'forgot-password',
                title: 'فراموشی رمز عبور',
                loadComponent: () =>
                    import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword),
            },
            {
                path: 'verification-code',
                title: 'کد یکبار مصرف',
                loadComponent: () =>
                    import('./pages/verification-code/verification-code').then(m => m.VerificationCode),
            },
            {
                path: '',
                redirectTo: '/auth/login',
                pathMatch: 'full',
            },
        ],
    },
];
