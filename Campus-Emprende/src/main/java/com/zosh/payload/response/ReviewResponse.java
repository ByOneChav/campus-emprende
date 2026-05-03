package com.zosh.payload.response;

import lombok.Data;

import java.time.LocalDateTime;

// 📤 DTO de salida para Review
// Representa la información que se envía al frontend
@Data
public class ReviewResponse {

    // 🆔 ID de la reseña
    private Long id;

    // 🔗 ID de la solicitud asociada
    private Long serviceRequestId;

    // 📌 Datos del servicio
    private Long serviceId;
    private String serviceTitle;

    // 👤 Datos del usuario que deja la reseña (cliente)
    private Long reviewerId;
    private String reviewerName;

    // ⭐ Calificación del servicio
    private Short rating;

    // 💬 Comentario del cliente
    private String comment;

    // 📅 Fecha de creación de la reseña
    private LocalDateTime createdAt;
}
