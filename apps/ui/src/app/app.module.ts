import { NgModule } from '@angular/core';
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
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

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
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'),
                languages: {
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
            },
        },
    ],
})
export class AppModule {}
