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

@Component({
    selector: 'app-paste',
    templateUrl: './paste.component.html',
    styleUrl: './paste.component.css',
    standalone: true,
    imports: [Highlight, NgIf, ButtonModule, SkeletonModule, NgForOf],
})
export class PasteComponent implements OnInit {
    protected paste?: Paste;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly pastebinService: PastebinService,
        private readonly clipboardService: ClipboardService,
        private readonly toastService: ToastService
    ) {}

    get slug() {
        return this.route.snapshot.paramMap.get('slug');
    }

    ngOnInit() {
        const slug = this.slug;

        if (!slug) return;

        this.pastebinService.get(slug).subscribe({
            next: ({ data }) => {
                this.paste = data;
            },
            error: (error: HttpErrorResponse) => {
                this.toastService.error(error.error.message);
            },
        });
    }

    copyTextToClipboard() {
        if (!this.paste) return;

        this.clipboardService.copyFromContent(this.paste.text);
        this.toastService.success('Text copied to clipboard');
    }

    protected readonly Array = Array;
}
