import { APP_INITIALIZER, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { UrlShortenerModule } from './url-shortener/url-shortener.module';
import { AppRoutingModule } from './app-routing.module';
import { ToastModule } from 'primeng/toast';
import { provideHighlightOptions } from 'ngx-highlightjs';
import {
    keycloakFactory,
    KeycloakService,
} from './auth/services/keycloak.service';
import { PrimeNGConfig } from 'primeng/api';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        UrlShortenerModule,
        ToastModule,
    ],
    providers: [
        provideHighlightOptions({
            coreLibraryLoader: () => import('highlight.js/lib/core'),
            lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'),
            languages: {
                plaintext: () => import('highlight.js/lib/languages/plaintext'),
                typescript: () =>
                    import('highlight.js/lib/languages/typescript'),
                css: () => import('highlight.js/lib/languages/css'),
                c: () => import('highlight.js/lib/languages/c'),
                cpp: () => import('highlight.js/lib/languages/cpp'),
                csharp: () => import('highlight.js/lib/languages/csharp'),
                java: () => import('highlight.js/lib/languages/java'),
                go: () => import('highlight.js/lib/languages/go'),
                rust: () => import('highlight.js/lib/languages/rust'),
                python: () => import('highlight.js/lib/languages/python'),
                php: () => import('highlight.js/lib/languages/php'),
                shell: () => import('highlight.js/lib/languages/shell'),
                ruby: () => import('highlight.js/lib/languages/ruby'),
            },
        }),
        {
            provide: APP_INITIALIZER,
            deps: [KeycloakService],
            useFactory: keycloakFactory,
            multi: true,
        },
    ],
})
export class AppModule implements OnInit {
    constructor(private primengConfig: PrimeNGConfig) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
