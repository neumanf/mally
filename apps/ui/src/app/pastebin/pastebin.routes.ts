import { Routes } from '@angular/router';
import { PastebinComponent } from './pages/index/pastebin.component';

export const PASTEBIN_ROUTES: Routes = [
    {
        path: '',
        title: 'Pastebin - Mally',
        component: PastebinComponent,
    },
];
