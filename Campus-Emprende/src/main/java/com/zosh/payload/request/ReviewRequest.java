package com.zosh.payload.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

// 📥 DTO de entrada para crear una reseña
// Representa los datos que envía el cliente
@Data
public class ReviewRequest {

    // ⭐ Calificación del servicio (obligatoria)
    // Debe estar entre 1 y 5
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Short rating;

    // 💬 Comentario opcional del cliente
    private String comment;
}