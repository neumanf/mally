package com.mally.api.auth;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.ArrayList;
import java.util.List;

public class UserJwtConverter implements Converter<Jwt, UserJwt> {
    @Override
    public UserJwt convert(Jwt source) {
        var grantedAuthorities = extractAuthorities(source);
        var userJwt = new UserJwt(source, grantedAuthorities);

        userJwt.setFirstName(source.getClaimAsString("given_name"));
        userJwt.setLastName(source.getClaimAsString("family_name"));

        return userJwt;
    }

    private List<GrantedAuthority> extractAuthorities(Jwt source) {
        var result = new ArrayList<GrantedAuthority>();

        var realmAccess = source.getClaimAsMap("realm_access");

        if (realmAccess != null && realmAccess.containsKey("roles")) {
            var roles = (List<String>) realmAccess.get("roles");
            roles.forEach(role -> result.add(new SimpleGrantedAuthority("ROLE_" + role)));
        }

        return result;
    }
}
