package com.zosh.Tests;

import com.zosh.domain.UserRole;
import com.zosh.model.User;
import com.zosh.repository.UserRepository;
import com.zosh.services.impl.DataInitializationComponent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// 🧪 Pruebas unitarias para DataInitializationComponent
// Verifica la lógica de "seed" del usuario administrador al arrancar la app.
@ExtendWith(MockitoExtension.class)
class DataInitializationComponentTest {

    // 🔗 Repositorio de usuarios (mockeado)
    @Mock
    private UserRepository userRepository;

    // 🔐 Encoder de contraseñas (mockeado)
    @Mock
    private PasswordEncoder passwordEncoder;

    // 🧩 Clase real que se está probando
    @InjectMocks
    private DataInitializationComponent dataInitializationComponent;

    // 📌 Email fijo del administrador definido en el componente
    private static final String ADMIN_EMAIL = "elia.delgado@duocuc.cl";

    // =====================================================
    // 🚀 run() — Inicialización al arrancar la aplicación
    // =====================================================

    // 🧪 Crea el usuario administrador con los datos correctos si todavía no existe
    @Test
    void run_createsAdminUser_whenNotExists() throws Exception {
        // 🚫 Aún no existe un usuario con ese email
        when(userRepository.findByEmail(ADMIN_EMAIL)).thenReturn(null);

        // 🔐 La contraseña en texto plano se "encripta"
        when(passwordEncoder.encode("eliasbombom")).thenReturn("encoded-password");

        dataInitializationComponent.run();

        // 🔍 Captura el usuario que se guardó para validar sus campos
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedAdmin = userCaptor.getValue();
        assertEquals(ADMIN_EMAIL, savedAdmin.getEmail());
        assertEquals("Elias Bombom", savedAdmin.getFullName());
        assertEquals("encoded-password", savedAdmin.getPassword());
        assertEquals(UserRole.ROLE_ADMIN, savedAdmin.getRole());
    }

    // 🧪 No crea (ni vuelve a guardar) el usuario administrador si ya existe
    @Test
    void run_doesNotCreateAdminUser_whenAlreadyExists() throws Exception {
        // 👤 Ya existe un usuario admin
        User existingAdmin = new User();
        existingAdmin.setEmail(ADMIN_EMAIL);
        existingAdmin.setRole(UserRole.ROLE_ADMIN);

        when(userRepository.findByEmail(ADMIN_EMAIL)).thenReturn(existingAdmin);

        dataInitializationComponent.run();

        // 🔍 No se debe crear/guardar un nuevo usuario
        verify(userRepository, never()).save(any(User.class));

        // 🔍 Tampoco debería encriptarse ninguna contraseña nueva
        verify(passwordEncoder, never()).encode(any(String.class));
    }
}