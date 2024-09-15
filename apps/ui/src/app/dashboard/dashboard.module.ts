import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DashboardIndexComponent } from './pages/index/dashboard-index.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { UrlsComponent } from './pages/urls/urls.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Button } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { StatsService } from '../stats/services/stats.service';
import { SkeletonModule } from 'primeng/skeleton';
import { StatsCardComponent } from './pages/index/stats-card/stats-card.component';

@NgModule({
    declarations: [DashboardIndexComponent, UrlsComponent, StatsCardComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        NgOptimizedImage,
        DropdownModule,
        InputTextModule,
        TableModule,
        ToastModule,
        Button,
        ToolbarModule,
        MenuModule,
        ConfirmDialogModule,
        SkeletonModule,
    ],
    providers: [ConfirmationService, StatsService],
})
export class DashboardModule {}
