package com.mally.api.auth;

import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class AuthenticationManager {

    public static boolean isAuthenticated() {
        var user = SecurityContextHolder.getContext().getAuthentication();
        return user instanceof UserJwt;
    }

    public static Optional<UserJwt> getAuthenticatedUser() {
        if (!isAuthenticated()) {
            return Optional.empty();
        }
        return Optional.of((UserJwt) SecurityContextHolder.getContext().getAuthentication());
    }

}
