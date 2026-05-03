package com.zosh.services.impl;

import com.zosh.domain.UserRole;
import com.zosh.model.User;
import com.zosh.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Componente que se ejecuta al iniciar la aplicación para inicializar datos
@Component
@RequiredArgsConstructor
public class DataInitializationComponent implements CommandLineRunner {

    // Repositorio para gestionar usuarios
    private final UserRepository userRepository;
    
    // Encoder para encriptar contraseñas
    private final PasswordEncoder passwordEncoder;


    // Método que se ejecuta automáticamente al arrancar la aplicación
    @Override
    public void run(String... args) {
        initializeAdminUser();
    }

    // Inicializa un usuario administrador si no existe
    private void initializeAdminUser() {
        String adminUsername = "eliasbombom@gmail.com";

        // Verifica si el usuario admin ya existe
        if (userRepository.findByEmail(adminUsername)==null) {
            User adminUser = new User();

            // Asigna contraseña encriptada
            adminUser.setPassword(passwordEncoder.encode("eliasbombom"));
            
            // Asigna nombre completo
            adminUser.setFullName("Elias Bombom");
            
            // Asigna email del administrador
            adminUser.setEmail(adminUsername);
            
            // Asigna rol de administrador
            adminUser.setRole(UserRole.ROLE_ADMIN);

            // Guarda el usuario en la base de datos
            User admin=userRepository.save(adminUser);
        }
    }
}