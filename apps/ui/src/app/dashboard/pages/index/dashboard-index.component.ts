import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
    DashboardStats,
    StatsService,
} from '../../../stats/services/stats.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { SkeletonModule } from 'primeng/skeleton';
import { StatsCardComponent } from './stats-card/stats-card.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-dashboard-index',
    templateUrl: './dashboard-index.component.html',
    styleUrl: './dashboard-index.component.scss',
    standalone: true,
    imports: [NgIf, StatsCardComponent, SkeletonModule],
    providers: [StatsService],
})
export class DashboardIndexComponent implements OnInit {
    @ViewChild('pageHeader', { static: true })
    pageHeaderTemplate!: TemplateRef<never>;

    stats?: DashboardStats;
    loading = false;

    constructor(
        private readonly statsService: StatsService,
        private readonly toastService: ToastService,
    ) {}

    ngOnInit() {
        this.getDashboardStats();
    }

    getDashboardStats() {
        this.loading = true;
        this.statsService.getDashboardStats().subscribe({
            next: (data) => {
                this.stats = data.data;
                this.loading = false;
            },
            error: (err) => {
                this.toastService.error(err.error.message);
                this.loading = false;
            },
        });
    }
}
