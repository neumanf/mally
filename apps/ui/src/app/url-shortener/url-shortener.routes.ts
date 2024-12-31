import { UrlShortenerIndexComponent } from './pages/index/url-shortener-index.component';
import { Routes } from '@angular/router';

export const URL_SHORTENER_ROUTES: Routes = [
    {
        title: 'URL Shortener - Mally',
        path: '',
        component: UrlShortenerIndexComponent,
    },
];
