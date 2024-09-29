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
import { KeycloakService } from '../../../auth/services/keycloak.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { DateUtils } from '../../../shared/utils/date';

@Component({
    selector: 'app-pastebin',
    templateUrl: './pastebin.component.html',
    styleUrl: './pastebin.component.css',
    animations: [
        trigger('inOutAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('0.5s ease-out', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('0.5s ease-in', style({ opacity: 0 })),
            ]),
        ]),
    ],
})
export class PastebinComponent implements OnInit {
    protected readonly modes: SelectOption<string>[] = [
        { label: 'Content', value: 'CONTENT' },
        { label: 'Preview', value: 'PREVIEW' },
    ];
    protected readonly expirations: SelectOption<string>[] = [
        { label: '1 hour', value: '1h' },
        { label: '6 hours', value: '6h' },
        { label: '1 day', value: '1d' },
        { label: '3 days', value: '3d' },
        { label: '7 days', value: '7d' },
        { label: '1 month', value: '1m' },
    ];
    protected readonly syntaxes: SelectOption<string>[] = SYNTAXES;

    mode: 'CONTENT' | 'PREVIEW' = 'CONTENT';
    expiration = '1h';

    form = this.formBuilder.group({
        title: new FormControl<string | null>(null),
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
        private readonly keycloakService: KeycloakService,
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

    userIsAuthenticated() {
        return this.keycloakService.isAuthenticated();
    }

    save() {
        const formData = this.form.getRawValue();

        const data: PasteRequest = {
            title: formData.title ?? 'Untitled',
            text: formData.text ?? '',
            syntax: formData.syntax ?? 'PLAINTEXT',
            encrypted: formData.encrypted ?? false,
            expiration: this.expiration,
        };

        if (formData.encrypted && formData.password && formData.text) {
            const encryptedText = this.encryptionService.encrypt(
                formData.text,
                formData.password,
            );

            data.text = encryptedText;
        }

        this.loading = true;
        this.paste = undefined;
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

    protected readonly DateUtils = DateUtils;
}
