import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LandingIndexComponent } from './pages/index/landing-index.component';
import { LandingRoutingModule } from './landing-routing.module';
import { Button } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';

@NgModule({
    declarations: [LandingIndexComponent],
    imports: [
        CommonModule,
        LandingRoutingModule,
        NgOptimizedImage,
        Button,
        AccordionModule,
        TagModule,
    ],
    providers: [],
})
export class LandingModule {}
