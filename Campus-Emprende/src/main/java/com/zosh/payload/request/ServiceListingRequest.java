package com.zosh.payload.request;

import com.zosh.domain.ServiceCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

// 📥 DTO de entrada para crear o actualizar servicios
// Representa los datos que envía el cliente
@Data
public class ServiceListingRequest {

    // 📝 Título del servicio (obligatorio)
    @NotBlank(message = "Title is required")
    private String title;

    // 📄 Descripción del servicio (obligatorio)
    @NotBlank(message = "Description is required")
    private String description;

    // 🏷️ Categoría del servicio (obligatoria)
    @NotNull(message = "Category is required")
    private ServiceCategory category;

    // 🖼️ Imagen del servicio (opcional)
    private String imageUrl;
}