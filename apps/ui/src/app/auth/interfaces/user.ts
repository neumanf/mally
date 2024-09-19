import { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';

export class User {
    id?: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    emailVerified?: boolean;
    roles?: string[];

    isAdmin() {
        return !!this.roles?.includes(UserRole.ADMIN);
    }

    isFreeUser() {
        return !!this.roles?.includes(UserRole.FREE_USER);
    }

    get role() {
        if (this.isAdmin()) return UserRole.ADMIN;
        return UserRole.FREE_USER;
    }

    get formattedRole() {
        switch (this.role) {
            case 'ADMIN':
                return 'Admin';
            case 'FREE_USER':
                return 'Free plan';
            default:
                return '';
        }
    }

    get fullName() {
        return `${this.firstName?.split(' ').at(0)} ${this.lastName?.split(' ').at(0)}`;
    }

    static fromKeycloak(profile: KeycloakProfile, jwt?: KeycloakTokenParsed) {
        const user = new User();
        user.id = profile?.id;
        user.username = profile?.username;
        user.email = profile?.email;
        user.firstName = profile?.firstName;
        user.lastName = profile?.lastName;
        user.emailVerified = profile?.emailVerified;
        user.roles = jwt?.realm_access?.roles?.filter(
            (role) => role === role.toUpperCase(),
        );
        return user;
    }
}

export enum UserRole {
    ADMIN = 'ADMIN',
    FREE_USER = 'FREE_USER',
}
