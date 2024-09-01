package com.mally.api.auth;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Collection;


@Getter
@Setter
public class UserJwt extends JwtAuthenticationToken {

    private String firstName;

    private String lastName;

    public UserJwt(Jwt jwt, Collection<? extends GrantedAuthority> authorities) {
        super(jwt, authorities);
    }

    public String getId() {
        return getName();
    }
}
