import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-landing-index',
    templateUrl: './landing-index.component.html',
    styleUrl: './landing-index.component.scss',
    standalone: true,
    imports: [NgOptimizedImage, TagModule, RouterLink, AccordionModule],
})
export class LandingIndexComponent {}
