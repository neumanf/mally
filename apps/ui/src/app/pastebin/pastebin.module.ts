import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PastebinComponent } from './pages/index/pastebin.component';
import { UrlShortenerRoutingModule } from './pastebin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Highlight } from 'ngx-highlightjs';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { QRCodeModule } from 'angularx-qrcode';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
    declarations: [PastebinComponent],
    imports: [
        CommonModule,
        UrlShortenerRoutingModule,
        ReactiveFormsModule,
        InputTextareaModule,
        Highlight,
        DropdownModule,
        SelectButtonModule,
        FormsModule,
        ButtonModule,
        QRCodeModule,
        TooltipModule,
    ],
})
export class PastebinModule {}