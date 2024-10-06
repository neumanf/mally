import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const fadeInAnimation = (seconds: number) => {
    return trigger('fadeIn', [
        state('void', style({ opacity: 0 })),
        transition(':enter', [
            animate(`${seconds}s ease-in`, style({ opacity: 1 })),
        ]),
    ]);
};
