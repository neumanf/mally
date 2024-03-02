import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LandingIndexComponent } from './pages/index/landing-index.component';
import { LandingRoutingModule } from './landing-routing.module';

@NgModule({
    declarations: [LandingIndexComponent],
    imports: [CommonModule, LandingRoutingModule, NgOptimizedImage],
    providers: [],
})
export class LandingModule {}
