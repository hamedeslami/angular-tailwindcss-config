import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    },
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    },
    {
        path: 'no-access',
        loadChildren: () =>
            import('./features/no-access/no-access.routes').then(m => m.NO_ACCESS_ROUTES),
    },
    {
        path: '**',
        loadChildren: () =>
            import('./features/not-found/not-found.routes').then(m => m.NOT_FOUND_ROUTES),
    }
];
