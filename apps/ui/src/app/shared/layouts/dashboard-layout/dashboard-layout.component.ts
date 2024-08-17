import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

    sidebarItems: SidebarItem[] = [
        {
            label: 'Dashboard',
            icon: 'ti ti-dashboard',
            path: '/dashboard',
            new: false,
        },
        {
            label: 'Admin',
            children: [
                {
                    label: 'Users',
                    icon: 'ti ti-user',
                    path: '/dashboard/admin/users',
                    new: false,
                },
            ],
        },
    ];

    constructor(protected router: Router) {}

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout() {}
}
