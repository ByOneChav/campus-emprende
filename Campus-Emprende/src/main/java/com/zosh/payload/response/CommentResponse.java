package com.zosh.payload.response;

import lombok.Data;

import java.time.LocalDateTime;

// 📤 DTO de salida para Comment
// Representa los datos que se envían al frontend
@Data
public class CommentResponse {

    // 🆔 ID del comentario
    private Long id;

    // 📌 ID del servicio al que pertenece el comentario
    private Long serviceId;

    // 👤 ID del usuario que escribió el comentario
    private Long authorId;

    // 👤 Nombre del autor (para mostrar en UI)
    private String authorName;

    // 💬 Contenido del comentario
    private String content;

    // 📅 Fecha de creación
    private LocalDateTime createdAt;
}