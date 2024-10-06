import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const fadeOutAnimation = (seconds: number) => {
    return trigger('fadeOut', [
        state('void', style({ opacity: 1 })),
        transition(':leave', [
            animate(`${seconds}s ease-out`, style({ opacity: 0 })),
        ]),
    ]);
};
