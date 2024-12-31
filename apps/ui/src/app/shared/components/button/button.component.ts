import { Component, Input } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [ButtonDirective, TablerIconComponent],
    template: `
        <button
            [severity]="severity"
            [loading]="loading"
            [disabled]="disabled"
            pButton
        >
            @if (!loading) {
                <i-tabler [name]="iconName" pButtonIcon></i-tabler>
            }
            @if (label) {
                <span pButtonLabel>{{ label }}</span>
            }
        </button>
    `,
    styles: ``,
})
export class ButtonComponent {
    @Input() iconName!: string;
    @Input() label!: string;
    @Input() severity: ButtonDirective['severity'] = 'primary';
    @Input() disabled: boolean = false;
    @Input() loading: boolean = false;
}
