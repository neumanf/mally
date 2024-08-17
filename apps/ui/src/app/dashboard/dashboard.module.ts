import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DashboardIndexComponent } from './pages/index/dashboard-index.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
    declarations: [DashboardIndexComponent],
    imports: [CommonModule, DashboardRoutingModule, NgOptimizedImage],
    providers: [],
})
export class DashboardModule {}
