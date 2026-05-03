package com.zosh.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

// Clase de respuesta genérica para enviar mensajes y estado en la API
@Data
@AllArgsConstructor
public class ApiResponse {
    
    // Mensaje descriptivo de la respuesta
    private String message;
    
    // Estado de la operación (true = éxito, false = error)
    private Boolean status;
}