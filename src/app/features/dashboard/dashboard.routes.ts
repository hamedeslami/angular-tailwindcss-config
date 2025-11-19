import { Routes } from '@angular/router';
import { DashboardLayout } from './layout/dashboard.layout';
import { withLangTitle } from '@shared/utils/with-lang-title';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: DashboardLayout,
        children: [
            {
                path: 'home',
                // title: withLangTitle(AUTH_TEXTS, 'login'),
                loadComponent: () =>
                    import('./pages/home/home').then(m => m.Home),
            },
            {
                path: 'users',
                // title: withLangTitle(AUTH_TEXTS, 'login'),
                loadComponent: () =>
                    import('./pages/users/users').then(m => m.Users),
            }
        ],
    },
];
