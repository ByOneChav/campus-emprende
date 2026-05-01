package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ReviewRequest;
import com.zosh.payload.response.ReviewResponse;
import com.zosh.services.ReviewService;
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

// Agrupa endpoints relacionados a reseñas
@Tag(
    name = "Reseñas",
    description = "Endpoints para gestión de reseñas de servicios y proveedores"
)
public class ReviewController {

    private final ReviewService reviewService;

    // Crear una reseña para una solicitud de servicio
    @Operation(
        summary = "Registrar reseña de un servicio",
        description = "Permite a un usuario registrar una reseña asociada a una solicitud de servicio finalizada"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reseña registrada correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "401", description = "No autorizado"),
        @ApiResponse(responseCode = "404", description = "Solicitud no encontrada"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/api/requests/{requestId}/review")
    public ResponseEntity<ReviewResponse> submitReview(
            @PathVariable Long requestId,
            @RequestBody @Valid ReviewRequest request) throws UserException {

        // Se registra la reseña en el sistema
        return ResponseEntity.ok(reviewService.submitReview(requestId, request));
    }

    // Obtener reseñas asociadas a un servicio
    @Operation(
        summary = "Obtener reseñas de un servicio",
        description = "Devuelve todas las reseñas asociadas a un servicio específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reseñas obtenidas correctamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/services/{serviceId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getServiceReviews(@PathVariable Long serviceId) {

        // Se obtienen las reseñas del servicio
        return ResponseEntity.ok(reviewService.getReviewsByService(serviceId));
    }

    // Obtener reseñas asociadas a un proveedor
    @Operation(
        summary = "Obtener reseñas de un proveedor",
        description = "Devuelve todas las reseñas asociadas a un proveedor específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reseñas obtenidas correctamente"),
        @ApiResponse(responseCode = "404", description = "Proveedor no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/profiles/{userId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getProviderReviews(@PathVariable Long userId) {

        // Se obtienen las reseñas del proveedor
        return ResponseEntity.ok(reviewService.getReviewsByProvider(userId));
    }
}