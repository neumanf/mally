import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UrlShortenerService } from '../../services/url-shortener.service';
import { ClipboardService } from 'ngx-clipboard';
import { HttpErrorResponse } from '@angular/common/http';
import { URLRegex } from '../../../shared/validators/url';
import { format } from 'date-fns';
import { ToastService } from '../../../shared/services/toast/toast.service';

@Component({
    selector: 'app-url-shortener-index',
    templateUrl: './url-shortener-index.component.html',
    styleUrl: './url-shortener-index.component.scss',
})
export class UrlShortenerIndexComponent {
    protected readonly form = this.formBuilder.group({
        url: new FormControl<string | null>(null, [
            Validators.required,
            Validators.pattern(URLRegex),
        ]),
    });
    protected slug?: string;
    protected expiresAt?: string;
    protected loading = false;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly urlShortenerService: UrlShortenerService,
        private readonly clipboardService: ClipboardService,
        private readonly toastService: ToastService,
    ) {}

    protected shorten() {
        const url = this.form.get('url')?.value;

        if (!url) return;

        this.loading = true;
        this.urlShortenerService.shorten(url).subscribe({
            next: (response) => {
                this.slug = response.data.slug;
                this.expiresAt = response.data.expiresAt;
                this.loading = false;
            },
            error: (error: HttpErrorResponse) => {
                this.loading = false;
                this.toastService.error(error.error.message);
            },
        });
    }

    protected copyURLToClipboard() {
        this.clipboardService.copyFromContent(this.shortURL);
        this.toastService.success('URL copied to clipboard');
    }

    get shortURL() {
        return window.location.origin + '/s/' + this.slug;
    }

    get expirationDate() {
        if (!this.expiresAt) return;

        return format(new Date(this.expiresAt), 'yyyy-MM-dd');
    }
}
