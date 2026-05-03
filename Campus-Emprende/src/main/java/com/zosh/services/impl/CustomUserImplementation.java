package com.zosh.services.impl;

import com.zosh.model.User;
import com.zosh.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

// Implementación personalizada de UserDetailsService para autenticación con Spring Security
@Service
public class CustomUserImplementation implements UserDetailsService {

    // Repositorio para acceder a los usuarios en base de datos
    @Autowired
    private UserRepository userRepository;

    // Carga un usuario por su username (en este caso email)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // Busca el usuario en la base de datos por email
        User user = userRepository.findByEmail(username);

        // Lanza excepción si el usuario no existe
        if (user == null) {
            throw new UsernameNotFoundException("El usuario no existe con el correo electrónico " + username);
        }

        // Convierte el rol del usuario en una autoridad de Spring Security
        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().toString());
        Collection<? extends GrantedAuthority> authorities = Collections.singletonList(authority);

        // Retorna el usuario en formato compatible con Spring Security
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
    }

}
