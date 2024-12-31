import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Paste, PastebinService } from '../../services/pastebin.service';
import { Highlight } from 'ngx-highlightjs';
import { NgForOf, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { ClipboardService } from 'ngx-clipboard';
import { HttpErrorResponse } from '@angular/common/http';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { EncryptionService } from '../../../shared/services/encryption/encryption.service';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { TablerIconComponent } from 'angular-tabler-icons';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
    selector: 'app-paste',
    templateUrl: './paste.component.html',
    styleUrl: './paste.component.css',
    standalone: true,
    imports: [
        Highlight,
        HighlightLineNumbers,
        NgIf,
        ButtonModule,
        SkeletonModule,
        NgForOf,
        DialogModule,
        FormsModule,
        PasswordModule,
        TablerIconComponent,
        ButtonComponent,
    ],
})
export class PasteComponent implements OnInit {
    protected paste?: Paste;
    protected password?: string;
    protected decryptModalVisible = false;
    protected decrypted = false;

    protected readonly Array = Array;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly pastebinService: PastebinService,
        private readonly clipboardService: ClipboardService,
        private readonly toastService: ToastService,
        private readonly encryptionService: EncryptionService,
    ) {}

    ngOnInit() {
        const slug = this.slug;

        if (!slug) return;

        this.pastebinService.get(slug).subscribe({
            next: ({ data }) => {
                this.paste = data;

                if (this.paste.encrypted) {
                    this.decryptModalVisible = true;
                }
            },
            error: (error: HttpErrorResponse) => {
                this.toastService.error(error.error.message);
            },
        });
    }

    get slug() {
        return this.route.snapshot.paramMap.get('slug');
    }

    get text() {
        if (this.paste?.encrypted && !this.decrypted) {
            return 'The paste is encrypted. Insert the password to continue.';
        }

        return this.paste?.text ?? '';
    }

    copyTextToClipboard() {
        if (!this.paste) return;

        this.clipboardService.copyFromContent(this.paste.text);
        this.toastService.success('Text copied to clipboard');
    }

    decrypt() {
        if (!this.password || !this.paste?.text) return;

        try {
            const decryptedText = this.encryptionService.decrypt(
                this.paste.text,
                this.password,
            );

            this.paste.text = decryptedText;
            this.decryptModalVisible = false;
            this.decrypted = true;
        } catch (e) {
            this.toastService.error('Wrong password');
        }
    }
}
