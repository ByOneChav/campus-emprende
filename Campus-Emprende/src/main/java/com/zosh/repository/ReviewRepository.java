package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByServiceRequestId(Long serviceRequestId);
    boolean existsByServiceRequestId(Long serviceRequestId);
    List<Review> findByServiceRequestServiceId(Long serviceId);
    List<Review> findByServiceRequestServiceProviderId(Long providerId);
    List<Review> findByRatingGreaterThanEqual(Short rating);
    List<Review> findByRatingLessThanEqual(Short rating);
}
