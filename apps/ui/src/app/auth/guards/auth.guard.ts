import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from '../services/keycloak.service';

export const authGuard: CanActivateFn = () => {
    const keycloakService = inject(KeycloakService);
    const router = inject(Router);

    if (keycloakService.keycloak?.isTokenExpired()) {
        router.navigate(['auth', 'login']);
        return false;
    }

    return true;
};
