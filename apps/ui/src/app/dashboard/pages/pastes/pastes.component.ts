import { Component, TemplateRef, ViewChild } from '@angular/core';
import { PaginationParams } from '../../../url-shortener/services/url-shortener.service';
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
import {
    Paste,
    PastebinService,
} from '../../../pastebin/services/pastebin.service';
import { DateUtils } from '../../../shared/utils/date';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TablerIconComponent } from 'angular-tabler-icons';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

@Component({
    selector: 'app-pastes',
    templateUrl: 'pastes.component.html',
    styleUrl: 'pastes.component.scss',
    standalone: true,
    imports: [
        ToastModule,
        ConfirmDialogModule,
        TableModule,
        PrimeTemplate,
        InputTextModule,
        Button,
        TooltipModule,
        MenuModule,
        DatePipe,
        TablerIconComponent,
        ButtonComponent,
        IconField,
        InputIcon,
    ],
    providers: [ConfirmationService],
})
export class PastesComponent {
    @ViewChild('pageHeader', { static: true })
    pageHeaderTemplate!: TemplateRef<never>;

    data?: Page<Paste>;
    selectedUrls: Url[] = [];
    optionsItems: MenuItem[] = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Delete',
                    icon: 'trash',
                    command: (event: MenuItemCommandEvent) => {
                        const id = event.item?.['data']['id'];

                        if (!id) return;

                        this.confirmationService.confirm({
                            target: event.originalEvent?.target as EventTarget,
                            message:
                                'Are you sure you want to delete this Paste?',
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
        private readonly pastebinService: PastebinService,
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
        this.pastebinService.findAll(params).subscribe({
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
        this.pastebinService.delete(id).subscribe({
            next: () => {
                this.toastService.success('Paste deleted successfully');
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
            message: 'Are you sure you want to delete these Pastes?',
            rejectButtonStyleClass: 'p-button-text',
            header: 'Confirmation',
            accept: () => {
                this.pastebinService.deleteMany(ids).subscribe({
                    next: () => {
                        this.toastService.success(
                            'Pastes deleted successfully',
                        );
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
