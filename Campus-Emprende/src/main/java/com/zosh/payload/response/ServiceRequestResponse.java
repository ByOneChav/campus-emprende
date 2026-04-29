package com.zosh.payload.response;

import com.zosh.domain.CancelledBy;
import com.zosh.domain.RequestStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ServiceRequestResponse {
    private Long id;
    private Long serviceId;
    private String serviceTitle;
    private Long clientId;
    private String clientName;
    private Long providerId;
    private String providerName;
    private String message;
    private RequestStatus status;
    private CancelledBy cancelledBy;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
