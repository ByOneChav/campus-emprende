package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.Comment;

import java.util.List;
import java.util.Optional;

// 🗄️ Repositorio de comentarios
// Extiende JpaRepository → CRUD automático (save, findAll, delete, etc.)
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 📥 Obtener comentarios por ID de servicio
    // Ordenados por fecha descendente (más recientes primero)
    List<Comment> findByServiceIdOrderByCreatedAtDesc(Long serviceId);

    // 📊 Contar cantidad de comentarios de un servicio
    long countByServiceId(Long serviceId);

    // 🔐 Buscar comentario SOLO si pertenece al autor
    // Usado para validar ownership en delete
    Optional<Comment> findByIdAndAuthorId(Long id, Long authorId);
}