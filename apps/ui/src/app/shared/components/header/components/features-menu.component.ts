import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
    selector: 'app-features-menu',
    templateUrl: './features-menu.component.html',
    styleUrl: './features-menu.component.css',
    standalone: true,
    imports: [RouterLink, TablerIconComponent],
    providers: [],
})
export class FeaturesMenuComponent {}
