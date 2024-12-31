import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
    PaginationParams,
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
import { DatePipe, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

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
        Button,
        NgIf,
        TooltipModule,
        MenuModule,
        DatePipe,
    ],
    providers: [UrlShortenerService, ConfirmationService],
})
export class UrlsComponent {
    @ViewChild('pageHeader', { static: true })
    pageHeaderTemplate!: TemplateRef<never>;

    data?: Page<Url>;
    selectedUrls: Url[] = [];
    optionsItems: MenuItem[] = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Delete',
                    icon: 'ti ti-trash',
                    command: (event: MenuItemCommandEvent) => {
                        const id = event.item?.['data']['id'];

                        if (!id) return;

                        this.confirmationService.confirm({
                            target: event.originalEvent?.target as EventTarget,
                            message:
                                'Are you sure you want to delete this URL?',
                            acceptIcon: 'none',
                            rejectIcon: 'none',
                            rejectButtonStyleClass: 'p-button-text',
                            header: 'Confirmation',
                            icon: 'ti ti-alert-triangle',
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
    ) {}

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
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            header: 'Confirmation',
            icon: 'ti ti-alert-triangle',
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

    protected readonly DateUtils = DateUtils;
}
