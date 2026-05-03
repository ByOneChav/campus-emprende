package com.zosh.oauth2;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.zosh.model.User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

// Implementación personalizada de OAuth2User para integrar usuario del sistema con Spring Security
public class OAuth2UserPrincipal implements OAuth2User {

    // Entidad usuario del sistema
    private User user;

    // Atributos obtenidos del proveedor OAuth2 (Google)
    private Map<String, Object> attributes;

    // Constructor que inicializa usuario y atributos
    public OAuth2UserPrincipal(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    // Retorna los atributos del usuario OAuth2
    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    // Retorna las autoridades (roles) del usuario para Spring Security
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
                new SimpleGrantedAuthority(user.getRole().name()));
    }

    // Retorna el identificador principal del usuario (email)
    @Override
    public String getName() {
        return user.getEmail();
    }

    // Retorna la entidad completa del usuario
    public User getUser() {
        return user;
    }
}