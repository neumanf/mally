import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: 'url-shortener',
        loadChildren: () =>
            import('./url-shortener/url-shortener.module').then(
                (m) => m.UrlShortenerModule
            ),
    },
    {
        path: 's/:slug',
        loadComponent: () =>
            import(
                './url-shortener/pages/redirect/url-shortener-redirect.component'
            ).then((m) => m.UrlShortenerRedirectComponent),
    },
    {
        path: '',
        loadChildren: () =>
            import('./landing/landing.module').then((m) => m.LandingModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
