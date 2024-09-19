import { ChangeDetectorRef, Component, TemplateRef } from '@angular/core';
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
    pageHeader!: TemplateRef<never>;

    isSidebarOpen = window.innerWidth > 640;
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
                {
                    label: 'Pastes',
                    icon: 'ti ti-clipboard',
                    path: '/dashboard/pastes',
                    new: false,
                },
            ],
        },
    ];

    constructor(
        protected readonly router: Router,
        private readonly keycloakService: KeycloakService,
        private readonly cdr: ChangeDetectorRef,
    ) {
        this.user = keycloakService.user;
    }

    onChildActivate(component: { pageHeaderTemplate?: TemplateRef<never> }) {
        if (component.pageHeaderTemplate) {
            this.pageHeader = component.pageHeaderTemplate;
            this.cdr.detectChanges();
        }
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
