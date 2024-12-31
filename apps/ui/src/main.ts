import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { environment } from './environment/environment';
import {
    APP_INITIALIZER,
    enableProdMode,
    importProvidersFrom,
} from '@angular/core';
import { provideHighlightOptions } from 'ngx-highlightjs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AppComponent } from './app/app.component';
import { ToastModule } from 'primeng/toast';
import { APP_ROUTES } from './app/app.routes';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
    keycloakFactory,
    KeycloakService,
} from './app/auth/services/keycloak.service';
import { URL_SHORTENER_ROUTES } from './app/url-shortener/url-shortener.routes';
import { AUTH_ROUTES } from './app/auth/auth.routes';
import { DASHBOARD_ROUTES } from './app/dashboard/dashboard.routes';
import { LANDING_ROUTES } from './app/landing/landing.routes';
import { PASTEBIN_ROUTES } from './app/pastebin/pastebin.routes';
import { MessageService } from 'primeng/api';

if (environment.production) {
    enableProdMode();
}

dayjs.extend(relativeTime);

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            CommonModule,
            RouterModule,
            BrowserModule,
            ToastModule,
        ),
        MessageService,
        provideRouter(APP_ROUTES),
        provideRouter(AUTH_ROUTES),
        provideRouter(DASHBOARD_ROUTES),
        provideRouter(LANDING_ROUTES),
        provideRouter(PASTEBIN_ROUTES),
        provideRouter(URL_SHORTENER_ROUTES),
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
                html: () => import('highlight.js/lib/languages/vbscript-html'),
                md: () => import('highlight.js/lib/languages/markdown'),
                sql: () => import('highlight.js/lib/languages/sql'),
                vbscript: () => import('highlight.js/lib/languages/vbscript'),
                swift: () => import('highlight.js/lib/languages/swift'),
                diff: () => import('highlight.js/lib/languages/diff'),
                clojure: () => import('highlight.js/lib/languages/clojure'),
                haskell: () => import('highlight.js/lib/languages/haskell'),
                ocaml: () => import('highlight.js/lib/languages/ocaml'),
            },
        }),
        {
            provide: APP_INITIALIZER,
            deps: [KeycloakService],
            useFactory: keycloakFactory,
            multi: true,
        },
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
    ],
}).catch((err) => console.error(err));
