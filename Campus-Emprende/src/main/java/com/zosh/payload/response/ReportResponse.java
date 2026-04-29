package com.zosh.payload.response;

import com.zosh.domain.ReportStatus;
import com.zosh.domain.ReportTargetType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReportResponse {
    private Long id;
    private Long reporterId;
    private String reporterName;
    private ReportTargetType targetType;
    private Long targetId;
    private String reason;
    private ReportStatus status;
    private String adminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
