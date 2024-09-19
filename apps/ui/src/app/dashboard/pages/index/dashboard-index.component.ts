import { Component, OnInit } from '@angular/core';
import {
    DashboardStats,
    StatsService,
} from '../../../stats/services/stats.service';
import { ToastService } from '../../../shared/services/toast/toast.service';

@Component({
    selector: 'app-dashboard-index',
    templateUrl: './dashboard-index.component.html',
    styleUrl: './dashboard-index.component.scss',
})
export class DashboardIndexComponent implements OnInit {
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
