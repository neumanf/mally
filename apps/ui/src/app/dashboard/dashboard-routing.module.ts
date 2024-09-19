import { NgModule } from '@angular/core';
import { DashboardIndexComponent } from './pages/index/dashboard-index.component';
import { RouterModule, Routes } from '@angular/router';
import { UrlsComponent } from './pages/urls/urls.component';
import { PastesComponent } from './pages/pastes/pastes.component';

const routes: Routes = [
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

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
