package com.zosh.payload.response;

import com.zosh.domain.ServiceCategory;
import com.zosh.domain.ServiceStatus;
import lombok.Data;

import java.time.LocalDateTime;

// 📤 DTO de salida para ServiceListing
// Representa los datos que se envían al frontend
@Data
public class ServiceListingResponse {

    // 🆔 ID del servicio
    private Long id;

    // 👤 Datos del proveedor (usuario)
    private Long providerId;
    private String providerName;

    // 📝 Información del servicio
    private String title;
    private String description;

    // 🏷️ Categoría del servicio
    private ServiceCategory category;

    // 🔄 Estado del servicio (flujo de negocio)
    private ServiceStatus status;

    // ❌ Motivo de rechazo (si aplica)
    private String rejectionReason;

    // 🖼️ Imagen del servicio
    private String imageUrl;

    // 💬 Cantidad de comentarios (dato adicional)
    private long commentCount;

    // 📅 Fechas del servicio
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}