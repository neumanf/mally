import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UrlShortenerIndexComponent } from './pages/index/url-shortener-index.component';
import { UrlShortenerRoutingModule } from './url-shortener-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UrlShortenerService } from './services/url-shortener.service';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
    declarations: [UrlShortenerIndexComponent],
    imports: [
        CommonModule,
        UrlShortenerRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        ClipboardModule,
        NgOptimizedImage,
        InputTextModule,
        ButtonModule,
        TooltipModule,
        QRCodeModule,
    ],
    providers: [UrlShortenerService],
})
export class UrlShortenerModule {}
