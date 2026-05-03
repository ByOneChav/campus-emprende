package com.zosh.services;

import com.zosh.exception.UserException;
import com.zosh.payload.request.CommentRequest;
import com.zosh.payload.response.CommentResponse;

import java.util.List;

// 🧠 Interfaz del servicio de comentarios
// Define el CONTRATO del módulo Comment (qué se puede hacer)
public interface CommentService {

    // ✍️ Crear un comentario en un servicio
    // Recibe el ID del servicio y los datos del request
    // Puede lanzar excepción si hay problemas (auth, validación, etc.)
    CommentResponse addComment(Long serviceId, CommentRequest request) throws UserException;

    // 📥 Obtener todos los comentarios de un servicio
    // Retorna lista de DTOs listos para el frontend
    List<CommentResponse> getCommentsByService(Long serviceId);

    // ❌ Eliminar un comentario por ID
    // Puede fallar si el usuario no es dueño o no existe
    void deleteComment(Long commentId) throws UserException;
}