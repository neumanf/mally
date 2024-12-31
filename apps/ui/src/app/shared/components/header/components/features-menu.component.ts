import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-features-menu',
    templateUrl: './features-menu.component.html',
    styleUrl: './features-menu.component.css',
    standalone: true,
    imports: [RouterLink],
})
export class FeaturesMenuComponent {}
