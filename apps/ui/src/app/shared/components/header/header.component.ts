import { Component, ElementRef, ViewChild } from '@angular/core';
import { KeycloakService } from '../../../auth/services/keycloak.service';
import { fadeInAnimation } from '../../animations/fadeIn';
import { fadeOutAnimation } from '../../animations/fadeOut';
import { SidebarModule } from 'primeng/sidebar';
import { FeaturesMenuComponent } from './components/features-menu.component';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    animations: [fadeInAnimation(0.2), fadeOutAnimation(0.2)],
    standalone: true,
    imports: [
        RouterLink,
        NgOptimizedImage,
        NgIf,
        FeaturesMenuComponent,
        SidebarModule,
    ],
})
export class HeaderComponent {
    @ViewChild('featuresButton') featuresButton?: ElementRef;
    @ViewChild('featuresMenu') featuresMenu?: ElementRef;

    isFeaturesMenuOpen = false;
    isSidebarOpen = false;
    userIsAuthenticated = false;

    constructor(private readonly keycloakService: KeycloakService) {
        this.userIsAuthenticated = keycloakService.isAuthenticated();
    }

    openFeatures() {
        this.isFeaturesMenuOpen = true;
    }

    closeFeatures() {
        this.isFeaturesMenuOpen = false;
    }

    openSidebar() {
        this.isSidebarOpen = true;
    }

    closeSidebar() {
        this.isSidebarOpen = false;
    }
}
