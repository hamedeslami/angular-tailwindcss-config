import { Routes } from '@angular/router';
import { AuthLayout } from './auth.layout';
import { withLangTitle } from '@shared/utils/with-lang-title';
import { AUTH_TEXTS } from './content/auth.texts';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                title: withLangTitle(AUTH_TEXTS, 'login'),
                loadComponent: () =>
                    import('./pages/login/login').then(m => m.Login),
            },
            {
                path: 'forgot-password',
                title: withLangTitle(AUTH_TEXTS, 'forgotPassword'),
                loadComponent: () =>
                    import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword),
            },
            {
                path: 'verification-code',
                title: withLangTitle(AUTH_TEXTS, 'verificationCode'),
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
