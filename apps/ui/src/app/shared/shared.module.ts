import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FeaturesMenuComponent } from './components/header/components/features-menu.component';
import { MessageService } from 'primeng/api';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarModule } from 'primeng/sidebar';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AvatarModule } from 'primeng/avatar';
import { LandingLayoutComponent } from './layouts/landing-layout/landing-layout.component';

@NgModule({
    declarations: [
        HeaderComponent,
        FeaturesMenuComponent,
        FooterComponent,
        DashboardLayoutComponent,
        LandingLayoutComponent,
    ],
    imports: [
        CommonModule,
        RouterLink,
        SidebarModule,
        OverlayPanelModule,
        AvatarModule,
        RouterOutlet,
        NgOptimizedImage,
    ],
    exports: [HeaderComponent, FooterComponent],
    providers: [MessageService],
})
export class SharedModule {}
