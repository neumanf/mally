import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { User } from '../interfaces/user';
import { environment } from '../../../environment/environment';

@Injectable({
    providedIn: 'root',
})
export class KeycloakService {
    private _keycloak?: Keycloak;
    private _user?: User;

    get keycloak() {
        if (!this._keycloak) {
            this._keycloak = new Keycloak({
                url: environment.keycloakUrl,
                realm: environment.keycloakRealm,
                clientId: environment.keycloadClientId,
            });
        }
        return this._keycloak;
    }

    get user() {
        return this._user;
    }

    async init() {
        const authenticated = await this.keycloak?.init({
            onLoad: 'check-sso',
        });

        if (authenticated) {
            this._user = await this.keycloak?.loadUserProfile();
        }
    }

    login() {
        return this.keycloak?.login({
            redirectUri: environment.clientUrl + '/dashboard',
        });
    }

    register() {
        return this.keycloak?.register();
    }

    logout() {
        return this.keycloak?.logout({
            redirectUri: environment.clientUrl,
        });
    }

    accountManagement() {
        return this.keycloak?.accountManagement();
    }

    getAccessToken() {
        return this.keycloak?.token;
    }
}

export function keycloakFactory(keycloakService: KeycloakService) {
    return () => keycloakService.init();
}
