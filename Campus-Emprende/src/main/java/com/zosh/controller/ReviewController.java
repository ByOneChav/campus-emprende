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
    @Operation(summary = "Registrar reseña de un servicio")
    @PostMapping("/api/requests/{requestId}/review")
    public ResponseEntity<ReviewResponse> submitReview(
            @PathVariable Long requestId,
            @RequestBody @Valid ReviewRequest request) throws UserException {
        return ResponseEntity.ok(reviewService.submitReview(requestId, request));
    }

    // Obtener reseñas asociadas a un servicio
    @Operation(summary = "Obtener reseñas de un servicio")
    @GetMapping("/services/{serviceId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getServiceReviews(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsByService(serviceId));
    }

    // Obtener reseñas asociadas a un proveedor
    @Operation(summary = "Obtener reseñas de un proveedor")
    @GetMapping("/profiles/{userId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getProviderReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByProvider(userId));
    }
}