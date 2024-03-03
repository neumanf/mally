import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SYNTAXES } from './constants/syntaxes';
import { SelectOption } from '../../../shared/interfaces/forms';
import {
    Paste,
    PastebinService,
    PasteRequest,
} from '../../services/pastebin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { ClipboardService } from 'ngx-clipboard';

@Component({
    selector: 'app-pastebin',
    templateUrl: './pastebin.component.html',
    styleUrl: './pastebin.component.css',
})
export class PastebinComponent {
    protected readonly modes: SelectOption<string>[] = [
        { label: 'Content', value: 'CONTENT' },
        { label: 'Preview', value: 'PREVIEW' },
    ];
    protected readonly expirations: SelectOption<string>[] = [
        { label: '7 days', value: '7d' },
    ];
    protected readonly syntaxes: SelectOption<string>[] = SYNTAXES;

    mode = 'CONTENT';
    expiration = '7d';

    form = this.formBuilder.group({
        text: new FormControl<string | null>(null, [Validators.required]),
        syntax: new FormControl<string | null>(null, [Validators.required]),
    });

    paste?: Paste;
    loading = false;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly pastebinService: PastebinService,
        private readonly toastService: ToastService,
        private readonly clipboardService: ClipboardService
    ) {}

    get text() {
        return this.form.get('text')?.value || '';
    }

    get syntax() {
        return this.form.get('syntax')?.value || '';
    }

    get URL() {
        return window.location.origin + '/p/' + this.paste?.slug;
    }

    save() {
        const data = this.form.getRawValue() as PasteRequest;

        this.loading = true;
        this.pastebinService.save(data).subscribe({
            next: ({ data }) => {
                this.paste = data;
                this.form.reset();
                this.loading = false;
            },
            error: (error: HttpErrorResponse) => {
                this.toastService.error(error.error.message);
                this.loading = false;
            },
        });
    }

    protected copyURLToClipboard() {
        this.clipboardService.copyFromContent(this.URL);
        this.toastService.success('URL copied to clipboard');
    }
}
