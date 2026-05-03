package com.zosh.services.impl;

import com.zosh.exception.UserException;
import com.zosh.mapper.CommentMapper;
import com.zosh.model.Comment;
import com.zosh.model.ServiceListing;
import com.zosh.model.User;
import com.zosh.payload.request.CommentRequest;
import com.zosh.payload.response.CommentResponse;
import com.zosh.repository.CommentRepository;
import com.zosh.repository.ServiceListingRepository;
import com.zosh.services.CommentService;
import com.zosh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// 🧠 Implementación real del servicio de comentarios
// Aquí vive la lógica de negocio del módulo Comment
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    // 🔗 Repositorio de comentarios (persistencia)
    private final CommentRepository commentRepository;

    // 🔗 Repositorio de servicios (para validar existencia)
    private final ServiceListingRepository serviceListingRepository;

    // 🔐 Servicio de usuario (para obtener usuario autenticado)
    private final UserService userService;

    // ============================
    // ✍️ CREAR COMENTARIO
    // ============================

    @Override
    public CommentResponse addComment(Long serviceId, CommentRequest request) throws UserException {

        // 🔐 Obtener usuario autenticado (JWT)
        User author = userService.getCurrentUser();

        // 🔎 Buscar el servicio
        ServiceListing service = serviceListingRepository.findById(serviceId)
                .orElseThrow(() -> new UserException("Servicio no encontrado con ID " + serviceId));

        // 🧱 Construcción del comentario
        Comment comment = Comment.builder()
                .service(service)          // relación con el servicio
                .author(author)            // usuario que comenta
                .content(request.getContent()) // contenido del comentario
                .build();

        // 💾 Guardar en BD + convertir a DTO
        return CommentMapper.toResponse(commentRepository.save(comment));
    }

    // ============================
    // 📥 OBTENER COMENTARIOS
    // ============================

    @Override
    public List<CommentResponse> getCommentsByService(Long serviceId) {

        // 🔎 Busca comentarios por servicio ordenados por fecha (desc)
        return CommentMapper.toResponseList(
                commentRepository.findByServiceIdOrderByCreatedAtDesc(serviceId));
    }

    // ============================
    // ❌ ELIMINAR COMENTARIO
    // ============================

    @Override
    public void deleteComment(Long commentId) throws UserException {

        // 🔐 Usuario autenticado
        User current = userService.getCurrentUser();

        // 🔎 Buscar comentario SOLO si pertenece al usuario
        Comment comment = commentRepository.findByIdAndAuthorId(commentId, current.getId())
                .orElseThrow(() -> new UserException("Comentario no encontrado o usted no es el autor."));

        // 🗑️ Eliminar comentario
        commentRepository.delete(comment);
    }
}