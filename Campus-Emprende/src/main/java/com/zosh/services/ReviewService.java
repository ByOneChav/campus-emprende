package com.zosh.services;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ReviewRequest;
import com.zosh.payload.response.ReviewResponse;

import java.util.List;

// 🧠 Interfaz del servicio de reseñas
// Define las operaciones del módulo Review
public interface ReviewService {

    // ⭐ Crear una reseña asociada a una solicitud de servicio
    ReviewResponse submitReview(Long serviceRequestId, ReviewRequest request) throws UserException;

    // 📥 Obtener reseñas de un servicio específico
    List<ReviewResponse> getReviewsByService(Long serviceId);

    // 👤 Obtener reseñas de un proveedor específico
    List<ReviewResponse> getReviewsByProvider(Long userId);

    // 👑 FUNCIONES ADMIN

    // 📊 Obtener todas las reseñas
    List<ReviewResponse> getAllReviews();

    // 👍 Obtener reseñas positivas
    List<ReviewResponse> getGoodReviews();

    // 👎 Obtener reseñas negativas
    List<ReviewResponse> getBadReviews();
}