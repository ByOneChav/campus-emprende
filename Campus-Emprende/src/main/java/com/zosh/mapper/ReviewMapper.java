package com.zosh.mapper;

import com.zosh.model.Review;
import com.zosh.payload.response.ReviewResponse;

import java.util.List;
import java.util.stream.Collectors;

// 🔄 Mapper de Review
// Convierte Entity → DTO (respuesta al frontend)
public class ReviewMapper {

    public static ReviewResponse toResponse(Review r) {

        // 📦 Crear objeto de respuesta
        ReviewResponse res = new ReviewResponse();

        // 🆔 ID de la reseña
        res.setId(r.getId());

        // 🔗 Datos de la solicitud asociada
        res.setServiceRequestId(r.getServiceRequest().getId());

        // 📌 Datos del servicio
        res.setServiceId(r.getServiceRequest().getService().getId());
        res.setServiceTitle(r.getServiceRequest().getService().getTitle());

        // 👤 Datos del reviewer (cliente)
        res.setReviewerId(r.getReviewer().getId());
        res.setReviewerName(r.getReviewer().getFullName());

        // ⭐ Calificación y comentario
        res.setRating(r.getRating());
        res.setComment(r.getComment());

        // 📅 Fecha de creación
        res.setCreatedAt(r.getCreatedAt());

        return res;
    }

    // 🔄 Conversión lista de reseñas → lista de DTOs
    public static List<ReviewResponse> toResponseList(List<Review> list) {

        return list.stream()
                .map(ReviewMapper::toResponse)
                .collect(Collectors.toList());
    }
}