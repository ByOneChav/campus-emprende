package com.zosh.payload.request;

import lombok.Data;

// 📥 DTO para login
// Representa los datos que envía el cliente al iniciar sesión
@Data
public class LoginRequest {

    // 📧 Email del usuario (usado como username)
    private String email;

    // 🔐 Contraseña en texto plano (luego se valida y compara en el backend)
    private String password;
}