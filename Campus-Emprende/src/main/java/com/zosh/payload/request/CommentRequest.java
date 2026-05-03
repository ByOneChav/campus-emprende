package com.zosh.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// 📥 DTO de entrada para crear un comentario
// Representa los datos que envía el cliente
@Data
public class CommentRequest {

    // 💬 Contenido del comentario (obligatorio)
    @NotBlank(message = "Comment content is required")
    private String content;
}