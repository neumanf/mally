import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
    selector: 'app-landing-layout',
    templateUrl: './landing-layout.component.html',
    styleUrl: './landing-layout.component.scss',
    standalone: true,
    imports: [HeaderComponent, RouterOutlet, FooterComponent],
})
export class LandingLayoutComponent {}
