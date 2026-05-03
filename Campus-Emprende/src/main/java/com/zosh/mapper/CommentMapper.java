package com.zosh.mapper;

import com.zosh.model.Comment;
import com.zosh.payload.response.CommentResponse;

import java.util.List;
import java.util.stream.Collectors;

// 🔄 Mapper de Comment
// Convierte Entity → DTO (respuesta para frontend)
public class CommentMapper {

    // 🔄 Conversión de un Comment → CommentResponse
    public static CommentResponse toResponse(Comment c) {

        // 📦 Crear objeto de respuesta
        CommentResponse res = new CommentResponse();

        // 🆔 ID del comentario
        res.setId(c.getId());

        // 📌 ID del servicio asociado
        res.setServiceId(c.getService().getId());

        // 👤 Datos del autor (usuario que comenta)
        res.setAuthorId(c.getAuthor().getId());
        res.setAuthorName(c.getAuthor().getFullName());

        // 💬 Contenido del comentario
        res.setContent(c.getContent());

        // 📅 Fecha de creación
        res.setCreatedAt(c.getCreatedAt());

        return res;
    }

    // 🔄 Conversión de lista de comentarios → lista de DTOs
    public static List<CommentResponse> toResponseList(List<Comment> list) {

        return list.stream()
                .map(CommentMapper::toResponse) // aplica conversión a cada elemento
                .collect(Collectors.toList());  // convierte a lista
    }
}