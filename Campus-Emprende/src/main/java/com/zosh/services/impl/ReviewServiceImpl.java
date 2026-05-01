package com.zosh.services.impl;

import com.zosh.domain.RequestStatus;
import com.zosh.exception.UserException;
import com.zosh.mapper.ReviewMapper;
import com.zosh.modal.Review;
import com.zosh.modal.ServiceRequest;
import com.zosh.modal.User;
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

    private final ReviewRepository reviewRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final UserService userService;

    @Override
    public ReviewResponse submitReview(Long serviceRequestId, ReviewRequest request) throws UserException {
        User reviewer = userService.getCurrentUser();

        ServiceRequest sr = serviceRequestRepository.findById(serviceRequestId)
                .orElseThrow(() -> new UserException("Solicitud de servicio no encontrada"));

        if (!sr.getClient().getId().equals(reviewer.getId())) {
            throw new UserException("Solo el cliente puede dejar una reseña.");
        }
        if (sr.getStatus() != RequestStatus.COMPLETADO) {
            throw new UserException("La reseña solo se puede enviar una vez que se haya completado el servicio.");
        }
        if (sr.getCompletedAt() == null) {
            throw new UserException("Por favor, confirme que ha finalizado el proceso antes de dejar una reseña.");
        }
        if (reviewRepository.existsByServiceRequestId(serviceRequestId)) {
            throw new UserException("Ya existe una reseña para esta solicitud.");
        }

        Review review = Review.builder()
                .serviceRequest(sr)
                .reviewer(reviewer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return ReviewMapper.toResponse(reviewRepository.save(review));
    }

    @Override
    public List<ReviewResponse> getReviewsByService(Long serviceId) {
        return ReviewMapper.toResponseList(reviewRepository.findByServiceRequestServiceId(serviceId));
    }

    @Override
    public List<ReviewResponse> getReviewsByProvider(Long userId) {
        return ReviewMapper.toResponseList(reviewRepository.findByServiceRequestServiceProviderId(userId));
    }

    @Override
    public List<ReviewResponse> getAllReviews() {
        return ReviewMapper.toResponseList(reviewRepository.findAll());
    }

    @Override
    public List<ReviewResponse> getGoodReviews() {
        return ReviewMapper.toResponseList(reviewRepository.findByRatingGreaterThanEqual((short) 4));
    }

    @Override
    public List<ReviewResponse> getBadReviews() {
        return ReviewMapper.toResponseList(reviewRepository.findByRatingLessThanEqual((short) 2));
    }
}
