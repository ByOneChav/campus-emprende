package com.zosh.payload.response;

import com.zosh.domain.ServiceCategory;
import com.zosh.domain.ServiceStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ServiceListingResponse {
    private Long id;
    private Long providerId;
    private String providerName;
    private String title;
    private String description;
    private ServiceCategory category;
    private ServiceStatus status;
    private String rejectionReason;
    private String imageUrl;
    private long commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
