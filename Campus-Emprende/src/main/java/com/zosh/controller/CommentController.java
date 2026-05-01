package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.payload.request.CommentRequest;
import com.zosh.payload.response.CommentResponse;
import com.zosh.services.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Swagger imports
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequiredArgsConstructor

// Agrupa los endpoints de comentarios en Swagger
@Tag(
    name = "Comentarios",
    description = "Endpoints para gestión de comentarios en servicios"
)
public class CommentController {

    private final CommentService commentService;

    // Obtener todos los comentarios de un servicio
    @Operation(summary = "Obtener comentarios por servicio")
    @GetMapping("/services/{serviceId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long serviceId) {
        return ResponseEntity.ok(commentService.getCommentsByService(serviceId));
    }

    // Crear un comentario para un servicio
    @Operation(summary = "Agregar comentario a un servicio")
    @PostMapping("/api/services/{serviceId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long serviceId,
            @RequestBody @Valid CommentRequest request) throws UserException {
        return ResponseEntity.ok(commentService.addComment(serviceId, request));
    }

    // Eliminar un comentario por ID
    @Operation(summary = "Eliminar comentario por ID")
    @DeleteMapping("/api/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) throws UserException {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}