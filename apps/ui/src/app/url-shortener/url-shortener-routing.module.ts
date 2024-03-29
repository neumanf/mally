import { NgModule } from '@angular/core';
import { UrlShortenerIndexComponent } from './pages/index/url-shortener-index.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        title: 'URL Shortener - Mally',
        path: '',
        component: UrlShortenerIndexComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UrlShortenerRoutingModule {}
