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
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

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
    @Operation(
        summary = "Obtener comentarios por servicio",
        description = "Devuelve todos los comentarios asociados a un servicio específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comentarios obtenidos correctamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/services/{serviceId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long serviceId) {

        // Se obtienen los comentarios del servicio
        return ResponseEntity.ok(commentService.getCommentsByService(serviceId));
    }

    // Crear un comentario para un servicio
    @Operation(
        summary = "Agregar comentario a un servicio",
        description = "Permite a un usuario agregar un comentario a un servicio específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comentario creado correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "401", description = "No autorizado"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/api/services/{serviceId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long serviceId,
            @RequestBody @Valid CommentRequest request) throws UserException {

        // Se agrega el comentario al servicio
        return ResponseEntity.ok(commentService.addComment(serviceId, request));
    }

    // Eliminar un comentario por ID
    @Operation(
        summary = "Eliminar comentario por ID",
        description = "Permite eliminar un comentario existente por su identificador"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Comentario eliminado correctamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado"),
        @ApiResponse(responseCode = "404", description = "Comentario no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @DeleteMapping("/api/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) throws UserException {

        // Se elimina el comentario
        commentService.deleteComment(id);

        return ResponseEntity.noContent().build();
    }
}