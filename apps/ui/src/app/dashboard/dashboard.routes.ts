import { DashboardIndexComponent } from './pages/index/dashboard-index.component';
import { Routes } from '@angular/router';
import { UrlsComponent } from './pages/urls/urls.component';
import { PastesComponent } from './pages/pastes/pastes.component';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: DashboardIndexComponent,
    },
    {
        path: 'short-urls',
        component: UrlsComponent,
    },
    {
        path: 'pastes',
        component: PastesComponent,
    },
];
