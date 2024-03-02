import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { RouterLink } from '@angular/router';
import { FeaturesMenuComponent } from './components/header/components/features-menu.component';
import { MessageService } from 'primeng/api';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
    declarations: [HeaderComponent, FeaturesMenuComponent, FooterComponent],
    imports: [CommonModule, RouterLink, SidebarModule],
    exports: [HeaderComponent, FooterComponent],
    providers: [MessageService],
})
export class SharedModule {}
