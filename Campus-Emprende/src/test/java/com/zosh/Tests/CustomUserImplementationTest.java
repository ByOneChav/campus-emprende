package com.zosh.Tests;

import com.zosh.domain.UserRole;
import com.zosh.model.User;
import com.zosh.repository.UserRepository;
import com.zosh.services.impl.CustomUserImplementation;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// 🧪 Pruebas unitarias para CustomUserImplementation (UserDetailsService)
// Verifica cómo se traduce un User de la BD al UserDetails que usa Spring Security.
@ExtendWith(MockitoExtension.class)
class CustomUserImplementationTest {

    // 🔗 Repositorio de usuarios (mockeado)
    // Nota: en la clase real se inyecta con @Autowired sobre el campo,
    // pero @InjectMocks de Mockito también funciona con inyección por campo.
    @Mock
    private UserRepository userRepository;

    // 🧩 Clase real que se está probando
    @InjectMocks
    private CustomUserImplementation customUserImplementation;

    // =====================================================
    // 🔐 loadUserByUsername() — Cargar usuario para autenticación
    // =====================================================

    // 🧪 Carga correctamente un usuario existente y mapea su rol como autoridad
    @Test
    void loadUserByUsername_success() {
        User user = new User();
        user.setEmail("test@mail.com");
        user.setPassword("encoded-password");
        user.setRole(UserRole.ROLE_STUDENT);

        when(userRepository.findByEmail("test@mail.com")).thenReturn(user);

        UserDetails result = customUserImplementation.loadUserByUsername("test@mail.com");

        // ✅ El "username" de Spring Security es el email
        assertEquals("test@mail.com", result.getUsername());

        // ✅ La contraseña se pasa tal cual (ya viene encriptada de la BD)
        assertEquals("encoded-password", result.getPassword());

        // ✅ El rol del usuario se mapea como una autoridad de Spring Security
        assertEquals(1, result.getAuthorities().size());
        assertTrue(result.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority -> authority.equals(UserRole.ROLE_STUDENT.toString())));
    }

    // 🧪 Mapea correctamente un usuario con rol ADMIN
    @Test
    void loadUserByUsername_adminRole() {
        User admin = new User();
        admin.setEmail("admin@mail.com");
        admin.setPassword("encoded-admin-password");
        admin.setRole(UserRole.ROLE_ADMIN);

        when(userRepository.findByEmail("admin@mail.com")).thenReturn(admin);

        UserDetails result = customUserImplementation.loadUserByUsername("admin@mail.com");

        assertTrue(result.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority -> authority.equals(UserRole.ROLE_ADMIN.toString())));
    }

    // 🧪 Lanza UsernameNotFoundException si no existe un usuario con ese email
    @Test
    void loadUserByUsername_notFound() {
        when(userRepository.findByEmail("noexiste@mail.com")).thenReturn(null);

        assertThrows(UsernameNotFoundException.class,
                () -> customUserImplementation.loadUserByUsername("noexiste@mail.com"));
    }
}