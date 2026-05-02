package com.zosh.mapper;

import com.zosh.model.Review;
import com.zosh.payload.response.ReviewResponse;

import java.util.List;
import java.util.stream.Collectors;

public class ReviewMapper {

    public static ReviewResponse toResponse(Review r) {
        ReviewResponse res = new ReviewResponse();
        res.setId(r.getId());
        res.setServiceRequestId(r.getServiceRequest().getId());
        res.setServiceId(r.getServiceRequest().getService().getId());
        res.setServiceTitle(r.getServiceRequest().getService().getTitle());
        res.setReviewerId(r.getReviewer().getId());
        res.setReviewerName(r.getReviewer().getFullName());
        res.setRating(r.getRating());
        res.setComment(r.getComment());
        res.setCreatedAt(r.getCreatedAt());
        return res;
    }

    public static List<ReviewResponse> toResponseList(List<Review> list) {
        return list.stream().map(ReviewMapper::toResponse).collect(Collectors.toList());
    }
}
