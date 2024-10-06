import { AfterViewInit, Component } from '@angular/core';
import { fadeInAnimation } from './shared/animations/fadeIn';
import { fadeOutAnimation } from './shared/animations/fadeOut';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    animations: [fadeInAnimation(1), fadeOutAnimation(0.25)],
})
export class AppComponent implements AfterViewInit {
    title = 'ui';
    splashVisible = true;

    ngAfterViewInit() {
        setTimeout(() => {
            this.splashVisible = false;
        }, 250);
    }
}
