package com.zosh.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

// 📥 DTO de entrada para crear una solicitud de servicio
// Representa los datos que envía el cliente
@Data
public class ServiceRequestCreate {

    // 🆔 ID del servicio que se quiere solicitar
    @NotNull(message = "Service ID is required")
    private Long serviceId;

    // 💬 Mensaje del cliente (detalle de la solicitud)
    @NotBlank(message = "Message is required")
    private String message;
}