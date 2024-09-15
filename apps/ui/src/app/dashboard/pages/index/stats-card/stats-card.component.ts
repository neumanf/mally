import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stats-card',
    template: `
        <div class="flex justify-between bg-zinc-700 rounded p-3">
            <div class="flex flex-col">
                <span class="font-medium">{{ title }}</span>
                <span class="font-bold text-4xl">{{ data }}</span>
            </div>
            <div>
                <a
                    class="flex items-center text-white hover:bg-zinc-500 p-2 rounded transition"
                    [routerLink]="link"
                    ><i class="ti ti-external-link"></i
                ></a>
            </div>
        </div>
    `,
    styles: ``,
})
export class StatsCardComponent {
    @Input() title!: string;
    @Input() data?: number;
    @Input() link!: string;
}
