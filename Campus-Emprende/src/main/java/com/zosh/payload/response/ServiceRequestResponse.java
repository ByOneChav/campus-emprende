package com.zosh.payload.response;

import com.zosh.domain.CancelledBy;
import com.zosh.domain.RequestStatus;
import lombok.Data;

import java.time.LocalDateTime;

// 📤 DTO de salida para ServiceRequest
// Representa la información que se envía al frontend
@Data
public class ServiceRequestResponse {

    // 🆔 ID de la solicitud
    private Long id;

    // 📌 Datos del servicio solicitado
    private Long serviceId;
    private String serviceTitle;

    // 👤 Datos del cliente (quien solicita)
    private Long clientId;
    private String clientName;

    // 👤 Datos del proveedor (dueño del servicio)
    private Long providerId;
    private String providerName;

    // 💬 Mensaje enviado por el cliente
    private String message;

    // 🔄 Estado del flujo de la solicitud
    private RequestStatus status;

    // 🚫 Quién canceló la solicitud (cliente o proveedor)
    private CancelledBy cancelledBy;

    // ⏱ Fecha en que el cliente confirmó finalización
    private LocalDateTime completedAt;

    // 📅 Fechas de auditoría
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}