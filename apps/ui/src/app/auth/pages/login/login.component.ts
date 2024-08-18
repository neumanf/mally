import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../../services/keycloak.service';

@Component({
    selector: 'app-login',
    template: ``,
    styles: ``,
})
export class LoginComponent implements OnInit {
    constructor(private readonly keycloakService: KeycloakService) {}

    async ngOnInit() {
        await this.keycloakService.login();
    }
}
