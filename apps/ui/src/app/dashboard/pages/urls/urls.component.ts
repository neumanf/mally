import {
    ChangeDetectorRef,
    Component,
    OnInit,
    signal,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import {
    PaginationParams,
    UrlClickHistory,
    UrlShortenerService,
} from '../../../url-shortener/services/url-shortener.service';
import { Url } from '../../../shared/interfaces/url';
import { HttpErrorResponse } from '@angular/common/http';
import {
    ConfirmationService,
    MenuItem,
    MenuItemCommandEvent,
    PrimeTemplate,
} from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { Page } from '../../../shared/interfaces/http';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { DateUtils } from '../../../shared/utils/date';
import { TooltipModule } from 'primeng/tooltip';
import { DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TablerIconComponent } from 'angular-tabler-icons';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Dialog } from 'primeng/dialog';
import { UIChart } from 'primeng/chart';
import dayjs from 'dayjs';
import { ChartData } from 'chart.js';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-urls',
    templateUrl: 'urls.component.html',
    styleUrl: 'urls.component.scss',
    standalone: true,
    imports: [
        ToastModule,
        ConfirmDialogModule,
        TableModule,
        PrimeTemplate,
        InputTextModule,
        TooltipModule,
        MenuModule,
        DatePipe,
        TablerIconComponent,
        ButtonComponent,
        IconField,
        InputIcon,
        Dialog,
        UIChart,
    ],
    providers: [UrlShortenerService, ConfirmationService],
})
export class UrlsComponent implements OnInit {
    @ViewChild('pageHeader', { static: true })
    pageHeaderTemplate!: TemplateRef<never>;

    private readonly HISTORY_DATE_FORMAT = 'YYYY-MM-DD';

    historyVisible = signal<boolean>(false);
    loadingHistory = signal<boolean>(false);
    history = signal<ChartData | null>(null);
    historyChartOptions = signal({});

    data?: Page<Url>;
    selectedUrls: Url[] = [];
    optionsItems: MenuItem[] = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Click history',
                    icon: 'graph',
                    command: (event: MenuItemCommandEvent) => {
                        const id = event.item?.['data']['id'];

                        if (!id) return;

                        const url = this.data?.content.find((d) => d.id === id);

                        if (!url) return;

                        this.loadingHistory.set(true);
                        this.urlShortenerService
                            .getHistory(id)
                            .pipe(
                                finalize(() => this.loadingHistory.set(false)),
                            )
                            .subscribe({
                                next: (history) =>
                                    this.showHistory(history, url),
                                error: (error: HttpErrorResponse) => {
                                    this.toastService.error(
                                        error.error.message ??
                                            'Something went wrong',
                                    );
                                },
                            });
                    },
                },
                {
                    label: 'Delete',
                    icon: 'trash',
                    command: (event: MenuItemCommandEvent) => {
                        const id = event.item?.['data']['id'];

                        if (!id) return;

                        this.confirmationService.confirm({
                            target: event.originalEvent?.target as EventTarget,
                            message:
                                'Are you sure you want to delete this URL?',
                            rejectButtonStyleClass: 'p-button-text',
                            header: 'Confirmation',
                            accept: () => this.delete(id),
                        });
                    },
                },
            ],
        },
    ];

    protected readonly window = window;
    private lastLazyLoadEvent!: TableLazyLoadEvent;
    private searchQuery?: string;
    protected loadingData: boolean = false;

    constructor(
        private readonly urlShortenerService: UrlShortenerService,
        private readonly confirmationService: ConfirmationService,
        private readonly toastService: ToastService,
        private readonly changeDetector: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.initChart();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--p-text-muted-color',
        );
        const surfaceBorder = documentStyle.getPropertyValue(
            '--p-content-border-color',
        );

        this.historyChartOptions.set({
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        });
        this.changeDetector.detectChanges();
    }

    onLoad(event: TableLazyLoadEvent) {
        this.lastLazyLoadEvent = event;

        const sortBy = event.sortField as string | undefined;
        const orderBy = event.sortOrder === 1 ? 'ASC' : 'DESC';
        const search = this.searchQuery;
        const pageNumber =
            event.first === 0 || event.first == undefined
                ? 0
                : event.first / (event.rows == undefined ? 1 : event.rows);

        this.fetchUrls({
            sortBy,
            orderBy,
            search,
            pageNumber: pageNumber.toString(),
        });
    }

    fetchUrls(params?: PaginationParams) {
        this.loadingData = true;
        this.urlShortenerService.findAll(params).subscribe({
            next: (data) => {
                this.data = data;
                this.loadingData = false;
            },
            error: (error: HttpErrorResponse) => {
                this.toastService.error(error.error.message);
                this.loadingData = false;
            },
        });
    }

    delete(id: number) {
        this.urlShortenerService.delete(id).subscribe({
            next: () => {
                this.toastService.success('URL deleted successfully');
                this.fetchUrls();
            },
            error: (error: HttpErrorResponse) => {
                this.toastService.error(error.error.message);
            },
        });
    }

    deleteMany() {
        const ids = this.selectedUrls.map((url) => url.id);

        this.confirmationService.confirm({
            message: 'Are you sure you want to delete these URLs?',
            rejectButtonStyleClass: 'p-button-text',
            header: 'Confirmation',
            accept: () => {
                this.urlShortenerService.deleteMany(ids).subscribe({
                    next: () => {
                        this.toastService.success('URLs deleted successfully');
                        this.fetchUrls();
                    },
                    error: (error: HttpErrorResponse) => {
                        this.toastService.error(error.error.message);
                    },
                });
            },
        });
    }

    search(event: Event) {
        this.searchQuery = (event.target as HTMLInputElement).value;

        this.onLoad(this.lastLazyLoadEvent);
    }

    openOptionsMenu(menu: Menu, event: MouseEvent, url: Url) {
        const options = this.optionsItems.at(0);

        options?.items?.forEach((item) => {
            item['data'] = url;
        });
        menu.toggle(event);
    }

    showHistory(history: UrlClickHistory, url: Url) {
        this.history.set(null);

        const clicksPerDay: Record<string, number> = {};

        let currentDay = dayjs(url.createdAt) ?? dayjs().subtract(30, 'days');
        const today = dayjs().format(this.HISTORY_DATE_FORMAT);

        while (currentDay.format(this.HISTORY_DATE_FORMAT) !== today) {
            clicksPerDay[currentDay.format(this.HISTORY_DATE_FORMAT)] = 0;

            currentDay = currentDay.add(1, 'days');
        }

        history.data.forEach(({ timestamp }) => {
            const dayTimestamp = dayjs(timestamp).format(
                this.HISTORY_DATE_FORMAT,
            );

            if (clicksPerDay[dayTimestamp]) {
                clicksPerDay[dayTimestamp]++;
            } else {
                clicksPerDay[dayTimestamp] = 1;
            }
        });

        if (Object.entries(clicksPerDay).length === 0)
            return this.historyVisible.set(true);

        const labels = Object.keys(clicksPerDay);
        const data = Object.values(clicksPerDay);

        const documentStyle = getComputedStyle(document.documentElement);

        this.history.set({
            labels,
            datasets: [
                {
                    label: 'Clicks',
                    data,
                    borderColor: documentStyle.getPropertyValue('--p-red-500'),
                    hoverRadius: 12,
                    pointRadius: 8,
                },
            ],
        });
        this.historyVisible.set(true);
    }

    protected readonly DateUtils = DateUtils;
}
