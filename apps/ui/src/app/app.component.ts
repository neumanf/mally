import { AfterViewInit, Component } from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    animations: [
        trigger('fadeIn', [
            state('void', style({ opacity: 0 })), // Initial state: hidden
            transition(':enter', [
                animate('1s ease-in', style({ opacity: 1 })), // Animate to visible state
            ]),
        ]),
        trigger('fadeOut', [
            state('void', style({ opacity: 1 })), // Initial state: visible
            transition(':leave', [
                animate('0.25s ease-out', style({ opacity: 0 })), // Fade-out animation
            ]),
        ]),
    ],
})
export class AppComponent implements AfterViewInit {
    title = 'ui';
    splashVisible = true;

    ngAfterViewInit() {
        setTimeout(() => {
            this.splashVisible = false; // Trigger fade-out after timeout
        }, 250);
    }
}
