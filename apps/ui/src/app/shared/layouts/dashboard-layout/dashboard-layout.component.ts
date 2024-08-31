import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '../../../auth/services/keycloak.service';
import { User } from '../../../auth/interfaces/user';

type SidebarItem = {
    label: string;
    icon?: string;
    path?: string;
    new?: boolean;
    children?: SidebarItem[];
};

@Component({
    selector: 'app-dashboard-layout',
    templateUrl: './dashboard-layout.component.html',
    styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {
    isSidebarOpen = true;
    userMenu = undefined;
    user?: User;

    sidebarItems: SidebarItem[] = [
        {
            label: 'Dashboard',
            icon: 'ti ti-dashboard',
            path: '/dashboard',
            new: false,
        },
    ];

    constructor(
        protected router: Router,
        private readonly keycloakService: KeycloakService,
    ) {
        this.user = keycloakService.user;
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout() {
        return this.keycloakService.logout();
    }

    profile() {
        return this.keycloakService.accountManagement();
    }
}
