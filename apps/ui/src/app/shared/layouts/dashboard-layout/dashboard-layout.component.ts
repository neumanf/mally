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
    user?: User;

    sidebarItems: SidebarItem[] = [
        {
            label: 'MAIN',
            children: [
                {
                    label: 'Dashboard',
                    icon: 'ti ti-layout-dashboard',
                    path: '/dashboard',
                    new: false,
                },
                {
                    label: 'Short URLs',
                    icon: 'ti ti-link',
                    path: '/dashboard/short-urls',
                    new: false,
                },
            ],
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
