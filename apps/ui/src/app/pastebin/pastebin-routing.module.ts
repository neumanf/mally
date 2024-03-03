import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PastebinComponent } from './pages/index/pastebin.component';

const routes: Routes = [
    {
        path: '',
        title: 'Pastebin - Mally',
        component: PastebinComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UrlShortenerRoutingModule {}
