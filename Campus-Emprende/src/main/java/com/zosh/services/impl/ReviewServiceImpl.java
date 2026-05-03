package com.zosh.services.impl;

import com.zosh.domain.RequestStatus;
import com.zosh.exception.UserException;
import com.zosh.mapper.ReviewMapper;
import com.zosh.model.Review;
import com.zosh.model.ServiceRequest;
import com.zosh.model.User;
import com.zosh.payload.request.ReviewRequest;
import com.zosh.payload.response.ReviewResponse;
import com.zosh.repository.ReviewRepository;
import com.zosh.repository.ServiceRequestRepository;
import com.zosh.services.ReviewService;
import com.zosh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    // 🗄️ Repositorio de reseñas
    private final ReviewRepository reviewRepository;

    // 🗄️ Repositorio de solicitudes (clave para validar flujo)
    private final ServiceRequestRepository serviceRequestRepository;

    // 🔐 Usuario autenticado (JWT)
    private final UserService userService;

    // ⭐ CREAR RESEÑA
    @Override
    public ReviewResponse submitReview(Long serviceRequestId, ReviewRequest request) throws UserException {

        // 👤 Usuario actual (cliente)
        User reviewer = userService.getCurrentUser();

        // 🔍 Buscar la solicitud de servicio
        ServiceRequest sr = serviceRequestRepository.findById(serviceRequestId)
                .orElseThrow(() -> new UserException("Solicitud de servicio no encontrada"));

        // 🔐 Validación: solo el cliente puede reseñar
        if (!sr.getClient().getId().equals(reviewer.getId())) {
            throw new UserException("Solo el cliente puede dejar una reseña.");
        }

        // ⚠️ Validación: debe estar en estado COMPLETADO
        if (sr.getStatus() != RequestStatus.COMPLETADO) {
            throw new UserException("La reseña solo se puede enviar una vez que se haya completado el servicio.");
        }

        // ⚠️ Validación: el cliente debe haber confirmado finalización
        if (sr.getCompletedAt() == null) {
            throw new UserException("Por favor, confirme que ha finalizado el proceso antes de dejar una reseña.");
        }

        // 🚫 Validación: evitar reseñas duplicadas
        if (reviewRepository.existsByServiceRequestId(serviceRequestId)) {
            throw new UserException("Ya existe una reseña para esta solicitud.");
        }

        // 🧱 Construcción de la reseña
        Review review = Review.builder()
                .serviceRequest(sr)
                .reviewer(reviewer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        // 💾 Guardar y mapear a DTO
        return ReviewMapper.toResponse(reviewRepository.save(review));
    }

    // 📥 Obtener reseñas por servicio
    @Override
    public List<ReviewResponse> getReviewsByService(Long serviceId) {

        // Navega: Review → ServiceRequest → Service → ID
        return ReviewMapper.toResponseList(
                reviewRepository.findByServiceRequestServiceId(serviceId));
    }

    // 👤 Obtener reseñas por proveedor
    @Override
    public List<ReviewResponse> getReviewsByProvider(Long userId) {

        // Navega: Review → ServiceRequest → Service → Provider → ID
        return ReviewMapper.toResponseList(
                reviewRepository.findByServiceRequestServiceProviderId(userId));
    }

    // 📊 Todas las reseñas (admin)
    @Override
    public List<ReviewResponse> getAllReviews() {
        return ReviewMapper.toResponseList(reviewRepository.findAll());
    }

    // 👍 Reseñas positivas (rating >= 4)
    @Override
    public List<ReviewResponse> getGoodReviews() {
        return ReviewMapper.toResponseList(
                reviewRepository.findByRatingGreaterThanEqual((short) 4));
    }

    // 👎 Reseñas negativas (rating <= 2)
    @Override
    public List<ReviewResponse> getBadReviews() {
        return ReviewMapper.toResponseList(
                reviewRepository.findByRatingLessThanEqual((short) 2));
    }
}