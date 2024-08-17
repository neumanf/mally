import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';
import { LandingLayoutComponent } from './shared/layouts/landing-layout/landing-layout.component';
import { UrlShortenerRedirectComponent } from './url-shortener/pages/redirect/url-shortener-redirect.component';
import { PasteComponent } from './pastebin/pages/paste/paste.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardLayoutComponent,
        loadChildren: () =>
            import('./dashboard/dashboard.module').then(
                (m) => m.DashboardModule,
            ),
    },
    {
        path: 'url-shortener',
        component: LandingLayoutComponent,
        loadChildren: () =>
            import('./url-shortener/url-shortener.module').then(
                (m) => m.UrlShortenerModule,
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
            import('./pastebin/pastebin.module').then((m) => m.PastebinModule),
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
            import('./landing/landing.module').then((m) => m.LandingModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
