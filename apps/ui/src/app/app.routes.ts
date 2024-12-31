import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';
import { LandingLayoutComponent } from './shared/layouts/landing-layout/landing-layout.component';
import { UrlShortenerRedirectComponent } from './url-shortener/pages/redirect/url-shortener-redirect.component';
import { PasteComponent } from './pastebin/pages/paste/paste.component';
import { authGuard } from './auth/guards/auth.guard';

export const APP_ROUTES: Routes = [
    {
        path: 'dashboard',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        loadChildren: () =>
            import('./dashboard/dashboard.routes').then(
                (m) => m.DASHBOARD_ROUTES,
            ),
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: 'url-shortener',
        component: LandingLayoutComponent,
        loadChildren: () =>
            import('./url-shortener/url-shortener.routes').then(
                (m) => m.URL_SHORTENER_ROUTES,
            ),
    },
    {
        path: 's/:slug',
        title: 'Short URL - Mally',
        component: LandingLayoutComponent,
        children: [
            {
                path: '',
                component: UrlShortenerRedirectComponent,
            },
        ],
    },
    {
        path: 'pastebin',
        component: LandingLayoutComponent,
        loadChildren: () =>
            import('./pastebin/pastebin.routes').then((m) => m.PASTEBIN_ROUTES),
    },
    {
        path: 'p/:slug',
        title: 'Paste - Mally',
        component: LandingLayoutComponent,
        children: [
            {
                path: '',
                component: PasteComponent,
            },
        ],
    },
    {
        path: '',
        pathMatch: 'full',
        component: LandingLayoutComponent,
        loadChildren: () =>
            import('./landing/landing.routes').then((m) => m.LANDING_ROUTES),
    },
];
