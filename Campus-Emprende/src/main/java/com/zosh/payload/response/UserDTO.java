package com.zosh.payload.response;

import com.zosh.domain.UserRole;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// 📤 DTO de usuario
// Representa los datos que se envían al frontend (respuesta)
@Data
@NoArgsConstructor
public class UserDTO {

    // 🆔 Identificador del usuario
    private Long id;

    // 📧 Email del usuario (login)
    private String email;

    // 🔐 Contraseña (⚠️ normalmente no debería enviarse en response)
    private String password;

    // 📱 Teléfono
    private String phone;

    // 👤 Nombre completo
    private String fullName;

    // 🎭 Rol del usuario (ADMIN, STUDENT, etc.)
    private UserRole role;

    // 🏷️ Username (puede ser alias o derivado del email)
    private String username;

    // 🕒 Último inicio de sesión
    private LocalDateTime lastLogin;

}