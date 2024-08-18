import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../../services/keycloak.service';

@Component({
    selector: 'app-register',
    template: ``,
    styles: ``,
})
export class RegisterComponent implements OnInit {
    constructor(private readonly keycloakService: KeycloakService) {}

    async ngOnInit() {
        await this.keycloakService.register();
    }
}
