import { AppModule } from './app/app.module';
import { platformBrowser } from '@angular/platform-browser';
import { environment } from './environment/environment';
import { enableProdMode } from '@angular/core';
import { provideHighlightOptions } from 'ngx-highlightjs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

if (environment.production) {
    enableProdMode();
}

dayjs.extend(relativeTime);

platformBrowser()
    .bootstrapModule(AppModule, {
        providers: [
            provideHighlightOptions({
                fullLibraryLoader: () => import('highlight.js'),
                lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'),
            }),
        ],
    })
    .catch((err: any) => console.error(err));
