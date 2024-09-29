import { Component, OnInit } from '@angular/core';
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
import { EncryptionService } from '../../../shared/services/encryption/encryption.service';

@Component({
    selector: 'app-pastebin',
    templateUrl: './pastebin.component.html',
    styleUrl: './pastebin.component.css',
})
export class PastebinComponent implements OnInit {
    protected readonly modes: SelectOption<string>[] = [
        { label: 'Content', value: 'CONTENT' },
        { label: 'Preview', value: 'PREVIEW' },
    ];
    protected readonly expirations: SelectOption<string>[] = [
        { label: '7 days', value: '7d' },
    ];
    protected readonly syntaxes: SelectOption<string>[] = SYNTAXES;

    mode: 'CONTENT' | 'PREVIEW' = 'CONTENT';
    expiration = '7d';

    form = this.formBuilder.group({
        text: new FormControl<string | null>(null, [Validators.required]),
        syntax: new FormControl<string | null>(null, [Validators.required]),
        encrypted: new FormControl<boolean>(false, [Validators.required]),
        password: new FormControl<string | null>(null),
    });

    paste?: Paste;
    loading = false;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly pastebinService: PastebinService,
        private readonly toastService: ToastService,
        private readonly clipboardService: ClipboardService,
        private readonly encryptionService: EncryptionService,
    ) {}

    ngOnInit() {
        this.updatePasswordValidity();
    }

    private updatePasswordValidity() {
        this.form.get('encrypted')?.valueChanges.subscribe((encrypted) => {
            if (encrypted) {
                this.form.controls['password'].setValidators([
                    Validators.required,
                ]);
            } else {
                this.form.controls['password'].clearValidators();
            }
            this.form.controls['password'].updateValueAndValidity();
        });
    }

    get text() {
        return this.form.get('text')?.value || '';
    }

    get syntax() {
        return this.form.get('syntax')?.value || '';
    }

    get encrypted() {
        return this.form.get('encrypted')?.value || false;
    }

    get URL() {
        return window.location.origin + '/p/' + this.paste?.slug;
    }

    save() {
        const formData = this.form.getRawValue();

        const data: PasteRequest = {
            text: formData.text ?? '',
            syntax: formData.syntax ?? 'PLAINTEXT',
            encrypted: formData.encrypted ?? false,
        };

        if (formData.encrypted && formData.password && formData.text) {
            const encryptedText = this.encryptionService.encrypt(
                formData.text,
                formData.password,
            );

            data.text = encryptedText;
        }

        this.loading = true;
        this.pastebinService.save(data).subscribe({
            next: ({ data }) => {
                this.paste = data;
                this.form.reset({ encrypted: false });
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
