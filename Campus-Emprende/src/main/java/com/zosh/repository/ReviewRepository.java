package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.Review;

import java.util.List;
import java.util.Optional;

// 🗄️ Repositorio de Review
// Maneja acceso a BD para las reseñas
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 🔍 Buscar reseña por ID de solicitud (1 review por solicitud)
    Optional<Review> findByServiceRequestId(Long serviceRequestId);

    // 🚫 Verificar si ya existe reseña (evitar duplicados)
    boolean existsByServiceRequestId(Long serviceRequestId);

    // 📥 Obtener reseñas por servicio
    // Navega: Review → ServiceRequest → Service → ID
    List<Review> findByServiceRequestServiceId(Long serviceId);

    // 👤 Obtener reseñas por proveedor
    // Navega: Review → ServiceRequest → Service → Provider → ID
    List<Review> findByServiceRequestServiceProviderId(Long providerId);

    // 👍 Reseñas positivas (rating >= valor)
    List<Review> findByRatingGreaterThanEqual(Short rating);

    // 👎 Reseñas negativas (rating <= valor)
    List<Review> findByRatingLessThanEqual(Short rating);
}