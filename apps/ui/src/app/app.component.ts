import { AfterViewInit, Component } from '@angular/core';
import { fadeInAnimation } from './shared/animations/fadeIn';
import { fadeOutAnimation } from './shared/animations/fadeOut';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    animations: [fadeInAnimation(1), fadeOutAnimation(0.25)],
    standalone: true,
    imports: [ToastModule, NgIf, RouterOutlet],
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
