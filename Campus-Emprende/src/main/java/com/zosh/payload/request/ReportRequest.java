package com.zosh.payload.request;

import com.zosh.domain.ReportTargetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReportRequest {

    @NotNull(message = "Target type is required")
    private ReportTargetType targetType; // tipo de objetivo (USER, SERVICE, etc.)

    @NotNull(message = "Target ID is required")
    private Long targetId; // id del objeto reportado

    @NotBlank(message = "Reason is required")
    private String reason; // motivo del reporte
}
