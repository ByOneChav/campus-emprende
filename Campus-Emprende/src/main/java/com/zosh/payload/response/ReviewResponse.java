package com.zosh.payload.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private Long serviceRequestId;
    private Long serviceId;
    private String serviceTitle;
    private Long reviewerId;
    private String reviewerName;
    private Short rating;
    private String comment;
    private LocalDateTime createdAt;
}
