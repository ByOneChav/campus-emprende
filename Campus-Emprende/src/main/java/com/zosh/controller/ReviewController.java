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

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/api/requests/{requestId}/review")
    public ResponseEntity<ReviewResponse> submitReview(
            @PathVariable Long requestId,
            @RequestBody @Valid ReviewRequest request) throws UserException {
        return ResponseEntity.ok(reviewService.submitReview(requestId, request));
    }

    @GetMapping("/services/{serviceId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getServiceReviews(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsByService(serviceId));
    }

    @GetMapping("/profiles/{userId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getProviderReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByProvider(userId));
    }
}
