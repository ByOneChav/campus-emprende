package com.zosh.services;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ReviewRequest;
import com.zosh.payload.response.ReviewResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse submitReview(Long serviceRequestId, ReviewRequest request) throws UserException;
    List<ReviewResponse> getReviewsByService(Long serviceId);
    List<ReviewResponse> getReviewsByProvider(Long userId);

    // admin
    List<ReviewResponse> getAllReviews();
    List<ReviewResponse> getGoodReviews();
    List<ReviewResponse> getBadReviews();
}
