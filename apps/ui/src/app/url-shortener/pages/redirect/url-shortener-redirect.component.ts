import { Component } from '@angular/core';
import { UrlShortenerService } from '../../services/url-shortener.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toast/toast.service';

@Component({
    selector: 'app-url-shortener-redirect',
    templateUrl: './url-shortener-redirect.component.html',
    styleUrl: './url-shortener-redirect.component.scss',
    standalone: true,
    imports: [],
})
export class UrlShortenerRedirectComponent {
    constructor(
        private readonly urlShortenerService: UrlShortenerService,
        private readonly route: ActivatedRoute,
        private readonly toastService: ToastService,
    ) {
        this.route.params.subscribe((params) => {
            if (!params['slug']) {
                window.location.href = '/';
            }

            this.urlShortenerService.redirect(params['slug']).subscribe({
                next: (response) => {
                    if (response.data.url) {
                        window.location.href = response.data.url;
                    }
                },
                error: (error: HttpErrorResponse) => {
                    if (error.status === 400) {
                        this.toastService.error(error.error.message);
                    } else {
                        this.toastService.error('Something went wrong');
                    }

                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                },
            });
        });
    }
}
