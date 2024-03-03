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
        title: 'Short URL - Mally',
        loadComponent: () =>
            import(
                './url-shortener/pages/redirect/url-shortener-redirect.component'
            ).then((m) => m.UrlShortenerRedirectComponent),
    },
    {
        path: 'pastebin',
        loadChildren: () =>
            import('./pastebin/pastebin.module').then((m) => m.PastebinModule),
    },
    {
        path: 'p/:slug',
        title: 'Paste - Mally',
        loadComponent: () =>
            import('./pastebin/pages/paste/paste.component').then(
                (m) => m.PasteComponent
            ),
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
