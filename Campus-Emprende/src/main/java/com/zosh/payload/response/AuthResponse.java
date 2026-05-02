package com.zosh.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 📤 DTO de respuesta de autenticación
// Se envía al cliente después de login o signup
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // No incluye campos null en el JSON
public class AuthResponse {

    
	private String jwt; // 🎟️ Token JWT generado (usado para futuras peticiones)

    // 💬 Mensaje informativo (ej: login exitoso)
	private String message;

    // 🏷️ Título de la respuesta (ej: Bienvenido)
	private String title;

    // 👤 Datos del usuario autenticado (DTO)
	private UserDTO user;
	
}